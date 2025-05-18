import React, { useState } from 'react';

const Register = ({ onRegisterSuccess, activeTab, setActiveTab }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    birthday: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          birthday: form.birthday
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.msg}`);
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        setMessage(`❌ ${data.detail || "Something went wrong."}`);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server.");
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.leftSide}></div>

        <div style={styles.rightSide}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.heading}>‧₊˚✧ Welcome ✧˚₊‧</h2>

            {/* Toggle Tabs */}
            <div style={styles.tabWrapper}>
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                style={{
                  ...styles.tabButton,
                  backgroundColor: activeTab === "login" ? "#4665a6" : "transparent",
                  color: activeTab === "login" ? "white" : "black"
                }}
              >
                🔐 Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                style={{
                  ...styles.tabButton,
                  backgroundColor: activeTab === "register" ? "#4665a6" : "transparent",
                  color: activeTab === "register" ? "white" : "black"
                }}
              >
                ✍️ Register
              </button>
            </div>

            <input
              style={styles.input}
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="date"
              name="birthday"
              placeholder="Birthday"
              value={form.birthday}
              onChange={handleChange}
              required
            />

            <button type="submit" style={styles.button}>Sign Up</button>
            {message && <p style={{ color: 'white', marginTop: '1rem' }}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#8E7DBE',
  },
  innerContainer: {
    display: 'flex',
    height: '80%',
    width: '75%',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  leftSide: {
    flex: 1,
    backgroundColor: '#A6D6D6',
    backgroundImage: 'url(/image/undraw_weather-app_4cp0.svg)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE6C9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '70%',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    backgroundColor: '#5F99AE',
  },
  heading: {
    textAlign: 'center',
    margin: '0 0 10px 0',
    color: '#F7CFD8',
    fontSize: '2rem',
  },
  tabWrapper: {
    display: 'flex',
    backgroundColor: '#e5dcfb',
    borderRadius: '999px',
    padding: '0.25rem',
    marginBottom: '1rem',
  },
  tabButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
    backgroundColor: 'transparent',
  },
  input: {
    padding: '12px 20px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '100%',
    backgroundColor: '#F4F8D3',
    color: '#333',
  },
  button: {
    padding: '12px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#A6D6D6',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    width: '50%',
    fontWeight: 'bold',
  },
};

export default Register;
