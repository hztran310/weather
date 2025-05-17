// src/pages/Register.jsx
import React, { useState } from 'react';
import './Register.css'; // Optional styling

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    birthday: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.msg}`);
      } else {
        setMessage(`❌ ${data.detail || "Something went wrong."}`);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Birthday:
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default Register;
