const { execFileSync } = require('node:child_process');
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const git = (args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const aliases = {
  '@modules/': 'src/modules/',
  '@core/': 'src/core/',
  '@shared/': 'src/shared/',
};
const analyse = (baseline) => {
  const files = (
    baseline
      ? git(['ls-tree', '-r', '--name-only', 'original', 'src'])
      : git(['ls-files', 'src'])
  )
    .split('\n')
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'));
  const fileSet = new Set(files);
  const graph = new Map(files.map((file) => [file, new Set()]));
  for (const file of files) {
    const content = baseline
      ? git(['show', `original:${file}`])
      : readFileSync(path.join(root, file), 'utf8');
    const source = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) &&
        !ts.isExportDeclaration(statement)
      )
        continue;
      const name = statement.moduleSpecifier?.text;
      if (!name) continue;
      const alias = Object.keys(aliases).find((prefix) =>
        name.startsWith(prefix),
      );
      const target = alias
        ? `${aliases[alias]}${name.slice(alias.length)}`
        : name.startsWith('.')
          ? path.posix.normalize(
              path.posix.join(path.posix.dirname(file), name),
            )
          : undefined;
      if (!target) continue;
      const resolved = [`${target}.ts`, `${target}/index.ts`].find(
        (candidate) => fileSet.has(candidate),
      );
      if (resolved) graph.get(file).add(resolved);
    }
  }
  const incoming = new Map(files.map((file) => [file, 0]));
  for (const targets of graph.values())
    for (const target of targets)
      incoming.set(target, incoming.get(target) + 1);
  const visited = new Set();
  const order = [];
  const visit = (file) => {
    if (visited.has(file)) return;
    visited.add(file);
    for (const target of graph.get(file)) visit(target);
    order.push(file);
  };
  for (const file of files) visit(file);
  const reverse = new Map(files.map((file) => [file, new Set()]));
  for (const [file, targets] of graph)
    for (const target of targets) reverse.get(target).add(file);
  visited.clear();
  const collect = (file, component) => {
    if (visited.has(file)) return;
    visited.add(file);
    component.push(file);
    for (const target of reverse.get(file)) collect(target, component);
  };
  const cycles = [];
  for (const file of order.reverse()) {
    if (visited.has(file)) continue;
    const component = [];
    collect(file, component);
    if (component.length > 1 || graph.get(file).has(file))
      cycles.push(component.sort());
  }
  return {
    files: files.length,
    localImportEdges: [...graph.values()].reduce(
      (sum, targets) => sum + targets.size,
      0,
    ),
    cycleComponents: cycles.sort((a, b) => a[0].localeCompare(b[0])),
    metrics: files
      .filter(
        (file) =>
          file.includes('/plate-reading/domain/services/') ||
          file.endsWith('/parking-record.service.ts') ||
          file.endsWith('/vehicle.service.ts') ||
          /\/(create-parking-record-manual|update-parking-record-manual|update-parking-record-ia|upsert-parking-record-ia|create-vehicle-ia)\.provider\.ts$/.test(
            file,
          ),
      )
      .map((file) => {
        const fanIn = incoming.get(file);
        const fanOut = graph.get(file).size;
        return {
          file,
          fanIn,
          fanOut,
          instability:
            fanIn + fanOut ? Number((fanOut / (fanIn + fanOut)).toFixed(3)) : 0,
          imports: [...graph.get(file)].sort(),
        };
      }),
  };
};

mkdirSync(path.join(root, 'reports'), { recursive: true });
const report = {
  method:
    'Static local TypeScript import graph, including type imports. Each edge is counted once per file pair. Instability = fanOut / (fanIn + fanOut). Cycles are strongly connected components; these are not proof of runtime DI cycles.',
  originalCommit: git(['rev-parse', 'original']),
  before: analyse(true),
  after: analyse(false),
};
writeFileSync(
  path.join(root, 'reports', 'architecture.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      before: {
        files: report.before.files,
        edges: report.before.localImportEdges,
        cycles: report.before.cycleComponents.length,
      },
      after: {
        files: report.after.files,
        edges: report.after.localImportEdges,
        cycles: report.after.cycleComponents.length,
      },
    },
    null,
    2,
  ),
);
