// backend/routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { markAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/mark', authenticateToken, authorizeRoles(['student']), markAttendance);
router.get('/mark', authenticateToken, authorizeRoles(['student']), markAttendance); // allow GET via link
router.get('/student/history', authenticateToken, authorizeRoles(['student']), getStudentAttendance);

module.exports = router;
