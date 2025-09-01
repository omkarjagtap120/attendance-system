// backend/controllers/attendanceController.js
const pool = require('../config/db');

async function markAttendance(req, res) {
  try {
    const studentUser = req.user; // must be student role in Protected route
    const { token } = req.body || req.query;

    if (!token) return res.status(400).json({ message: 'Missing token' });

    // find session by token and ensure not expired
    const [sessions] = await pool.query('SELECT * FROM qr_sessions WHERE token = ?', [token]);
    if (sessions.length === 0) return res.status(400).json({ message: 'Invalid token' });

    const session = sessions[0];
    const now = new Date();
    if (session.expires_at && new Date(session.expires_at) < now) {
      return res.status(400).json({ message: 'QR session expired' });
    }

    // get student id from students table
    const [students] = await pool.query('SELECT * FROM students WHERE user_id = ?', [studentUser.id]);
    if (students.length === 0) return res.status(400).json({ message: 'Student record not found' });
    const studentId = students[0].id;

    // check if attendance already marked
    const [existing] = await pool.query(
      'SELECT * FROM attendance WHERE class_id = ? AND student_id = ?',
      [session.class_id, studentId]
    );
    if (existing.length) return res.status(400).json({ message: 'Attendance already recorded' });

    // insert attendance
    await pool.query(
      'INSERT INTO attendance (class_id, student_id, status, marked_at, marked_by) VALUES (?, ?, ?, ?, ?)',
      [session.class_id, studentId, 'present', now, session.created_by]
    );

    return res.json({ message: 'Attendance recorded', class_id: session.class_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getStudentAttendance(req, res) {
  try {
    const studentUser = req.user;
    const [students] = await pool.query('SELECT id FROM students WHERE user_id = ?', [studentUser.id]);
    if (!students.length) return res.status(400).json({ message: 'Student not found' });
    const studentId = students[0].id;

    const [rows] = await pool.query(
      `SELECT a.*, c.class_date, co.title AS course_title
       FROM attendance a
       JOIN classes c ON c.id = a.class_id
       LEFT JOIN courses co ON co.id = c.course_id
       WHERE a.student_id = ? ORDER BY a.marked_at DESC`,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { markAttendance, getStudentAttendance };
