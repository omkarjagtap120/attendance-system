// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { createQrSession, getClassAttendance } = require('../controllers/teacherController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/create-session', authenticateToken, authorizeRoles(['teacher']), createQrSession);
router.get('/class/:classId/attendance', authenticateToken, authorizeRoles(['teacher']), getClassAttendance);

module.exports = router;
