Here's a signup system that stores email + password properly (hashed, never in plain text) for your course site. Copy-paste order matters — follow it top to bottom.

## Do this

**1. Install dependencies** (in your backend folder):

```bash
npm install express bcrypt better-sqlite3 express-session dotenv
```

**2. Create `.env`** in your project root (this file holds secrets — never commit it to git):

```
SESSION_SECRET=change-this-to-a-long-random-string-before-you-deploy
PORT=3000
```

Then create `.gitignore` (if you don't have one) and add a line: `.env` — otherwise your secret ends up public on GitHub.

**3. Generate a real secret** instead of leaving the placeholder above. Run this once and paste the output into `.env` in place of `change-this-to-a-long-random-string-before-you-deploy`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This is step one, not a TODO — the server below will refuse to start without it.

**4. `server.js`** — the whole backend:

```javascript
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Database = require('better-sqlite3');
const path = require('path');

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.includes('change-this')) {
  console.error('SESSION_SECRET is missing or still the placeholder. Set a real one in .env and restart.');
  process.exit(1);
}

const app = express();
const db = new Database('users.db');

// Table: created automatically on first run, safe to run every time.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // your plain HTML goes in /public
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'That email address doesn\'t look valid.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = db.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)'
    ).run(normalizedEmail, passwordHash);

    req.session.userId = result.lastInsertRowid;
    res.json({ ok: true, email: normalizedEmail });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!isValidEmail(email) || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  // Same error for "no such user" and "wrong password" — don't reveal which one it was.
  const genericError = { error: 'Invalid email or password.' };
  if (!user) return res.status(401).json(genericError);

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json(genericError);

  req.session.userId = user.id;
  res.json({ ok: true, email: user.email });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in.' });
  const user = db.prepare('SELECT email FROM users WHERE id = ?').get(req.session.userId);
  res.json({ email: user.email });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
```

**5. `public/signup.html`** — the plain HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign up</title>
</head>
<body>
  <h1>Create your account</h1>
  <form id="signupForm">
    <div>
      <label for="email">Email</label>
      <input type="email" id="email" required autocomplete="email">
    </div>
    <div>
      <label for="password">Password (8+ characters)</label>
      <input type="password" id="password" required minlength="8" autocomplete="new-password">
    </div>
    <button type="submit">Sign up</button>
  </form>
  <p id="message"></p>

  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageEl = document.getElementById('message');
      messageEl.textContent = 'Creating account...';

      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          messageEl.textContent = data.error;
          return;
        }
        messageEl.textContent = 'Account created! Redirecting...';
        window.location.href = '/'; // change to your course dashboard page
      } catch (err) {
        messageEl.textContent = 'Network error, try again.';
      }
    });
  </script>
</body>
</html>
```

Put `signup.html` inside a folder named `public` next to `server.js`. Run it with:

```bash
node server.js
```

Then open `http://localhost:3000/signup.html`.

## Careful

- **`users.db` is a real database file** that will sit on your server's disk. If you delete it, every account is gone, permanently, with no undo. Back it up before you ever touch it manually (copy the file).
- **Never store plain-text passwords.** This code already hashes with bcrypt before saving — don't "simplify" that later, it's the one thing that must never change.
- **`.env` must never be committed to git or emailed to anyone**, including a freelancer helping you later. If it ever leaks, generate a new `SESSION_SECRET` (step 3) — the old one lets anyone forge a login session.
- **When you put this on the internet (not localhost), you need HTTPS** (e.g., via your hosting provider or a free Let's Encrypt cert) and add `cookie: { secure: true, ... }` in the session config — otherwise passwords and session cookies travel in plain text over the network. Until then, this is fine for local testing only.
- **Multiple server instances / restarts share the same file** (`users.db`) — fine for a small course site on one server; if you ever move to multiple servers you'd need a real hosted database, not this point.

## Check it worked

1. Run `node server.js` — it should print `Running on http://localhost:3000` and NOT exit with the SESSION_SECRET error.
2. Open `http://localhost:3000/signup.html`, sign up with a test email and an 8+ character password.
3. Check it's really stored: run `sqlite3 users.db "SELECT email, password_hash FROM users;"` (install sqlite3 CLI if needed, or open the file with a tool like "DB Browser for SQLite"). You should see your email and a long scrambled hash — never a readable password. If you see the actual password text, something is broken; stop and don't deploy.
4. Try signing up again with the same email — you should get "An account with that email already exists," not a crash.

## Decided for you

- **SQLite (`better-sqlite3`) over a hosted database (Postgres/MySQL)** — because for a small course site, a single file that needs zero setup is simpler and free, and it scales to thousands of students fine. Switch later if you outgrow one server.
- **bcrypt over a simpler hash (or no hash)** — it's the standard for passwords; slow on purpose so stolen data is hard to crack.
- **Sessions (cookies) over JWT tokens** — sessions are easier to revoke (e.g., force-logout a user) and simpler for a plain HTML site with no mobile app.
- **Email+password only, no email verification step** — matches exactly what you asked for ("that's it"). Tradeoff: people can sign up with a typo'd or fake email and never be reachable. Add verification later if you ever need to email students (course updates, password resets) — right now there's no password-reset flow at all, because that requires sending email, which requires a paid email service.

## Only you can decide

- **Where this runs long-term** (assumed: you'll deploy it later to something like Render/Railway/a VPS — this code works unchanged there, just set real env vars on that host).
- **Whether you need password reset / "forgot password"** (assumed: not yet, since you said "that's it" — but with no reset flow, a locked-out student has no self-service way back in; you'd have to manually reset their password in the database for them).
- **How many students you expect** (assumed: small course, hundreds not millions — SQLite is the right call at that scale; tell me if you expect way more and I'll swap the database).
