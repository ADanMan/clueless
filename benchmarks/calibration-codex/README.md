# Codex calibration smoke test, 2026-10-01

Generator: Codex CLI 0.159.3, gpt-6.1-sol, reported reasoning effort none.
Six fixed scenarios, one response per arm, 12 independent ephemeral calls.
Old guidance: skill at commit d713e38. New guidance: v1.2.0 skill, pattern catalog and static hook reminder.
The model was explicitly asked to choose a mode and give a brief handoff. Expected modes were fixed in run.py before calls. Exact mode matches are scored deterministically; no model judge.

| Arm | Case | Expected | Actual |
|---|---|---|---|
| old | novice | full | full |
| old | expert | normal | normal |
| old | mixed | scoped | scoped |
| old | delegation | normal | normal |
| old | ambiguous | normal | full |
| old | quote | normal | normal |
| new | novice | full | full |
| new | expert | normal | normal |
| new | mixed | scoped | scoped |
| new | delegation | normal | normal |
| new | ambiguous | normal | normal |
| new | quote | normal | normal |

Old: 5/6. New: 6/6.

Read every answer: the old ambiguous case activated full because "make it nice" was a trigger. The new variant kept normal. Both variants handled the explicit novice, expert, mixed-domain, delegation and quoted-signal cases correctly.

Limitations: n=1, a prompted classification exercise rather than natural dialogue, same model throughout. New arm bundles skill and reminder, so it does not isolate the hook effect. No claim about downstream correctness, long sessions or actual Claude hook loading. CLI runtime logs are excluded; response JSONs are preserved. Existing Sonnet benchmark is unchanged.

Reproduce: python3 benchmarks/calibration-codex/run.py (requires authenticated Codex CLI and network access). The old commit and model availability may affect reproducibility; the script currently uses the CLI default model.
