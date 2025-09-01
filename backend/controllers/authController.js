// backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

async function signup(req, res) {
  try {
    const { name, email, password, role, roll_no, department, year } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ message: 'Email already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role || 'student']
    );

    const userId = result.insertId;

    if ((role || 'student') === 'student') {
      await pool.query(
        'INSERT INTO students (user_id, roll_no, department, year) VALUES (?, ?, ?, ?)',
        [userId, roll_no || null, department || null, year || null]
      );
    } else if ((role || 'student') === 'teacher') {
      await pool.query('INSERT INTO teachers (user_id, department) VALUES (?, ?)', [userId, department || null]);
    }

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '7d' });

    return res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { signup, login };
