// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // ✅ FIXED import

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = jwtDecode(token);
    if (roles.length && !roles.includes(payload.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/" replace />;
  }
}
