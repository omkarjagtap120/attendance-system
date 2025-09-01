// src/pages/Signup.jsx
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', roll_no:'', department:'', year:'' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      alert('Signup successful. You can now login.');
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="card">
      <h2>Signup</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />

        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />

        <label>Role</label>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {form.role === 'student' && <>
          <label>Roll No</label>
          <input value={form.roll_no} onChange={e=>setForm({...form, roll_no:e.target.value})} />
          <label>Department</label>
          <input value={form.department} onChange={e=>setForm({...form, department:e.target.value})} />
          <label>Year</label>
          <input value={form.year} onChange={e=>setForm({...form, year:e.target.value})} />
        </>}

        {form.role === 'teacher' && <>
          <label>Department</label>
          <input value={form.department} onChange={e=>setForm({...form, department:e.target.value})} />
        </>}

        <button className="btn">Signup</button>
      </form>
    </div>
  );
}
