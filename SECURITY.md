# Security policy

clueless is prompt-only. It ships Markdown skills, a Cursor rule, an `AGENTS.md`, and two small Node scripts used only by the test suite. It runs no hooks, starts no processes, makes no network calls, and writes nothing outside its own folder.

## Reporting a vulnerability

If you find a way this plugin could harm a user (for example, skill text that steers an agent into an unsafe action), open a private report via GitHub Security Advisories on this repository, or email the author through the address on the GitHub profile https://github.com/ADanMan. Expect an acknowledgement within 7 days.

Please do not open public issues for security reports until a fix is published.

## Scope

In scope: anything in this repository. Out of scope: the behaviour of the host agent (Claude Code, Codex, Cursor) itself.

The calibration hook reads its event from stdin and emits static guidance. It makes no network calls, writes no files, does not echo prompts, and does not make permission decisions.
