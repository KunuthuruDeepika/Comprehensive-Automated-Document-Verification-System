import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('verifier');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      alert('✅ Registration successful. Please login.');
      navigate('/login');
    } else {
      alert(`❌ ${data.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="login-form">
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="verifier">Verifier</option>
          <option value="issuer">Issuer</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
