// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';   // ✅ FIXED import

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      role = jwtDecode(token).role;  // ✅ FIXED usage
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/">Attendance System</Link>
      </div>
      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            {role === 'teacher' && <Link to="/teacher">Teacher</Link>}
            {role === 'student' && <Link to="/student">Student</Link>}
            {role === 'admin' && <Link to="/admin">Admin</Link>}
            <button className="btn-link" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
