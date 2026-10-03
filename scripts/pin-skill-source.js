#!/usr/bin/env node
// Pin only an existing commit whose tracked skill files match this checkout.
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const commit = process.argv[2];

try {
  if (!/^[0-9a-f]{40}$/.test(commit || '')) throw new Error('Pass the full 40-character source commit SHA.');
  const git = (...args) => execFileSync('git', args, { cwd: root });
  git('cat-file', '-e', `${commit}^{commit}`);
  const names = git('ls-tree', '-r', '-z', '--name-only', commit, '--', 'skills/').toString().split('\0').filter(Boolean).sort();
  if (!names.length) throw new Error('The source commit has no skill files.');
  const files = {};
  for (const name of names) {
    const original = git('show', `${commit}:${name}`);
    const current = fs.readFileSync(path.join(root, name));
    if (!original.equals(current)) throw new Error(`${name} differs from the source commit; commit the skill changes first.`);
    files[name] = createHash('sha256').update(original).digest('hex');
  }
  const manifestPath = path.join(root, '.codex-plugin/plugin.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const source = { scope: 'bundled-skills', repository: manifest.repository, commit, files };
  manifest.commit = commit;
  fs.writeFileSync(path.join(root, '.codex-plugin/skills-source.json'), JSON.stringify(source, null, 2) + '\n');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Pinned ${names.length} skill files to ${commit}. Run npm test to check complete coverage.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
