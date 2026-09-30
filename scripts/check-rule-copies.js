#!/usr/bin/env node
// The compact ruleset lives in AGENTS.md. Every adapter copy must match it byte for byte.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const canonical = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8').trim();
const copies = { '.cursor/rules/clueless.mdc': /^---[\s\S]*?---\n/ };
let bad = 0;
for (const [file, strip] of Object.entries(copies)) {
  const body = fs.readFileSync(path.join(root, file), 'utf8').replace(strip, '').trim();
  if (body !== canonical) { console.error(`out of sync: ${file}`); bad++; }
}
if (bad) process.exit(1);
console.log('rule copies in sync');
