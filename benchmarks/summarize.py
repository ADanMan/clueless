#!/usr/bin/env python3
"""Turn scores.json into the markdown tables used in README and results."""
import json, collections
s = json.load(open('scores.json')); checks = json.load(open('checklists.json'))
by = collections.defaultdict(list)
for name, arr in s.items():
    p, arm, n = name.split('-'); by[(p, arm)].append(arr)
tot = collections.defaultdict(lambda: collections.Counter())
for (p, arm), arrs in by.items():
    for arr in arrs: tot[arm].update(arr)
N = {arm: sum(len(a) for (p, x), a in by.items() if x == arm) for arm in ('baseline', 'clueless')}
def cell(arm, k): return f"{tot[arm][k]} / {sum(tot[arm].values())}"
print("| | baseline | clueless |\n|---|:-:|:-:|")
for k, label in (('PASS', 'Stated clearly'), ('BURIED', 'Present but buried'), ('FAIL', 'Absent')):
    print(f"| {label} | {cell('baseline', k)} | {cell('clueless', k)} |")
print()
print("| Prompt | baseline PASS per run | clueless PASS per run |\n|---|:-:|:-:|")
for p in checks:
    b = [a.count('PASS') for a in by[(p, 'baseline')]]; c = [a.count('PASS') for a in by[(p, 'clueless')]]
    print(f"| {p} | {', '.join(map(str, b))} of {len(checks[p])} | {', '.join(map(str, c))} of {len(checks[p])} |")
print("\nPer-item PASS rate (clueless), lowest first:")
rows = []
for p, items in checks.items():
    arrs = by[(p, 'clueless')]
    for i, it in enumerate(items):
        rows.append((sum(a[i] == 'PASS' for a in arrs), len(arrs), p, it))
for k, n, p, it in sorted(rows): print(f"- {k}/{n} {p}: {it}")
