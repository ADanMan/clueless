# Benchmark

Method: three "I know nothing, do it for me" prompts, one shot each, same model (Claude Sonnet, via a fresh subagent), with and without the skill. Each answer is scored by hand against a checklist of things a domain expert would insist on. A cell is ✅ only if the answer states it clearly, not if it is implied or buried in a trailing "context" note.

The checklists and verbatim answers are in [results/](results/). Reproduce: paste each prompt from a results file into a fresh session, with and without `clueless` installed.
