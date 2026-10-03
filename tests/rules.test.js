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

test('catalog screenshots resolve to bundled PNG previews', () => {
  const { interface: ui } = JSON.parse(fs.readFileSync(path.join(root, '.codex-plugin/plugin.json'), 'utf8'));
  assert.ok(Array.isArray(ui.screenshots) && ui.screenshots.length > 0, 'catalog preview is missing');
  const bundleRoot = fs.realpathSync(root) + path.sep;
  const ignored = fs.readFileSync(path.join(root, '.codexignore'), 'utf8').split('\n').filter(Boolean);
  for (const screenshot of ui.screenshots) {
    assert.ok(screenshot.startsWith('./assets/'), 'preview must be a local asset');
    const file = fs.realpathSync(path.join(root, screenshot));
    assert.ok(file.startsWith(bundleRoot), 'preview must stay inside the plugin');
    const relative = path.relative(root, file);
    assert.ok(!ignored.some((entry) => entry.endsWith('/') && relative.startsWith(entry)), 'preview is excluded from the bundle');
    const png = fs.readFileSync(file);
    assert.deepStrictEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    assert.ok(png.readUInt32BE(16) >= 640 && png.readUInt32BE(20) >= 480, 'preview must be readable');
  }
});
