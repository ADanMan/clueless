# Do this

You need 5 files. Create a folder, put these in it exactly as shown, run two commands, done.

## 1. Folder setup

```
mkdir my-course-site
cd my-course-site
npm init -y
npm install express better-sqlite3 bcrypt express-session dotenv
```

## 2. `.env` — your secrets file (create this by hand, never share it, never commit it to git)

```
SESSION_SECRET=replace-this-with-a-long-random-string-before-you-launch
PORT=3000
```

Generate the random string yourself right now by running:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste the output in place of `replace-this-with-a-long-random-string-before-you-launch`. This is not optional — see **Careful** below.

## 3. `server.js`

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const path = require('path');

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.includes('replace-this')) {
  console.error('SESSION_SECRET is missing or still the placeholder. Set it in .env before starting the server.');
  process.exit(1);
}

const db = new Database('users.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production' // requires HTTPS in production
  }
}));

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Signup ---
app.post('/signup', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'That email address does not look valid.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      // Same message as "wrong password" on login would give — but for signup it's fine
      // to say this, since knowing an email is taken isn't very sensitive for a course site.
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, passwordHash);

    req.session.userId = db.prepare('SELECT id FROM users WHERE email = ?').get(email).id;
    res.json({ ok: true, message: 'Account created.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

// --- Login (you'll need this too, even though you only asked for signup) ---
app.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    // Deliberately vague error so attackers can't tell which emails exist.
    const genericError = 'Incorrect email or password.';

    if (!user) return res.status(401).json({ error: genericError });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: genericError });

    req.session.userId = user.id;
    res.json({ ok: true });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/me', (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
```

## 4. `public/signup.html`

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
    <label>Email <input type="email" name="email" required autocomplete="email"></label><br>
    <label>Password <input type="password" name="password" required minlength="8" autocomplete="new-password"></label><br>
    <button type="submit">Sign up</button>
  </form>
  <p id="message"></p>

  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const data = {
        email: form.email.value,
        password: form.password.value
      };
      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      document.getElementById('message').textContent = result.ok
        ? 'Account created! You are logged in.'
        : result.error;
    });
  </script>
</body>
</html>
```

## 5. Run it

```
node server.js
```

Open `http://localhost:3000/signup.html`. Sign up with a real-looking email and an 8+ character password.

---

# Careful

- **`.env` must never be committed to git or uploaded anywhere public.** It holds the key that protects every logged-in session on your site. If you use git, create a `.gitignore` file containing `.env` and `users.db` before your first commit. Leaking `SESSION_SECRET` means anyone can forge a login session for any user.
- **`users.db` is your entire user database in one file.** If you delete it, every account is gone, permanently, with no recovery. Back it up (copy the file somewhere else) before you do anything experimental like changing the schema.
- **Passwords are never stored in plain text here** — `bcrypt.hash` one-way-scrambles them. Do not "simplify" this later by storing raw passwords; that's the single most common way small sites get users' accounts stolen (people reuse passwords across sites).
- **This runs on plain HTTP on your own machine.** The moment you put this on the real internet, you need HTTPS (a free certificate from Let's Encrypt, or automatic if you deploy to Render/Railway/Fly.io) — otherwise passwords travel across the internet unencrypted and `secure: true` cookies won't even work. Don't launch publicly without this.
- **No email verification here.** Anyone can sign up with `notreal@fake.com` and it'll be accepted as long as it matches the email pattern. Fine for a course site MVP; add verification later if fake signups become a problem.
- **No rate limiting.** Someone could hammer `/signup` or `/login` thousands of times a second. Low risk for a small course site on day one, but if you ever get real traffic, add a package like `express-rate-limit` (5 minutes of work) before that becomes a real cost.

# Check it worked

1. Start the server (`node server.js`), sign up with a test email.
2. Stop the server (Ctrl+C), start it again, try to sign up with the *same* email again — you should get "An account with that email already exists." That confirms data actually persisted to disk, not just memory.
3. Open `users.db` with any SQLite viewer (or run `node -e "console.log(require('better-sqlite3')('users.db').prepare('SELECT email, created_at FROM users').all())"`) and confirm you see your test account with a scrambled `password_hash`, not your real password.

# Decided for you

- **SQLite (`better-sqlite3`) over Postgres/MySQL** — because it's a single file, needs no separate server to install or pay for, and a small course site's user table will never be big enough to need more. Swap later if you ever need multiple servers talking to one database.
- **bcrypt over storing passwords plain or with plain SHA-256** — bcrypt is designed to be slow on purpose, which is exactly what makes stolen password hashes hard to crack. This is non-negotiable, not a style choice.
- **Sessions (cookies) over JWT tokens** — simpler to reason about for a plain-HTML site with no mobile app, and easy to force-log-out a user (just delete their session) if you ever need to.
- **Generic login error message ("Incorrect email or password")** over saying specifically "wrong password" — so someone probing your site can't use error messages to build a list of registered emails.
- **No email-verification step included** — added complexity (sending real email needs a service like Resend or SendGrid, plus a domain) that a first version of a course site doesn't need. Add it when/if fake signups actually become a problem for you.

# Only you can decide

- **Where will this actually run** (your own VPS, Render, Railway, a shared host)? Assumed: doesn't matter for the code above, but it changes how you set `SESSION_SECRET` and HTTPS later. If you tell me, I'll give you the exact deploy steps.
- **Do students need to reset a forgotten password?** Assumed: not included yet — needs email sending, which needs a mail service and a bit more setup. Say yes and I'll add it.
- **Do you ever plan to charge for the course through this same account system** (paid tiers, Stripe)? Assumed: no, this is just free signup/login. If yes, that changes what you store per-user (e.g., subscription status) — worth deciding before you have real users signed up, since migrating existing accounts later is more work than building it in now.
