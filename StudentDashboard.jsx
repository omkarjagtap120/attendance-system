// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Html5Qrcode } from 'html5-qrcode';

export default function StudentDashboard() {
  const [history, setHistory] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    loadHistory();
    // cleanup scanner on unmount
    return () => { if (scanner) scanner.stop().catch(()=>{}); };
  }, []);

  async function loadHistory() {
    try {
      const res = await API.get('/attendance/student/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function startScan() {
    setScanning(true);
    const html5QrCode = new Html5Qrcode("reader");
    setScanner(html5QrCode);
    const config = { fps: 10, qrbox: 250 };
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText, decodedResult) => {
          // when decoded, send token to backend
          await API.post('/attendance/mark', { token: decodedText.split('token=')[1] || decodedText });
          alert('Attendance recorded (if token valid).');
          await html5QrCode.stop();
          setScanning(false);
          loadHistory();
        },
        (errorMessage) => {
          // ignore
        }
      );
    } catch (err) {
      console.error(err);
      alert('Could not start camera. If on desktop, consider using QR link instead.');
      setScanning(false);
    }
  }

  async function stopScan() {
    if (scanner) {
      await scanner.stop();
      setScanner(null);
      setScanning(false);
    }
  }

  async function markByLink() {
    const token = prompt('Paste token or full QR url here (token=...)');
    if (!token) return;
    try {
      await API.post('/attendance/mark', { token: token.includes('token=') ? token.split('token=')[1] : token });
      alert('Attendance recorded (if token valid).');
      loadHistory();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="card">
      <h2>Student Dashboard</h2>

      <div className="scan-area">
        {!scanning && <button className="btn" onClick={startScan}>Start Camera Scan</button>}
        {scanning && <button className="btn" onClick={stopScan}>Stop Scan</button>}
        <button className="btn" onClick={markByLink}>Mark by Token / Link</button>
        <div id="reader" style={{ width: '320px', marginTop: '10px' }} />
      </div>

      <h3>Your Attendance</h3>
      <table className="table">
        <thead><tr><th>Course</th><th>Class Date</th><th>Status</th><th>Marked At</th></tr></thead>
        <tbody>
          {history.map(h => (
            <tr key={h.id}>
              <td>{h.course_title || '—'}</td>
              <td>{h.class_date?.split('T')[0] || '—'}</td>
              <td>{h.status}</td>
              <td>{new Date(h.marked_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
