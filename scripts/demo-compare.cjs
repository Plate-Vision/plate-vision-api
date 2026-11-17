const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const {
  mkdtempSync,
  rmSync,
  symlinkSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} = require('node:fs');
const { join, resolve } = require('node:path');
const { tmpdir } = require('node:os');

const root = resolve(process.env.DEMO_PROJECT_ROOT || join(__dirname, '..'));
const original = mkdtempSync(join(tmpdir(), 'plate-vision-original-demo-'));
const container = `plate-vision-clean-code-demo-${Date.now()}`;
const image = process.env.DEMO_POSTGRES_IMAGE || 'postgres:18';
const reportDirectory = join(root, 'reports');
let containerCreated = false;
let api;
let apiLog = '';
const run = (command, args, cwd = root, env = process.env) =>
  execFileSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });
const environment = (port) => ({
  ...process.env,
  NODE_ENV: 'development',
  API_URL: `http://localhost:${port}`,
  API_PORT: String(port),
  API_DOC_PASS: 'demo-only',
  API_AUTH_TOKEN: 'isolated-clean-code-demonstration',
  API_CLIENT_URL: 'http://localhost:5173',
  DATABASE_HOST: '127.0.0.1',
  DATABASE_PORT: '55432',
  DATABASE_NAME: 'plate_vision_clean_code_demo',
  DATABASE_USER: 'postgres',
  DATABASE_PASS: 'demo-only',
});
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
async function stopApi() {
  if (!api || api.exitCode !== null || api.signalCode !== null) return;
  const stopped = new Promise((done) => api.once('exit', done));
  api.kill('SIGTERM');
  await stopped;
  api = undefined;
}
async function startApi(directory, port) {
  apiLog = '';
  api = spawn(process.execPath, ['dist/main.js'], {
    cwd: directory,
    env: environment(port),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  api.stdout.on('data', (data) => {
    apiLog = `${apiLog}${data}`.slice(-12000);
  });
  api.stderr.on('data', (data) => {
    apiLog = `${apiLog}${data}`.slice(-12000);
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (api.exitCode !== null || api.signalCode !== null)
      throw new Error(`API failed to start: ${apiLog}`);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/doc-json`);
      if (response.status === 200) return;
    } catch {}
    await delay(100);
  }
  throw new Error(`API startup timed out: ${apiLog}`);
}
async function main() {
  mkdirSync(reportDirectory, { recursive: true });
  run('docker', [
    'create',
    '--name',
    container,
    '--publish',
    '127.0.0.1:55432:5432',
    '--env',
    'POSTGRES_USER=postgres',
    '--env',
    'POSTGRES_PASSWORD=demo-only',
    '--env',
    'POSTGRES_DB=plate_vision_clean_code_demo',
    image,
  ]);
  containerCreated = true;
  run('docker', ['start', container]);
  let databaseReady = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      run('docker', [
        'exec',
        container,
        'pg_isready',
        '-U',
        'postgres',
        '-d',
        'plate_vision_clean_code_demo',
      ]);
      databaseReady = true;
      break;
    } catch {}
    await delay(100);
  }
  assert(databaseReady, 'Disposable database failed to start.');
  const archive = execFileSync('git', ['archive', 'original'], { cwd: root });
  execFileSync('tar', ['-x', '-C', original], { input: archive });
  symlinkSync(
    join(root, 'node_modules'),
    join(original, 'node_modules'),
    'dir',
  );
  console.log(
    'Building original and applying its existing migrations and seeds in the disposable database.',
  );
  run('npm', ['run', 'migration:run'], original, environment(55001));
  run('npm', ['run', 'seed:run'], original, environment(55001));
  const results = {};
  for (const [version, directory, port] of [
    ['original', original, 55001],
    ['refactored', root, 55002],
  ]) {
    if (version === 'refactored') run('npm', ['run', 'build']);
    await startApi(directory, port);
    const output = join(reportDirectory, `demo-${version}.json`);
    console.log(`Checking ${version} HTTP and database behavior.`);
    run(
      process.execPath,
      [join(root, 'scripts', 'demo-flow.cjs'), version],
      root,
      {
        ...process.env,
        DEMO_API_URL: `http://127.0.0.1:${port}`,
        DEMO_REPORT_PATH: output,
      },
    );
    results[version] = JSON.parse(readFileSync(output, 'utf8'));
    await stopApi();
  }
  assert.deepEqual(results.original.checks, results.refactored.checks);
  const report = {
    originalCommit: run('git', ['rev-parse', 'original']).trim(),
    refactoredCommit: run('git', ['rev-parse', 'HEAD']).trim(),
    postgresImage: image,
    method:
      'Exact original source and refactored source share locked dependencies and a disposable local PostgreSQL database. APIs run sequentially; scenarios use distinct synthetic plates. No OCR engine is started.',
    checksMatch: true,
    ...results,
  };
  writeFileSync(
    join(reportDirectory, 'demo-comparison.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(
    'Original and refactored HTTP/Postgres checks match. Reports saved under reports/.',
  );
}
main()
  .catch((error) => {
    console.error(error.message, error.stderr?.toString() || '', apiLog);
    process.exitCode = 1;
  })
  .finally(async () => {
    await stopApi();
    if (containerCreated) {
      try {
        try {
          run('docker', ['stop', container]);
        } finally {
          run('docker', ['rm', '--volumes', container]);
        }
      } catch (error) {
        console.error(
          `Failed to remove task container ${container}: ${error.message}`,
        );
        process.exitCode = 1;
      }
    }
    rmSync(original, { recursive: true });
  });
