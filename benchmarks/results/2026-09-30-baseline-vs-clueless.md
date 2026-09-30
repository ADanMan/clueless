# 2026-09-30 — baseline vs clueless

Model: Claude Sonnet, fresh single-turn subagent, no tools, n=1 per arm. Scored by hand. ✅ = stated clearly and actionably. ⚠️ = present but buried (trailing "no action needed" note, or implied). ❌ = absent.

## Prompt 1 — home backups

> I have a MacBook with all my photos and a folder of my freelance work (contracts, invoices, designs). I know nothing about backups and don't want to learn. Just set it up for me nicely, tell me what to do step by step.

| Expert would insist on | baseline | clueless |
|---|:-:|:-:|
| Sync is not backup: deleting in iCloud deletes everywhere | ❌ |  ✅ |
| "Optimize Mac Storage" leaves only cloud copies, so the local backup silently misses full-res photos | ❌ |  ✅ |
| Encrypt the Time Machine drive (client contracts on it) | ❌ |  ✅ |
| Do a test restore once, otherwise you don't have a backup | ❌ |  ✅ |
| Drive next to the laptop dies with it (fire, theft) → off-site copy | ⚠️ |  ✅ |
| States which alternative it rejected and why (Backblaze vs iCloud) | ❌ |  ✅ |
| Tells the user how to verify it worked | ❌ |  ✅ |

## Prompt 2 — first-year freelancer, US taxes

> I just started freelancing as a designer (US, first year). I have zero clue about bookkeeping or taxes and honestly don't want to understand it. Set me up with a simple system so I don't get screwed. Do it nicely for me.

| Expert would insist on | baseline | clueless |
|---|:-:|:-:|
| State income tax exists too, not just IRS | ❌ |  ✅ |
| First-year safe harbor (no penalty if prior-year tax was $0 / under $1000 owed) | ❌ |  ❌ |
| Clients will ask for a W-9; you get 1099s | ❌ |  ❌ |
| "Getting screwed" mostly means unpaid invoices → contract + deposit | ❌ |  ❌ |
| Marks figures (25–30%, fee ranges, dates) as estimates the CPA must confirm | ❌ |  ⚠️ |
| Asks the one thing only the user knows (state, rough income) | ❌ |  ✅ |
| Handoff: what was decided for the user vs what only they can decide | ❌ |  ✅ |

## Prompt 3 — signup form for a non-programmer

> I'm not a programmer. I need a signup form for my small online course site (Node/Express backend, plain HTML front). Email + password, stores users, that's it. I don't understand any of this, just make it properly for me, I'll copy-paste whatever you give.

| Expert would insist on | baseline | clueless |
|---|:-:|:-:|
| Session secret must not be the placeholder: made impossible to forget (env var, fails loudly) rather than a trailing note | ⚠️ |  ✅ |
| Password reset: without it, locked-out students are your #1 support ticket | ❌ |  ⚠️ |
| Rate limit / lockout on login (brute force) | ❌ |  ❌ |
| `users.db` holds personal data: back it up, never commit it, never email it | ❌ |  ✅ |
| This runs on localhost only; "your site" needs hosting, named as a decision | ⚠️ |  ✅ |
| How to verify: sign up twice, second attempt must fail | ❌ |  ✅ |
| Handoff block: decided for you / only you can decide | ❌ |  ✅ |

## Baseline pattern

The baseline answers are competent. What they consistently lack is the shape:

1. Critical caveats land at the end as "context, no action needed".
2. Decisions made on the user's behalf are never named as decisions.
3. The questions an expert would have asked are neither asked nor answered.
4. No way for the user to verify the result.
5. Irreversible or expensive failure modes (sync-delete, penalties, locked-out customers) are not separated from the rest.

This is a wrong-shape failure, not a rule-skipping failure, so the skill is written as an output contract rather than a list of prohibitions.

## With clueless

Same three prompts, skill text loaded as system-level instructions, same model, n=1.

| | baseline | clueless |
|---|:-:|:-:|
| ✅ stated clearly | 0 / 21 | 15 / 21 |
| ⚠️ buried or partial | 3 / 21 | 2 / 21 |
| ❌ absent | 18 / 21 | 4 / 21 |

Every answer with the skill had all five contract blocks, in order, with the irreversible items at the top and a concrete verification step.

What it still missed, verbatim from the checklists: the first-year safe-harbor rule, W-9/1099 paperwork, and "unpaid invoices are how freelancers actually get screwed" (prompt 2); a login rate limit (prompt 3). Password reset was flagged as a real problem but not built; the 30% set-aside was explained but not marked as an estimate to confirm.

Known drift: on prompt 1 the model opened with the "You asked for backups; what you actually want is…" challenge, which the skill reserves for `ultra`. The example block in the skill is the likely cause. Left as is for now; a fix goes through the same RED/GREEN loop.

n=1 per arm on one model. This is a smoke test of the shape, not a statistically meaningful benchmark. Rerun with your own prompts before believing any of it.

## Verbatim answers

<details><summary>Prompt 1, baseline</summary>

(Time Machine + iCloud, 200 GB plan, "plug the drive in once a week". No mention that iCloud is sync, no test restore, no encryption, no named alternative.)

</details>

<details><summary>Prompt 1, clueless</summary>

Do this: Time Machine on an encrypted external SSD; iCloud Photos + Drive with "Optimize Mac Storage" OFF; one off-site copy of the freelance folder. Careful: iCloud is sync not backup; Optimize Mac Storage leaves thumbnails; a drive next to the laptop dies with it. Check it worked: restore one file from the drive. Decided for you: Time Machine over Backblaze, encrypted over not, Google Drive for off-site. Only you can decide: second drive location, which cloud account, total data size.

</details>

<details><summary>Prompt 2, clueless</summary>

Do this: separate business account; Found/Bonsai; 30% set-aside on every payment; IRS Direct Pay quarterly; receipts forwarded; CPA or TurboTax SE in January. Careful: the set-aside is not optional; quarterly deadlines are the rule, not April; don't mix accounts. Check it worked: 30% lands in the tax account within 24 h of first payment. Decided for you: 30% over lower, software over spreadsheet, sole prop over LLC, Direct Pay over checks. Only you can decide: high-tax state (bump to 35%), other household income, CPA vs self-file.

</details>

<details><summary>Prompt 3, clueless</summary>

Do this: four files; server refuses to boot without SESSION_SECRET; bcrypt cost 12; login and /me included; one-line start command that generates the secret. Careful: secret must persist across restarts; users.db is real user data, back it up and never commit; no email verification or password reset yet; no HTTPS on localhost. Check it worked: sign up twice, second must fail; users.db appears. Decided for you: SQLite over Postgres, bcrypt, cookie sessions over JWT, min length 8, login included. Only you can decide: hosting, email verification, post-signup redirect.

</details>
