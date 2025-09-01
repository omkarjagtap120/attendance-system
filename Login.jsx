// src/pages/Login.jsx
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      if (!res.data?.token) {
        setErr("No token received from server");
        return;
      }

      localStorage.setItem('token', res.data.token);

      const role = jwtDecode(res.data.token).role;
      if (role === 'teacher') navigate('/teacher');
      else if (role === 'student') navigate('/student');
      else navigate('/admin');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="btn">Login</button>
      </form>
    </div>
  );
}
