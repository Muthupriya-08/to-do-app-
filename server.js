const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todo-app.db');

const app = express();
app.use(express.json()); // To parse JSON request bodies

// Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send('Error hashing password');
    }

    // Save user to database
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword],
      (err) => {
        if (err) {
          return res.status(500).send('Error registering user');
        }
        res.status(201).send('User registered successfully');
      }
    );
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Get user from database
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Error comparing passwords');
      }
      if (!isMatch) {
        return res.status(400).send('Invalid password');
      }

      res.status(200).send('Login successful');
    });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the To-Do App backend!');
});
