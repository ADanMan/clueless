# Benchmark

Three "I know nothing, do it for me" prompts ([prompts.json](prompts.json)), three runs per prompt per arm, same model (Claude Sonnet, fresh subagent, no tools), with and without the `clueless` skill loaded as system-level instructions. Every answer is saved verbatim in [runs/](runs/) and graded by a separate Sonnet instance against a fixed checklist ([checklists.json](checklists.json)) using the rules in [judge-prompt.md](judge-prompt.md): PASS only if stated clearly and actionably, BURIED if present but as a trailing note or aside, FAIL if absent. Grades are in [scores.json](scores.json); `python3 summarize.py` rebuilds the tables.

Latest result: [results/2026-10-01-n3-baseline-vs-clueless.md](results/2026-10-01-n3-baseline-vs-clueless.md). The earlier n=1 hand-scored pass is kept in [results/2026-09-30-baseline-vs-clueless.md](results/2026-09-30-baseline-vs-clueless.md).

## Caveats, honestly

- n=3. The runs agree with each other, which is the only reason the numbers are worth showing.
- One grader model, one generator model. A different grader would move individual cells.
- The checklists were written by the skill's author before the n=3 run, but after seeing the n=1 outputs.
- Contamination note: four baseline runs were discarded and re-run because the `clueless` plugin, installed on the machine, auto-triggered on the "I know nothing" phrasing and turned the baseline into the treatment. The discarded runs are kept in [runs-contaminated/](runs-contaminated/) for transparency. Re-runs were done with the plugin disabled and an explicit "do not invoke any skill" line in the harness prompt. That the skill triggers on its own from that phrasing is the intended behaviour, but it makes clean baselines annoying to collect.

## Reproduce

1. Put each prompt from `prompts.json` into a fresh session, with and without the skill. Save the answers as `runs/<prompt>-<arm>-<n>.md`.
2. Grade each answer with `judge-prompt.md` as the system prompt and the matching checklist as the user message. Save arrays into `scores.json` keyed by run name.
3. `python3 summarize.py`.
