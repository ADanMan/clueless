# Signup form (Node/Express + plain HTML), email + password

## Do this

**1. Install what you need**

```bash
npm init -y
npm install express better-sqlite3 bcrypt express-session dotenv
```

**2. Create `.env`** (this file holds secrets — never commit it, never send it to anyone)

```
SESSION_SECRET=replace-this-with-a-long-random-string-32chars-min
PORT=3000
```

Generate the random string right now, don't leave it as-is:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste that output as `SESSION_SECRET`'s value.

**3. Create `.gitignore`**

```
node_modules/
.env
*.db
```

**4. Create `server.js`**

```js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Database = require('better-sqlite3');
const path = require('path');

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is missing from .env — generate one, see setup notes');
}

const app = express();
const db = new Database(path.join(__dirname, 'users.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

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
app.post('/api/signup', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'That email address does not look valid.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const info = stmt.run(email, password_hash);
    req.session.userId = info.lastInsertRowid;
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      // Same message as "wrong password" on login would give — see note below
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  // Always run bcrypt.compare even if user is missing, using a dummy hash,
  // so the response time doesn't leak whether the email exists.
  const hashToCheck = user ? user.password_hash : '$2b$12$abcdefghijklmnopqrstuv';
  const match = await bcrypt.compare(password, hashToCheck);

  if (!user || !match) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  req.session.userId = user.id;
  res.json({ ok: true });
});

// LOGOUT
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// WHO AM I (so the frontend knows if you're logged in)
app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.session.userId);
  res.json({ email: user.email });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
```

**5. Create `public/signup.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign Up</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Create your account</h1>
  <form id="signupForm">
    <label>Email<br>
      <input type="email" id="email" required autocomplete="email">
    </label><br><br>
    <label>Password (min 8 characters)<br>
      <input type="password" id="password" required minlength="8" autocomplete="new-password">
    </label><br><br>
    <button type="submit">Sign up</button>
  </form>
  <p id="message" style="color: red;"></p>

  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageEl = document.getElementById('message');
      messageEl.textContent = '';

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        window.location.href = '/'; // change to wherever "logged in" should land
      } else {
        messageEl.textContent = data.error;
      }
    });
  </script>
</body>
</html>
```

**6. Run it**

```bash
node server.js
```

Open `http://localhost:3000/signup.html`.

## Careful

- **`users.db` is a real database file sitting on your disk.** If you delete it, every account is gone, permanently, no undo. Back it up before you ever touch it manually (`cp users.db users.db.backup`).
- **Never commit `.env` or `users.db` to git / GitHub.** `.gitignore` above already excludes them — don't remove those lines. If either ever gets pushed publicly, treat all passwords as compromised: rotate `SESSION_SECRET` and force a password reset for everyone.
- **This has no "forgot password" flow yet.** If a student forgets their password today, there is no way to recover it — you'd have to manually delete their row in the database and have them sign up again (which loses nothing else since there's nothing else stored yet, but be aware this is a real support request you'll get, probably in week one).
- **HTTPS is required in production**, not optional. The cookie is set to `secure: true` in production mode, which means logins will silently fail if the site is served over plain HTTP. Most hosting providers (Render, Railway, Fly.io) give you HTTPS automatically — just don't serve this over bare HTTP on a real domain.
- **This stores only email + password hash.** The moment you add names, payment info, or course progress, you're handling more personal data — re-check what rules apply (e.g., GDPR if any student is in the EU) before you add those fields.

## Check it worked

1. Run `node server.js`, go to `http://localhost:3000/signup.html`, sign up with a test email.
2. Run this to confirm the password was hashed, not stored in plain text:
   ```bash
   sqlite3 users.db "SELECT email, password_hash FROM users;"
   ```
   `password_hash` should look like `$2b$12$...` — if you ever see the actual password there, something is badly wrong and this should not go live.
3. Try signing up with the same email again — you should get "An account with that email already exists," not a crash.

## Decided for you

- **SQLite (`better-sqlite3`) over Postgres/MySQL** — because it's a single file, needs no separate database server to install or pay for, and is plenty for a small course site. Swap later if you outgrow it (thousands of concurrent signups).
- **bcrypt over storing passwords as-is or with plain hashing (MD5/SHA)** — bcrypt is built to be slow on purpose, which is what makes stolen password data hard to crack. This is not negotiable for any real site.
- **express-session (server-side cookies) over JWTs in localStorage** — simpler to get right, and immune to a whole class of token-theft bugs that trip up non-experts. Fine for a small site.
- **Generic "Incorrect email or password"** on login, not "wrong password" vs "no such email" — so a stranger probing your site can't use error messages to find out who has an account.

## Only you can decide

1. **Where will this actually be hosted?** (assumed: a small Node-friendly host like Render/Railway/Fly.io, which give free HTTPS — if you're on shared/cheap hosting without Node support, the setup differs)
2. **Do you need email verification before someone can log in** (confirms the email is real, blocks throwaway signups)? (assumed: no, for now — add it before you have real paying students, since a mistyped email = permanently locked out with no recovery)
3. **Do students pay for the course through this same account?** (assumed: no — if yes, payment handling is a separate, much more sensitive task; don't bolt it onto this without flagging it separately)
