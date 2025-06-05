import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.status === 'success') {
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      if (data.role === 'issuer') navigate('/issuing');
      else if (data.role === 'verifier') navigate('/verifying');
    } else {
      alert('❌ Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">🔐 Login</button>
      </form>

      {/* 🔗 Register link */}
      <p style={{ marginTop: '20px' }}>
        New user? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
