const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

test('rule copies are in sync', () => {
  execFileSync('node', [path.join(root, 'scripts/check-rule-copies.js')]);
});

test('every skill has name and description frontmatter', () => {
  for (const dir of fs.readdirSync(path.join(root, 'skills'))) {
    const md = fs.readFileSync(path.join(root, 'skills', dir, 'SKILL.md'), 'utf8');
    assert.match(md, /^---\nname: clueless/, dir);
    assert.match(md, /\ndescription: /, dir);
  }
});

test('plugin manifests agree on version', () => {
  const v = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')).version;
  assert.strictEqual(v('.claude-plugin/plugin.json'), v('package.json'));
  assert.strictEqual(v('.codex-plugin/plugin.json'), v('package.json'));
});
