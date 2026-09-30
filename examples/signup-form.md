# "Make me a signup form, I'm not a programmer"

> I'm not a programmer. I need a signup form for my small online course site (Node/Express backend, plain HTML front). Email + password, stores users, that's it. I don't understand any of this, just make it properly for me, I'll copy-paste whatever you give.

## Without clueless

Working Express + SQLite + bcrypt code. Session secret is `'change-this-to-a-random-long-string'` with a comment. The last section is titled *"A few things worth knowing (no action needed, just context)"* and that is where "change the secret before putting this on the real internet" lives.

The user said they will copy-paste whatever they get.

## With clueless

```js
// FAILS LOUDLY on boot if you forgot to set a real secret
if (!process.env.SESSION_SECRET) {
  console.error('Missing SESSION_SECRET env var. Set it before starting the server.');
  process.exit(1);
}
```

```
Run it
  npm install
  SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") npm start

Careful
  - users.db is real user data. Back it up before deploying. Never commit it.
  - No password reset yet. For a course site that is your #1 support ticket.
  - No HTTPS here. Any normal host gives you HTTPS; don't serve signups over http://.

Check it worked
  Sign up twice with the same email. The second must say "already exists".

Decided for you
  - SQLite over Postgres: one file, zero setup, fine for a small course site.
  - Cookie sessions over JWT: simpler with a plain HTML front end.
  - Login included though you asked for signup only: a signup with no way
    back in isn't useful.

Only you can decide
  - Where this runs permanently (assumed Render/Railway).
  - Email verification before course access (assumed no, for now).
  - What happens right after signup (assumed: success message).
```
