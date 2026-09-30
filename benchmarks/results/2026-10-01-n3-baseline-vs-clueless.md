# 2026-10-01 — baseline vs clueless, n=3

Model: Claude Sonnet, fresh single-turn subagent, no tools. Three runs per prompt per arm. Graded by a separate Sonnet instance with [../judge-prompt.md](../judge-prompt.md) against [../checklists.json](../checklists.json). Verbatim answers in [../runs/](../runs/), grades in [../scores.json](../scores.json).

## Totals (21 checklist items × 3 runs = 63 per arm)

| | baseline | clueless |
|---|:-:|:-:|
| PASS, stated clearly | 12 / 63 | **47 / 63** |
| BURIED, present but as an aside | 13 / 63 | 4 / 63 |
| FAIL, absent | 38 / 63 | 12 / 63 |

## Per prompt, PASS per run

| Prompt | baseline | clueless |
|---|:-:|:-:|
| home backups | 3, 3, 2 of 7 | 7, 6, 6 of 7 |
| first-year freelancer taxes | 2, 1, 1 of 7 | 4, 4, 4 of 7 |
| signup form, non-programmer | 0, 0, 0 of 7 | 5, 5, 6 of 7 |

## What clueless still misses

PASS rate across the three clueless runs, worst first:

- 0/3 signup: password reset / account recovery treated as a real launch blocker
- 0/3 taxes: W-9 requests and 1099 forms
- 0/3 taxes: first-year safe-harbor / underpayment-penalty rule
- 1/3 signup: users database file is personal data, back up, never commit
- 1/3 taxes: unpaid invoices / contract + deposit as the real way freelancers lose money
- 2/3 backups: off-site copy as a concrete step
- 2/3 backups: test restore
- 2/3 taxes: figures marked as estimates to confirm

Everything else was 3/3.

The pattern: the contract reliably fixes *shape* (irreversible first, verification step, decisions named, handoff block: all 3/3). It does not add domain knowledge the model wasn't going to surface anyway. The tax and signup misses are things a specialist knows and a generalist model doesn't reach for; a domain checklist in the skill would close them, at the cost of making the skill domain-specific.

## Baseline pattern

Baseline answers scored 0–3 of 7. Their failures were mostly BURIED rather than absent on the signup prompt (secret placeholder, hosting, users.db all mentioned in a trailing "worth knowing" section), and mostly FAIL on backups (sync-is-not-backup, Optimize Mac Storage, test restore never mentioned in 3 of 3 runs).

## Contamination

Four of the original nine baseline runs came back with the clueless contract in them: the plugin installed on the machine auto-triggered on the prompt wording. They were discarded (kept in [../runs-contaminated/](../runs-contaminated/)) and re-run with the plugin disabled and an explicit no-skill instruction. Two of those re-runs triggered it again through the session's cached skill list and were discarded a second time. The final baseline set contains no contract headers (checked by grep for "decided for you", "only you can decide", "check it worked").
