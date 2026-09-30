Totally doable. Here's a complete, working signup system: a plain HTML form + a Node/Express backend that stores users (hashed passwords, never plain text) in a local SQLite database file. You just copy-paste the files, run two commands, and it works.

## 1. Project setup

Create a folder, e.g. `signup-app`, and inside it create these files exactly as shown.

### `package.json`

```json
{
  "name": "signup-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "better-sqlite3": "^11.3.0",
    "bcryptjs": "^2.4.3"
  }
}
```

### `server.js`

```js
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

// --- Database setup ---
const db = new Database(path.join(__dirname, 'users.db'));
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serves your HTML

// --- Signup route ---
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash the password (never store plain text passwords)
    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
      .run(email.toLowerCase(), passwordHash);

    return res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### `public/index.html`

Create a folder called `public` inside `signup-app`, and put this file inside it.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign Up</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: white;
      padding: 32px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 320px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 20px;
      text-align: center;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      color: #333;
    }
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 14px;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 15px;
      cursor: pointer;
    }
    button:hover {
      background: #1d4ed8;
    }
    button:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }
    #message {
      margin-top: 14px;
      font-size: 14px;
      text-align: center;
    }
    .error { color: #dc2626; }
    .success { color: #16a34a; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Create your account</h1>
    <form id="signupForm">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email" />

      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autocomplete="new-password" minlength="8" />

      <button type="submit" id="submitBtn">Sign Up</button>
      <div id="message"></div>
    </form>
  </div>

  <script>
    const form = document.getElementById('signupForm');
    const messageEl = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      messageEl.textContent = '';
      messageEl.className = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
          messageEl.textContent = data.error || 'Something went wrong.';
          messageEl.className = 'error';
        } else {
          messageEl.textContent = 'Account created! You can now log in.';
          messageEl.className = 'success';
          form.reset();
        }
      } catch (err) {
        messageEl.textContent = 'Could not reach the server. Please try again.';
        messageEl.className = 'error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
      }
    });
  </script>
</body>
</html>
```

## 2. How to run it

1. Make sure Node.js is installed (download from nodejs.org if not — the LTS version).
2. Open a terminal in the `signup-app` folder.
3. Run:
   ```
   npm install
   npm start
   ```
4. Open your browser to `http://localhost:3000`.

That's it. Fill out the form, and a `users.db` file will appear in your project folder — that's your database, holding emails and securely hashed passwords (using bcrypt, industry standard, so even you can't see the real passwords, which is exactly how it should be).

## What this does for you, in plain terms

- **Stores users**: email + password, in a real database file (SQLite — no separate database server to install).
- **Never stores plain-text passwords**: they're hashed with bcrypt, a one-way scramble. Even if someone got the `users.db` file, they couldn't read the actual passwords.
- **Prevents duplicate signups**: same email can't register twice.
- **Basic validation**: checks for a valid-looking email and a password of at least 8 characters, both in the browser and (more importantly) on the server, since browser checks alone can be bypassed.
- **Friendly error messages**: shown on the page instead of the user seeing a technical crash.

## What's intentionally NOT included (next steps, only if/when you need them)

- **Login page** — this only handles signup. Let me know if you want a matching login form + "remember me" session.
- **Email verification** — right now anyone can sign up with any email, real or not.
- **Password reset** — there's no "forgot password" flow yet.
- **HTTPS / production deployment** — this runs fine locally; going live (e.g., on Render, Railway, or a VPS) needs a few extra steps like environment variables and HTTPS, which I can walk you through when you're ready.
- **Rate limiting** — nothing currently stops someone from spamming the signup endpoint with requests.

You don't need any of that to get started — this is a safe, working foundation. Just say the word when you want login added or you're ready to put it online, and I'll give you the next piece the same way: ready to paste.
