-- attendance_schema.sql
CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- students table (extra fields)
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  roll_no VARCHAR(50),
  department VARCHAR(100),
  year INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- teachers table (extra fields)
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50),
  title VARCHAR(150),
  teacher_id INT,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- classes table (a scheduled lecture instance)
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  class_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(150),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- qr_sessions: teacher generates a QR session to mark attendance
CREATE TABLE IF NOT EXISTS qr_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  class_id INT,
  created_by INT, -- user id (teacher)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT,
  student_id INT, -- references students.id
  status ENUM('present','absent') DEFAULT 'present',
  marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  marked_by INT, -- user id who marked (teacher id)
  UNIQUE KEY unique_attendance (class_id, student_id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL
);

