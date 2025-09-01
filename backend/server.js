// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
}));

app.use(express.json());

// routes prefix
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);

// health
app.get('/', (req, res) => res.send('Attendance backend up'));

// global error fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
