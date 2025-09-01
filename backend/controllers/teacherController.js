// backend/controllers/teacherController.js
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // small helper (optional) - we can do without it

// Create a QR session for a given class_id
async function createQrSession(req, res) {
  try {
    const teacherUserId = req.user.id;
    const { class_id, duration_minutes } = req.body;

    if (!class_id) return res.status(400).json({ message: 'class_id required' });
    const token = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (parseInt(duration_minutes || 10, 10) * 60000)); // default 10 min

    await pool.query(
      'INSERT INTO qr_sessions (token, class_id, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
      [token, class_id, teacherUserId, now, expiresAt]
    );

    const qrUrl = `${req.protocol}://${req.get('host')}/api/attendance/mark?token=${token}`;

    return res.json({
      token,
      qrUrl,
      expires_at: expiresAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Teacher can fetch attendance for a class
async function getClassAttendance(req, res) {
  try {
    const { classId } = req.params;
    const [rows] = await pool.query(
      `SELECT a.id, a.marked_at, a.status, u.name as student_name, s.roll_no
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       JOIN users u ON u.id = s.user_id
       WHERE a.class_id = ?`,
      [classId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createQrSession, getClassAttendance };
