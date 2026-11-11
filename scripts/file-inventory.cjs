const { execFileSync } = require('node:child_process');
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const git = (args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const semanticPaths = JSON.parse(
  readFileSync(path.join(root, 'reports', 'final.json'), 'utf8'),
).scope.paths;
const classify = (file) => {
  if (
    semanticPaths.some(
      (scope) => file === scope || file.startsWith(`${scope}/`),
    )
  )
    return 'Flow refactoring or service wiring';
  if (file.startsWith('src/')) return 'Mechanical formatting or lint cleanup';
  if (file.startsWith('test/')) return 'Regression tests or test support';
  if (file.startsWith('docs/') || /^(README|CHANGELOG|task)\.md$/.test(file))
    return 'Refactoring and technical documentation';
  if (file.startsWith('reports/')) return 'Measured evidence';
  if (file.startsWith('scripts/')) return 'Reproducible reports';
  return 'Quality tooling, dependency lock or automation';
};
const entries = git(['diff', '--name-status', 'original'])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [status, file] = line.split('\t');
    return [file, { status, file, purpose: classify(file) }];
  });
for (const file of git(['ls-files', '--others', '--exclude-standard'])
  .split('\n')
  .filter(Boolean))
  entries.push([file, { status: 'A', file, purpose: classify(file) }]);
entries.push([
  'reports/file-inventory.tsv',
  {
    status: 'A',
    file: 'reports/file-inventory.tsv',
    purpose: 'Measured evidence',
  },
]);
const files = [...new Map(entries).values()].sort((a, b) =>
  a.file.localeCompare(b.file),
);
mkdirSync(path.join(root, 'reports'), { recursive: true });
writeFileSync(
  path.join(root, 'reports', 'file-inventory.tsv'),
  `status\tfile\tpurpose\n${files.map(({ status, file, purpose }) => `${status}\t${file}\t${purpose}`).join('\n')}\n`,
);
console.log(
  JSON.stringify(
    {
      created: files.filter(({ status }) => status === 'A').length,
      modified: files.filter(({ status }) => status === 'M').length,
      deleted: files.filter(({ status }) => status === 'D').length,
      total: files.length,
    },
    null,
    2,
  ),
);
