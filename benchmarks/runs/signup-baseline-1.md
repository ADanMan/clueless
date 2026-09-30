Here's a complete, working signup system: Express backend + plain HTML frontend, storing users (email + hashed password) in a local SQLite database. Passwords are hashed with bcrypt — never stored in plain text.

## 1. Project setup

Create a folder, e.g. `course-site`, and inside it run:

```bash
npm init -y
npm install express better-sqlite3 bcrypt express-session
```

## 2. File structure

```
course-site/
  server.js
  users.db        (created automatically, don't touch it)
  public/
    signup.html
```

## 3. `server.js`

```js
const express = require('express');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const session = require('express-session');
const path = require('path');

const app = express();
const db = new Database('users.db');

// Create the users table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'change-this-to-a-long-random-string', // see note below
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// --- Signup endpoint ---
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    stmt.run(email.toLowerCase().trim(), passwordHash);
    res.json({ success: true, message: 'Account created! You can now log in.' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// --- Login endpoint (bonus, since you'll need it) ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  res.json({ success: true, message: 'Logged in!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

## 4. `public/signup.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign Up</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 400px;
      margin: 80px auto;
      padding: 0 20px;
    }
    h1 { font-size: 1.5rem; }
    label { display: block; margin-top: 16px; font-weight: bold; }
    input {
      width: 100%;
      padding: 8px;
      margin-top: 4px;
      box-sizing: border-box;
      font-size: 1rem;
    }
    button {
      margin-top: 24px;
      padding: 10px 16px;
      width: 100%;
      font-size: 1rem;
      cursor: pointer;
    }
    #message {
      margin-top: 16px;
      font-weight: bold;
    }
    .error { color: #c0392b; }
    .success { color: #27ae60; }
  </style>
</head>
<body>
  <h1>Create your account</h1>
  <form id="signupForm">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password</label>
    <input type="password" id="password" name="password" minlength="8" required>

    <button type="submit">Sign Up</button>
  </form>
  <div id="message"></div>

  <script>
    const form = document.getElementById('signupForm');
    const messageEl = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      messageEl.textContent = '';
      messageEl.className = '';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
          messageEl.textContent = data.message;
          messageEl.className = 'success';
          form.reset();
        } else {
          messageEl.textContent = data.error;
          messageEl.className = 'error';
        }
      } catch (err) {
        messageEl.textContent = 'Could not reach the server. Please try again.';
        messageEl.className = 'error';
      }
    });
  </script>
</body>
</html>
```

## 5. Run it

```bash
node server.js
```

Then open `http://localhost:3000/signup.html` in your browser.

## What this does, in plain terms

- When someone fills out the form, the browser sends their email and password to your server.
- The server hashes the password (turns it into scrambled gibberish that can't be reversed) before saving it — so even you, looking at the database file, never see anyone's actual password.
- It stores the email and hashed password in a file called `users.db` in your project folder. That's your whole "database" — no separate database server to install or manage.
- It checks for obviously bad input (empty fields, malformed email, short password) and rejects duplicate emails.
- I also included a `/api/login` endpoint since a signup form is useless without a way to log back in — it checks the submitted password against the stored hash.

## Two things to actually do before this goes live

1. **Replace `'change-this-to-a-long-random-string'`** in `server.js` with a real random string (just mash your keyboard for 40+ characters, or run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and paste the output in). This secret is what keeps login sessions secure — don't leave the placeholder in.
2. **Back up `users.db` periodically** once you have real users — it's just a file sitting in your project folder, so treat it like any other important file (copy it somewhere safe regularly, and make sure it's not deleted when you redeploy).

That's it — copy these two files in, run `npm install` and `node server.js`, and you have a working signup system.
