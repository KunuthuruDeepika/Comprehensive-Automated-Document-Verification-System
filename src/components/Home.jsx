// Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleAccess = () => {
    if (!role) {
      alert('Please login first.');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="home-container">
      <h1>Automated Document Verification System</h1>
      <p>
        Welcome to the comprehensive portal for generating, verifying, and accessing essential documents for official purposes.
      </p>

      <div className="button-container">
        <ul className="nav-buttons">
          <li><Link to="/issuing" onClick={handleAccess}>Issuing Authority</Link></li>
          <li><Link to="/verifying" onClick={handleAccess}>Verifying Authority</Link></li>
          <li><Link to="/individual" onClick={handleAccess}>Individual</Link></li>
          <li><Link to="/issued-docs">View Issued Documents</Link></li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        {!username ? (
          <Link to="/login" className="login-link">
            <button>🔐 Login</button>
          </Link>
        ) : (
          <>
            <p style={{ fontStyle: 'italic' }}>
              Logged in as <strong>{username}</strong> ({role})
            </p>
            <button onClick={handleLogout}>🚪 Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
