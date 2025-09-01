// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { QRCodeCanvas } from "qrcode.react";

export default function TeacherDashboard() {
  const [classId, setClassId] = useState('');
  const [duration, setDuration] = useState(10);
  const [qrData, setQrData] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // For beginner: fetch teacher's classes list (optional). 
    async function load() {
      // Example if you don’t have backend yet:
      // setClasses([{id:1, label:'CS101 - 2025-09-01'}]);
    }
    load();
  }, []);

  async function createSession(e) {
    e.preventDefault();
    if (!classId) { 
      alert('Enter class id'); 
      return; 
    }
    try {
      const res = await API.post('/teacher/create-session', { 
        class_id: classId, 
        duration_minutes: duration 
      });
      setQrData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="card">
      <h2>Teacher Dashboard</h2>

      <form onSubmit={createSession}>
        <label>Class ID (enter class id from DB)</label>
        <input 
          value={classId} 
          onChange={e=>setClassId(e.target.value)} 
          required 
        />

        <label>QR Validity (minutes)</label>
        <input 
          type="number" 
          value={duration} 
          onChange={e=>setDuration(e.target.value)} 
          required 
        />

        <button className="btn">Create QR Session</button>
      </form>

      {qrData && (
        <div className="qr-block">
          <h3>
            QR Session Created — Expires:{" "}
            {new Date(qrData.expires_at).toLocaleString()}
          </h3>
          <QRCodeCanvas value={qrData.qrUrl} size={240} />
          <p>
            Token: <code>{qrData.token}</code>
          </p>
          <p>
            QR Url: <a href={qrData.qrUrl}>{qrData.qrUrl}</a>
          </p>
          <small>
            Students scan the QR or open the link to record attendance.
          </small>
        </div>
      )}
    </div>
  );
}
