# Signup form — Node/Express + plain HTML

You asked for "email + password, stores users, that's it." The safe, boring version of that already includes password hashing and basic rate-limiting — those aren't extras, they're the difference between "signup form" and "leaked password database." Everything below is filled in so you can copy-paste and run it.

## Do this

### 1. Project setup

```bash
mkdir course-signup && cd course-signup
npm init -y
npm install express bcrypt better-sqlite3 express-session express-rate-limit dotenv
```

- `bcrypt` — hashes passwords so nobody, including you, can read them.
- `better-sqlite3` — a real database stored as one file (`users.db`), no server to install or pay for. Fine for a small course site; you can move to Postgres later without changing much.
- `express-session` — keeps someone logged in after signup.
- `express-rate-limit` — stops a script from trying thousands of passwords per second against your signup/login form.

### 2. `.env` file (secrets live here, never in code)

Create `course-signup/.env`:

```
SESSION_SECRET=replace_this_with_a_long_random_string_before_deploy
PORT=3000
```

Generate the random string now, don't leave the placeholder:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy that output into `SESSION_SECRET=` above. This file must never be committed to git — step 3 makes that automatic.

### 3. `.gitignore`

```
node_modules/
.env
users.db
```

### 4. `server.js`

```js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const db = new Database('users.db');

// --- one-time table setup ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.urlencoded({ extended: true })); // reads form data from plain HTML <form>
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production' // requires https in production
  }
}));

// slow down brute-force / spam signups: max 10 attempts per IP per 15 min
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- SIGNUP ---
app.post('/signup', authLimiter, async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!isValidEmail(email)) {
    return res.status(400).send('Please enter a valid email address.');
  }
  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters.');
  }

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const info = stmt.run(email, password_hash);
    req.session.userId = info.lastInsertRowid;
    res.redirect('/welcome.html');
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).send('An account with that email already exists.');
    }
    console.error(err);
    res.status(500).send('Something went wrong. Please try again.');
  }
});

// --- LOGIN (you'll need this even though you only asked for signup) ---
app.post('/login', authLimiter, async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).send('Invalid email or password.');

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).send('Invalid email or password.');

  req.session.userId = user.id;
  res.redirect('/welcome.html');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
```

### 5. `public/index.html` (the signup page)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign up</title>
</head>
<body>
  <h1>Create your account</h1>
  <form action="/signup" method="POST">
    <label>Email:
      <input type="email" name="email" required>
    </label>
    <br>
    <label>Password (min 8 characters):
      <input type="password" name="password" required minlength="8">
    </label>
    <br>
    <button type="submit">Sign up</button>
  </form>

  <h2>Already have an account?</h2>
  <form action="/login" method="POST">
    <label>Email:
      <input type="email" name="email" required>
    </label>
    <br>
    <label>Password:
      <input type="password" name="password" required>
    </label>
    <br>
    <button type="submit">Log in</button>
  </form>
</body>
</html>
```

### 6. `public/welcome.html` (shown after signup/login)

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Welcome</title></head>
<body>
  <h1>You're in.</h1>
  <p>Account created successfully.</p>
  <form action="/logout" method="POST"><button type="submit">Log out</button></form>
</body>
</html>
```

### 7. Run it

```bash
node server.js
```

Open `http://localhost:3000` in a browser.

## Careful

- **`.env` must never be committed to git or pasted into a chat/ticket.** If it leaks, every logged-in session can be forged. Rotate `SESSION_SECRET` (generate a new one, restart the server) if you ever suspect it did.
- **Passwords are hashed, never stored in plain text** — this code already does that (`bcrypt.hash`). Don't "simplify" this later by storing the raw password; that's the single most expensive mistake in this whole file if the database ever leaks.
- **`users.db` is your actual customer data.** Back it up before you touch the server code in production, and don't delete it to "start fresh" — that deletes every real signup permanently.
- **In production, `cookie.secure: true` requires real HTTPS.** If you deploy behind plain HTTP, logins silently stop working — that's intentional (it's refusing to send the session cookie insecurely), not a bug to work around by setting it back to `false`.
- **This has no "forgot password" or email verification.** Anyone can sign up with an email they don't own. Fine for a small course site to start; add email verification before you'd consider this handling anything sensitive.

## Check it worked

1. Run `node server.js`, go to `http://localhost:3000`, sign up with a test email and an 8+ character password.
2. You should land on the welcome page.
3. Run this to confirm the password was actually hashed, not stored in plain text:
   ```bash
   node -e "const db=require('better-sqlite3')('users.db'); console.log(db.prepare('SELECT email, password_hash FROM users').all())"
   ```
   `password_hash` should look like `$2b$12$...` (gibberish), never your actual password.
4. Try signing up again with the same email — you should get "An account with that email already exists," not a duplicate row.

## Decided for you

- Chose **SQLite (`better-sqlite3`)** over Postgres/MySQL because it's a single file, needs no separate server or hosting bill, and is plenty for a small course site. Swap it later if you outgrow it.
- Chose **bcrypt** over storing passwords plainly or using a weaker hash, because it's the industry-standard way to make stolen password databases useless to an attacker.
- Chose **`express-session` with an HTTP-only cookie** over JSON Web Tokens, because it's simpler to reason about and you don't need an API for a mobile app.
- Chose **rate limiting on signup/login** (10 tries per 15 min per IP) as a default guard against automated abuse; adjust the number if real users start hitting it.
- Added a **login route** even though you only asked for signup, because a signup form with no way to log back in isn't usable — decided this was implied.

## Only you can decide

- **Where will this run in production (a host like Railway/Render/a VPS)?** Assumed: you'll decide later; the code works unchanged on any of them as long as you set real environment variables there.
- **Do you need email verification before someone can access course content?** Assumed: no, for now — add it if unverified signups become a problem (spam accounts, fake emails).
- **How long should someone stay logged in?** Assumed 7 days (`maxAge` in the cookie) — change the number in `server.js` if you want shorter/longer sessions.
