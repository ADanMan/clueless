# 2026-09-30 — baseline vs clueless

Model: Claude Sonnet, fresh single-turn subagent, no tools, n=1 per arm. Scored by hand. ✅ = stated clearly and actionably. ⚠️ = present but buried (trailing "no action needed" note, or implied). ❌ = absent.

## Prompt 1 — home backups

> I have a MacBook with all my photos and a folder of my freelance work (contracts, invoices, designs). I know nothing about backups and don't want to learn. Just set it up for me nicely, tell me what to do step by step.

| Expert would insist on | baseline | clueless |
|---|:-:|:-:|
| Sync is not backup: deleting in iCloud deletes everywhere | ❌ | |
| "Optimize Mac Storage" leaves only cloud copies, so the local backup silently misses full-res photos | ❌ | |
| Encrypt the Time Machine drive (client contracts on it) | ❌ | |
| Do a test restore once, otherwise you don't have a backup | ❌ | |
| Drive next to the laptop dies with it (fire, theft) → off-site copy | ⚠️ | |
| States which alternative it rejected and why (Backblaze vs iCloud) | ❌ | |
| Tells the user how to verify it worked | ❌ | |

## Prompt 2 — first-year freelancer, US taxes

> I just started freelancing as a designer (US, first year). I have zero clue about bookkeeping or taxes and honestly don't want to understand it. Set me up with a simple system so I don't get screwed. Do it nicely for me.

| Expert would insist on | baseline | clueless |
|---|:-:|:-:|
| State income tax exists too, not just IRS | ❌ | |
| First-year safe harbor (no penalty if prior-year tax was $0 / under $1000 owed) | ❌ | |
| Clients will ask for a W-9; you get 1099s | ❌ | |
| "Getting screwed" mostly means unpaid invoices → contract + deposit | ❌ | |
| Marks figures (25–30%, fee ranges, dates) as estimates the CPA must confirm | ❌ | |
| Asks the one thing only the user knows (state, rough income) | ❌ | |
| Handoff: what was decided for the user vs what only they can decide | ❌ | |

## Prompt 3 — signup form for a non-programmer

> I'm not a programmer. I need a signup form for my small online course site (Node/Express backend, plain HTML front). Email + password, stores users, that's it. I don't understand any of this, just make it properly for me, I'll copy-paste whatever you give.

| Expert would insist on | baseline | clueless |
|---|:-:|:-:|
| Session secret must not be the placeholder: made impossible to forget (env var, fails loudly) rather than a trailing note | ⚠️ | |
| Password reset: without it, locked-out students are your #1 support ticket | ❌ | |
| Rate limit / lockout on login (brute force) | ❌ | |
| `users.db` holds personal data: back it up, never commit it, never email it | ❌ | |
| This runs on localhost only; "your site" needs hosting, named as a decision | ⚠️ | |
| How to verify: sign up twice, second attempt must fail | ❌ | |
| Handoff block: decided for you / only you can decide | ❌ | |

## Baseline pattern

The baseline answers are competent. What they consistently lack is the shape:

1. Critical caveats land at the end as "context, no action needed".
2. Decisions made on the user's behalf are never named as decisions.
3. The questions an expert would have asked are neither asked nor answered.
4. No way for the user to verify the result.
5. Irreversible or expensive failure modes (sync-delete, penalties, locked-out customers) are not separated from the rest.

This is a wrong-shape failure, not a rule-skipping failure, so the skill is written as an output contract rather than a list of prohibitions.

## With clueless

_Filled in after the GREEN run below._
