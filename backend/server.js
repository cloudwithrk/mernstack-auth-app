
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ msg: 'User created' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send({ msg: 'Invalid' });
    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(401).send({ msg: 'Invalid' });
    const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET);
    res.send({ token });
  });
});

app.get('/api/tasks', authenticate, (req, res) => {
  db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.post('/api/tasks', authenticate, (req, res) => {
  const { description } = req.body; 
  db.query('INSERT INTO tasks (description, user_id) VALUES (?, ?)', [description, req.user.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ msg: 'Task created' });
  });
});

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000, () => console.log('Server running on 5000'));
