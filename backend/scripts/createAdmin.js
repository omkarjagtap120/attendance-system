// backend/scripts/createAdmin.js
require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function createAdmin(email, password, name) {
  try {
    if (!email || !password || !name) {
      console.log('Usage: node createAdmin.js admin@example.com AdminPassword "Admin Name"');
      process.exit(1);
    }
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) {
      console.log('User already exists');
      process.exit(0);
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      name,
      email,
      hashed,
      'admin'
    ]);
    console.log('Admin created with id', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const [,, email, password, ...nameParts] = process.argv;
const name = nameParts.join(' ') || 'Admin';
createAdmin(email, password, name);
