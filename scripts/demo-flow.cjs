const assert = require('node:assert/strict');
const { Client } = require('pg');
const { writeFileSync } = require('node:fs');

const base = process.env.DEMO_API_URL || 'http://127.0.0.1:55001';
const url = new URL(base);
assert(
  ['localhost', '127.0.0.1'].includes(url.hostname),
  'Demo API must run on localhost.',
);
assert(
  ['55001', '55002'].includes(url.port),
  'Demo API must use port 55001 or 55002.',
);
const label = process.argv[2] || 'original';
assert(['original', 'refactored'].includes(label));
const plate = label === 'original' ? 'CCO1A23' : 'CCN1A23';
const servicePlate = label === 'original' ? 'CSO1A23' : 'CSN1A23';
const db = new Client({
  host: '127.0.0.1',
  port: 55432,
  database: 'plate_vision_clean_code_demo',
  user: 'postgres',
  password: 'demo-only',
});

async function main() {
  const unauthorized = await fetch(`${base}/api/plates/readings`);
  assert.equal(unauthorized.status, 401);
  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'master@email.com', password: 'master1234' }),
  });
  assert.equal(login.status, 201);
  const { token } = await login.json();
  assert.equal(typeof token, 'string');
  const headers = { authorization: `Bearer ${token}` };
  const swagger = await fetch(`${base}/doc-json`);
  assert.equal(swagger.status, 200);
  const document = await swagger.json();
  await db.connect();
  const existing = await db.query(
    'SELECT id FROM vehicles WHERE license_plate = ANY($1)',
    [[plate, servicePlate]],
  );
  assert.equal(
    existing.rowCount,
    0,
    'Demo plates already exist. Start with a fresh disposable demo database.',
  );
  await db.query(
    'INSERT INTO vehicles (license_plate, source, is_service_vehicle) VALUES ($1, $2, $3)',
    [servicePlate, 'MA', true],
  );
  const readings = await db.query(
    'INSERT INTO plate_readings (license_plate, created_at) VALUES ($1, $2), ($3, $4), ($5, $2) RETURNING id',
    [
      plate.toLowerCase(),
      '2026-11-11T12:00:00Z',
      plate,
      '2026-11-11T12:05:00Z',
      servicePlate,
    ],
  );
  const processResponse = await fetch(`${base}/api/plates/readings`, {
    headers,
  });
  assert.equal(processResponse.status, 200);
  const vehicles = await db.query(
    'SELECT id, license_plate, source FROM vehicles WHERE license_plate = $1',
    [plate],
  );
  assert.equal(vehicles.rowCount, 1);
  assert.equal(vehicles.rows[0].source, 'AI');
  const parking = await db.query(
    'SELECT entry_source, exit_source, entry_reading_id, exit_reading_id, entry_time, exit_time FROM parking_records WHERE vehicle_id = $1',
    [vehicles.rows[0].id],
  );
  assert.equal(parking.rowCount, 1);
  assert.equal(parking.rows[0].entry_source, 'AI');
  assert.equal(parking.rows[0].exit_source, 'AI');
  assert.equal(parking.rows[0].entry_reading_id, readings.rows[0].id);
  assert.equal(parking.rows[0].exit_reading_id, readings.rows[1].id);
  assert(parking.rows[0].exit_time > parking.rows[0].entry_time);
  const serviceParking = await db.query(
    'SELECT p.id FROM parking_records p JOIN vehicles v ON v.id = p.vehicle_id WHERE v.license_plate = $1',
    [servicePlate],
  );
  assert.equal(serviceParking.rowCount, 0);
  const processed = await db.query(
    'SELECT id FROM plate_readings WHERE id = ANY($1) AND processed_at IS NOT NULL',
    [readings.rows.map(({ id }) => id)],
  );
  assert.equal(processed.rowCount, 3);
  const emptyResponse = await fetch(`${base}/api/plates/readings`, { headers });
  assert.equal(emptyResponse.status, 200);
  assert.deepEqual(await emptyResponse.json(), {
    message: 'Nenhum dado para atualizar',
  });
  const list = await fetch(`${base}/api/parkings`, { headers });
  assert.equal(list.status, 200);
  const result = {
    version: label,
    checks: {
      unauthorizedStatus: 401,
      loginStatus: 201,
      openApiPaths: Object.keys(document.paths).length,
      processorStatus: 200,
      normalVehiclesCreated: 1,
      licenseUppercased: true,
      parkingRecordsCreated: 1,
      entryAndExitSource: 'AI',
      matchingReadingReferences: true,
      chronologicalParking: true,
      serviceVehicleParkingRecords: 0,
      readingsProcessed: 3,
      noDataMessage: 'Nenhum dado para atualizar',
      parkingListStatus: 200,
    },
  };
  if (process.env.DEMO_REPORT_PATH)
    writeFileSync(
      process.env.DEMO_REPORT_PATH,
      `${JSON.stringify(result, null, 2)}\n`,
    );
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
