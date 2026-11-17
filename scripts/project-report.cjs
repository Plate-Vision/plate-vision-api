const { execFileSync, spawnSync } = require('node:child_process');
const {
  mkdtempSync,
  rmSync,
  symlinkSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} = require('node:fs');
const { join, resolve } = require('node:path');
const { tmpdir } = require('node:os');

const root = resolve(__dirname, '..');
const baseline = process.argv.includes('--baseline');
const scope = [
  'src/modules/plate-reading/domain/services',
  'src/modules/parking-record/domain/services/parking-record.service.ts',
  'src/modules/vehicle/domain/services/vehicle.service.ts',
  ...[
    'create-parking-record-manual',
    'update-parking-record-manual',
    'update-parking-record-ia',
    'upsert-parking-record-ia',
  ].map(
    (name) =>
      `src/modules/parking-record/domain/services/providers/${name}.provider.ts`,
  ),
  'src/modules/vehicle/domain/services/providers/create-vehicle-ia.provider.ts',
];
const run = (command, args, cwd = root) =>
  execFileSync(command, args, { cwd, encoding: 'utf8' }).trim();
const temporary = baseline
  ? mkdtempSync(join(tmpdir(), 'plate-vision-baseline-'))
  : undefined;
const source = temporary || root;
const tool = (name) => join(root, 'node_modules', '.bin', name);
const count = (paths) => {
  const data = JSON.parse(
    run(tool('cloc'), [...paths, '--json', '--quiet'], source),
  );
  return {
    version: data.header.cloc_version,
    TypeScript: data.TypeScript,
    SUM: data.SUM,
  };
};

try {
  if (baseline) {
    const archive = execFileSync(
      'git',
      [
        'archive',
        'original',
        'src',
        '.eslintrc.js',
        '.prettierrc',
        'tsconfig.json',
      ],
      { cwd: root },
    );
    execFileSync('tar', ['-x', '-C', source], { input: archive });
    symlinkSync(
      join(root, 'node_modules'),
      join(source, 'node_modules'),
      'dir',
    );
  }
  const lint = spawnSync(tool('eslint'), ['src/**/*.ts', '--format', 'json'], {
    cwd: source,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (lint.error || ![0, 1].includes(lint.status))
    throw new Error(lint.error?.message || lint.stderr);
  const lintFiles = JSON.parse(lint.stdout);
  const report = {
    reference: baseline ? 'original' : 'working-tree',
    originalCommit: run('git', ['rev-parse', 'original']),
    commands: {
      baseline: 'npm run report:baseline',
      final: 'npm run report',
      count: 'cloc src --json --quiet',
      lint: 'eslint src/**/*.ts --format json',
    },
    source: count(['src']),
    scope: {
      paths: baseline
        ? scope
        : [
            ...scope,
            'src/modules/parking-record/domain/services/helpers/validate-parking-period.ts',
          ],
      ...count(
        baseline
          ? scope
          : [
              ...scope,
              'src/modules/parking-record/domain/services/helpers/validate-parking-period.ts',
            ],
      ),
    },
    lint: {
      files: lintFiles.length,
      errors: lintFiles.reduce((sum, file) => sum + file.errorCount, 0),
      warnings: lintFiles.reduce((sum, file) => sum + file.warningCount, 0),
      rules: lintFiles
        .flatMap((file) => file.messages)
        .reduce((rules, message) => {
          rules[message.ruleId] = (rules[message.ruleId] || 0) + 1;
          return rules;
        }, {}),
    },
    coverage: baseline
      ? {
          status: 'unavailable',
          reason: 'Original has no test suite or coverage command.',
        }
      : JSON.parse(
          readFileSync(join(root, 'coverage', 'coverage-summary.json'), 'utf8'),
        ).total,
    versions: Object.fromEntries(
      [
        'eslint',
        'prettier',
        'typescript',
        'jest',
        'ts-jest',
        'husky',
        'lint-staged',
        '@commitlint/cli',
        'cloc',
      ].map((name) => [
        name,
        require(join(root, 'node_modules', name, 'package.json')).version,
      ]),
    ),
  };
  mkdirSync(join(root, 'reports'), { recursive: true });
  const output = join(
    root,
    'reports',
    baseline ? 'baseline.json' : 'final.json',
  );
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        output: output.replace(`${root}/`, ''),
        sourceLines: report.source.SUM.code,
        scopeLines: report.scope.SUM.code,
        lint: report.lint,
        coverage: report.coverage,
      },
      null,
      2,
    ),
  );
} finally {
  if (temporary) rmSync(temporary, { recursive: true });
}
