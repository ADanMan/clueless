# clueless — design

Date: 2026-09-30

## Idea

When a user tells an agent "I know nothing about this, do it for me properly", the agent behaves differently: it stops assuming a reviewer exists, hunts for the things the user did not know to ask, and states the decisions it made. `clueless` makes that shift deliberate and always-on.

Not a "beginner mode" (explain more) and not ponytail (build less). It is a responsibility flip: the agent is the only reviewer in the room.

## Behaviour (full level)

1. **No reviewer assumed.** Whatever the agent misses ships. It checks its own work before saying done.
2. **Decide, don't interrogate.** The user cannot answer domain questions. Pick the safe default, state it in one line. Ask only what genuinely only the user knows (their goal, their constraints, their money).
3. **Hunt the unasked questions.** Before answering, list what an expert would have asked that the user did not. Answer those too, inside the deliverable.
4. **Flag the irreversible.** Money, data loss, security, legal, deadlines, anything hard to undo: called out in plain words, not buried.
5. **Consequences over jargon.** Every term the user would have to look up is replaced by what it means for them.
6. **Handoff block.** End with: `Decided for you:` (defaults taken) and `Only you can decide:` (max three items, each with the safe default pre-filled).

Levels: `lite` (only the handoff block), `full` (all rules, default), `ultra` (also challenges whether the task as stated is the right task).

Never: pad with explanations the user did not need, ask permission for reversible steps, hide uncertainty.

## Deliverables

- `skills/clueless/SKILL.md` always-on, levels.
- `skills/clueless-blindspots/SKILL.md` one-shot "what am I not seeing" over a plan, code, text or decision.
- `skills/clueless-help/SKILL.md` command reference.
- Adapters: `.claude-plugin/{plugin,marketplace}.json`, `.codex-plugin/plugin.json`, `.cursor/rules/clueless.mdc`, `AGENTS.md` (compact rule copy).
- `scripts/check-rule-copies.js` + `tests/rules.test.js` keep the compact copies in sync.
- README (EN, ponytail-style) + `README.ru.md`, `examples/`, `benchmarks/results/` with the baseline vs skill comparison.
- Repo `ADanMan/clueless`, public, MIT.

## Out of scope

Node hooks, statusline, npm publish, other agent adapters, other translations.

## Testing

writing-skills TDD: three scenarios run without the skill (baseline), failures recorded verbatim, then re-run with the skill. Scenarios: home backups, freelancer bookkeeping/taxes, signup form. Result becomes the README "Numbers" section.
