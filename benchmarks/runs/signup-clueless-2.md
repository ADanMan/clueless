# Signup form for your course site (email + password)

## Careful — read this before you copy anything

- **Never store plain-text passwords.** The code below hashes passwords with bcrypt before saving. Don't "simplify" this later — a leaked database with plain passwords is the #1 way small sites get destroyed.
- **The `.env` file holds secrets** (database connection, session secret). Never commit it to GitHub, never paste it into chat with anyone else, never put it in a public repo. Add `.env` to `.gitignore` (included below).
- **The SESSION_SECRET / JWT_SECRET value must be random and unique.** A placeholder here would be exactly the kind of thing that ships by accident, so setup script below generates one for you automatically — you never have to invent or type one.
- **Duplicate emails must be rejected**, otherwise someone could create two accounts with the same email and one could hijack the other's course access. Handled below with a unique constraint.
- **Rate limit signup**, or a bot can flood your database with fake accounts. Basic rate limiting is included.

## Do this

I'm giving you a complete, runnable Node/Express backend with SQLite (a file-based database — no separate database server to install or pay for, perfect for a small course site) and plain HTML front end.

### 1. Project setup

Create a folder, e.g. `course-site`, and inside it create these files exactly as shown.

**`package.json`**
```json
{
  "name": "course-site",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "better-sqlite3": "^11.3.0",
    "bcrypt": "^5.1.1",
    "express-session": "^1.18.0",
    "express-rate-limit": "^7.4.0",
    "dotenv": "^16.4.5"
  }
}
```

**`.env`** (create this file yourself — do NOT copy a secret from anywhere, run the setup command in step 2 and it fills this in for you)
```
SESSION_SECRET=REPLACE_ME
PORT=3000
```

**`.gitignore`**
```
node_modules/
.env
*.sqlite
```

**`server.js`**
```javascript
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Fail loudly instead of silently running insecurely
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'REPLACE_ME') {
  console.error('ERROR: SESSION_SECRET is not set. Run: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))" and paste the result into .env as SESSION_SECRET=...');
  process.exit(1);
}

const db = new Database(path.join(__dirname, 'users.sqlite'));
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
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
    // secure:true requires HTTPS — turn this on once your site is live on https://
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Stop bots from spamming signups: max 10 attempts per IP per 15 minutes
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later.' }
});

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/signup', signupLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const hash = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const info = stmt.run(normalizedEmail, hash);

    req.session.userId = info.lastInsertRowid;
    res.json({ ok: true, message: 'Account created.' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.post('/api/login', signupLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!isValidEmail(email) || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  // Same error for "no such user" and "wrong password" — don't reveal which emails exist
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  res.json({ ok: true, message: 'Logged in.' });
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in.' });
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.session.userId);
  res.json({ user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
```

**`public/signup.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Sign up</title>
<style>
  body { font-family: -apple-system, Arial, sans-serif; max-width: 400px; margin: 60px auto; padding: 0 20px; }
  input { display: block; width: 100%; padding: 10px; margin: 8px 0 16px; box-sizing: border-box; }
  button { padding: 10px 20px; cursor: pointer; }
  #msg { margin-top: 12px; }
  .error { color: #c0392b; }
  .success { color: #27ae60; }
</style>
</head>
<body>
  <h1>Create your account</h1>
  <form id="signupForm">
    <label>Email
      <input type="email" id="email" required autocomplete="email">
    </label>
    <label>Password (min 8 characters)
      <input type="password" id="password" required minlength="8" autocomplete="new-password">
    </label>
    <button type="submit">Sign up</button>
  </form>
  <div id="msg"></div>

<script>
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  msg.className = '';

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      msg.textContent = data.error || 'Signup failed.';
      msg.className = 'error';
      return;
    }
    msg.textContent = 'Account created! You are now logged in.';
    msg.className = 'success';
    document.getElementById('signupForm').reset();
  } catch (err) {
    msg.textContent = 'Network error, please try again.';
    msg.className = 'error';
  }
});
</script>
</body>
</html>
```

### 2. Install and run

Open a terminal in the `course-site` folder and run these commands one at a time:

```
npm install
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the long random string that command prints, open `.env`, and replace `REPLACE_ME` with it, so the line reads e.g. `SESSION_SECRET=a1b2c3...`. This is a one-time step — the whole point is a secret value only your server knows, so it can't come pre-filled in the code I give you.

Then start the server:
```
npm start
```

Open `http://localhost:3000/signup.html` in your browser.

## Check it worked

1. With the server running, open `http://localhost:3000/signup.html`, sign up with a test email and an 8+ character password. You should see "Account created!".
2. Try signing up again with the exact same email — you should get "An account with this email already exists." That confirms duplicates are blocked and passwords are actually being checked against the database, not just faked in the browser.
3. (Optional sanity check) Open the `users.sqlite` file with any SQLite viewer (e.g. the free "DB Browser for SQLite" app) and confirm the `password_hash` column is a long scrambled string, never your actual password. If you ever see a readable password in there, stop and tell whoever helps you with code — something is badly wrong.

## Decided for you

- Chose **SQLite (via better-sqlite3)** over Postgres/MySQL because it's a single file, needs no separate database server, no hosting bill, and no setup — right-sized for a small course site. You can migrate later if you outgrow it.
- Chose **bcrypt password hashing** over storing passwords directly because that's the non-negotiable industry standard; a plain-text password table is a guaranteed breach headline waiting to happen.
- Chose **server-side sessions (cookies)** over JWTs in localStorage because sessions are simpler to reason about, safer against a common attack (XSS token theft), and log-out actually works (JWTs in localStorage can't be revoked).
- Chose **express-rate-limit on the signup/login routes** over leaving them open, because unprotected signup forms get hit by bots within days of going live.
- Chose to **reject accounts already in use** (unique email) and **give the same error for "wrong email" and "wrong password"** on login, so an attacker can't use your login form to discover which emails have accounts.

## Only you can decide

- **Do you need email verification** (confirm the address is real before granting access)? I assumed no, for simplicity — add it if people might sign up with typo'd or fake emails and you need to reach them (e.g. to deliver course access). I can add this on request.
- **Where will this be hosted** (Render, Railway, a VPS, etc.)? Assumed you'll deploy it later; when you do, you must set `NODE_ENV=production` and put the site behind HTTPS, or the "secure cookie" setting above will block logins.
- **Do you want a minimum password strength beyond length** (e.g. block "password123")? Assumed 8-character minimum is enough for a course site, not a bank — say the word if you want stricter rules.
