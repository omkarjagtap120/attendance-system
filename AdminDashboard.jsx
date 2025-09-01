// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import AttendanceChart from '../components/AttendanceChart';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    async function loadSummary() {
      // For demo: we will get counts by querying some endpoints.
      // If you want advanced metrics, create dedicated endpoints in backend.
      try {
        const students = await API.get('/admin/count-students'); // We'll describe server-side endpoint optional to add
        setSummary(students.data);
      } catch (err) {
        // fallback: do nothing
      }
    }
    loadSummary();
  }, []);

  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      <p>Admin analytics & monitoring. Create endpoints on backend for more metrics (example: attendance percentages).</p>

      <AttendanceChart />
    </div>
  );
}
