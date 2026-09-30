# Signup form for your course site (Node/Express + plain HTML)

## Do this

**1. Install what you need**

```bash
npm init -y
npm install express better-sqlite3 bcrypt express-session dotenv
```

**2. Create a `.env` file** (secrets live here, never in code):

```
SESSION_SECRET=change-this-to-a-long-random-string-1234567890
PORT=3000
```

Generate a real random secret instead of typing your own — run this once and paste the output in:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Create `server.js`:**

```js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Database = require('better-sqlite3');
const path = require('path');

if (!process.env.SESSION_SECRET) {
  throw new Error('Missing SESSION_SECRET in .env — app refuses to start without it.');
}

const db = new Database('users.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // requires HTTPS in production
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// SIGNUP
app.post('/signup', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const info = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);

  req.session.userId = info.lastInsertRowid;
  res.json({ ok: true, message: 'Account created.' });
});

// LOGIN
app.post('/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  res.json({ ok: true, message: 'Logged in.' });
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// WHOAMI — lets a page check "am I logged in"
app.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ loggedIn: false });
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.session.userId);
  res.json({ loggedIn: true, email: user.email });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running at http://localhost:${port}`));
```

**4. Create `public/index.html`** (plain HTML front, no framework):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign up</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 60px auto; }
    input { display: block; width: 100%; padding: 8px; margin: 8px 0 16px; box-sizing: border-box; }
    button { padding: 10px 16px; cursor: pointer; }
    #msg { color: #c0392b; min-height: 20px; }
  </style>
</head>
<body>
  <h1>Create your account</h1>
  <form id="signupForm">
    <label>Email
      <input type="email" name="email" required autocomplete="email">
    </label>
    <label>Password (min 8 characters)
      <input type="password" name="password" required minlength="8" autocomplete="new-password">
    </label>
    <button type="submit">Sign up</button>
  </form>
  <p id="msg"></p>

  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const msg = document.getElementById('msg');
      msg.style.color = '#c0392b';
      msg.textContent = '';

      const body = {
        email: form.email.value,
        password: form.password.value
      };

      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        msg.textContent = data.error || 'Something went wrong.';
        return;
      }
      msg.style.color = 'green';
      msg.textContent = 'Account created! You are logged in.';
      form.reset();
    });
  </script>
</body>
</html>
```

**5. Run it:**

```bash
node server.js
```

Open `http://localhost:3000` in a browser.

**6. Before this is live on the internet (not localhost):** put it behind HTTPS (e.g. deploy on Render, Railway, Fly.io, or behind Caddy/Nginx with a free Let's Encrypt certificate). The `secure: true` cookie setting above requires it — without HTTPS, logins won't stay logged in correctly in production, which is the point: it forces you not to ship without HTTPS.

## Careful

- **`users.db` contains password hashes for every student.** It's a real file sitting on your server. Back it up like you would any customer data, and never commit it to a public GitHub repo (add `users.db` and `.env` to a `.gitignore` file — do this before your first `git add`, not after).
- **Passwords are never stored in plain text** — the code above uses bcrypt hashing, which is one-way. Don't "improve" this later by storing passwords in plain text for "easier debugging." That's the one mistake in this space that turns a bug into a breach.
- **`.env` holds your session secret.** If it leaks (e.g. committed to GitHub), anyone can forge login sessions. Treat it like a password.
- **This has no "forgot password" or email verification flow.** People will sign up with typo'd emails and get permanently locked out with no self-service recovery. Fine for a small course site to launch with, but know it's missing — it's the first thing people will ask for.
- **No rate limiting.** Someone could hammer `/login` to guess passwords. Not urgent for a small site, but if you grow, add a package like `express-rate-limit` on `/login` and `/signup`.

## Check it worked

1. Run `node server.js`, open `http://localhost:3000`, sign up with a test email/password.
2. You should see "Account created! You are logged in."
3. Run this to confirm the row actually landed in the database with a hashed (not plain-text) password:
   ```bash
   node -e "const db=require('better-sqlite3')('users.db'); console.log(db.prepare('SELECT * FROM users').all())"
   ```
   You should see your email and a `password_hash` starting with `$2b$` — not your actual password.
4. Try signing up with the same email again — you should get "An account with this email already exists," not a crash or a duplicate row.

## Decided for you

- **SQLite (`better-sqlite3`) over Postgres/MySQL** — because it's a single file, needs no separate database server to install or configure, and is plenty for a small course site. Switch to Postgres only once you have real concurrent traffic or need to host the DB separately from the app server.
- **bcrypt over storing passwords directly** — non-negotiable; this is the one thing in this whole file that must never be "simplified."
- **express-session (server-side sessions) over JWTs in localStorage** — simpler to reason about, and immune to the XSS-steals-your-token class of bugs that trips people up with JWTs. Fine for a single-server small site.
- **Server-side validation of email format and 8-char minimum password, duplicated in the HTML `required`/`minlength` attributes** — the HTML check is just for a nicer user experience; the server check is the one that actually protects your data, since anyone can bypass the browser.
- **JSON API (`fetch`) over a classic HTML form POST with page reload** — lets you show errors inline without reloading; slightly more JS but much better user experience for signup failures.

## Only you can decide

- **Where will this be hosted?** I assumed you'll deploy somewhere with HTTPS available by default (Render/Railway/Fly.io). If you're self-hosting on a VPS, you'll need to set up HTTPS yourself (Caddy does this almost automatically) before going live — do not run this on the open internet over plain HTTP.
- **Do you need email verification before someone can access paid course content?** I assumed no for v1 (anyone can sign up and immediately access content). If your course is paid, you likely need to connect signup to a payment/access-gating step — that's a separate piece of work, tell me if you want it.
- **What should happen after signup** — redirect to a dashboard, a "check your email" page, straight into course content? I assumed "just show a success message on the same page" since you only asked for signup itself. Tell me the destination page and I'll wire up the redirect.
