Here's a complete, working signup system: Express backend + plain HTML frontend, storing users with hashed passwords in a local SQLite database (no separate database server to install — it's just a file).

## Folder structure

```
my-course-site/
├── server.js
├── package.json
├── users.db          (created automatically)
└── public/
    └── signup.html
```

## 1. Install dependencies

In your project folder, run:

```bash
npm init -y
npm install express better-sqlite3 bcrypt
```

## 2. `server.js` — the backend

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Database setup ---
const db = new Database(path.join(__dirname, 'users.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- Middleware ---
app.use(express.json()); // lets us read JSON sent from the browser
app.use(express.static(path.join(__dirname, 'public'))); // serves signup.html

// --- Signup route ---
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
    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash the password — never store plain-text passwords
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

## 3. `public/signup.html` — the frontend

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 400px;
      margin: 80px auto;
      padding: 0 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-top: 15px;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    button {
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background-color: #1d4ed8;
    }
    button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    #message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      display: none;
    }
    .success {
      background-color: #dcfce7;
      color: #166534;
      display: block !important;
    }
    .error {
      background-color: #fee2e2;
      color: #991b1b;
      display: block !important;
    }
  </style>
</head>
<body>
  <h1>Create your account</h1>

  <form id="signupForm">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password</label>
    <input type="password" id="password" name="password" required minlength="8">

    <button type="submit" id="submitBtn">Sign Up</button>
  </form>

  <div id="message"></div>

  <script>
    const form = document.getElementById('signupForm');
    const messageBox = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';
      messageBox.className = '';
      messageBox.textContent = '';

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          messageBox.className = 'success';
          messageBox.textContent = data.message || 'Account created!';
          form.reset();
        } else {
          messageBox.className = 'error';
          messageBox.textContent = data.error || 'Something went wrong.';
        }
      } catch (err) {
        messageBox.className = 'error';
        messageBox.textContent = 'Could not reach the server. Please try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
      }
    });
  </script>
</body>
</html>
```

## 4. Run it

```bash
node server.js
```

Then open `http://localhost:3000/signup.html` in your browser. Fill out the form, and a `users.db` file will appear in your project folder containing the registered users (with hashed, not plain-text, passwords).

## What this does, in plain terms

- **Frontend (`signup.html`)**: a simple form. When submitted, it sends the email/password to your server instead of reloading the page, and shows a success or error message.
- **Backend (`server.js`)**: receives that data, checks it's a valid email and a password of at least 8 characters, checks the email isn't already registered, scrambles ("hashes") the password so it's never stored as readable text, and saves the record to a local database file.
- **Database**: SQLite via `better-sqlite3` — no separate database server to install or manage. It's just the `users.db` file sitting next to your code. Good enough for a small course site; if you ever outgrow it, the same logic ports easily to Postgres/MySQL.

## A few things worth knowing (even if you don't touch the code)

- **Passwords are hashed with bcrypt**, an industry-standard method — even you, looking at `users.db`, won't see anyone's actual password.
- **This has no login page yet** — this is just account creation. Let me know if you want a matching login route too.
- **This has no HTTPS** — fine for local testing, but before this goes on the real internet, it needs to run behind HTTPS (most hosting providers like Render, Railway, or a reverse proxy with Let's Encrypt handle this for you automatically).
- **`users.db` is sensitive** — don't commit it to a public GitHub repo. Add `users.db` to a `.gitignore` file.
