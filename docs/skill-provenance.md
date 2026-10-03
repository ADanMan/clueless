# Bundled skill source snapshot

`.codex-plugin/skills-source.json` records the public repository, immutable
commit and SHA-256 of every bundled file under `skills/`. The Codex manifest's
`commit` refers to this **skill snapshot**, not to the whole plugin checkout.
The metadata and hash record are added after the source commit so that the
reference does not try to name its own future Git hash.

`npm test` checks complete file coverage and content hashes without requiring
Git history, so it also works in a shallow checkout or unpacked source archive. To
compare against the actual Git source, the pinning script reads every tracked
skill file from the named commit and refuses a content mismatch before writing
metadata.

When changing skills or their references:

1. Commit the skill changes first.
2. Run `node scripts/pin-skill-source.js "$(git rev-parse HEAD)"`.
3. Run `npm test`, then commit the updated manifest and snapshot record.

Keep both commits in published history; a squash that removes the referenced
commit would require refreshing the snapshot against a retained source commit.

This record establishes reproducible source provenance. It is not a security
certification or signed trust attestation. The package does not declare
`verified: true`. In plugin-scanner 2.0.1116, the local
`verification.review-status` adapter checks that boolean alone; passing tests,
an automated scan and code review should not be presented as independent
certification of every future use of a prompt.
