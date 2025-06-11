import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import IssuingAuthority from './components/IssuingAuthority';
import VerifyingAuthority from './components/VerifyingAuthority';
import Individual from './components/Individual';
import IssuedDocuments from './components/issueddocuments';
import Login from './components/login';
import Register from './components/Register';
import { BlockchainProvider } from './components/BlockchainContext';

function AppContent() {
  const location = useLocation();

  // Routes where navigation bar should be hidden
  const hideNavRoutes = ['/', '/issuing', '/verifying', '/individual', '/login', '/register'];
  const hideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/issuing" element={<IssuingAuthority />} />
        <Route path="/verifying" element={<VerifyingAuthority />} />
        <Route path="/individual" element={<Individual />} />
        <Route path="/issued-docs" element={<IssuedDocuments />} />
      </Routes>

      {!hideNav && (
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/issuing">Issuing Authority</Link></li>
            <li><Link to="/verifying">Verifying Authority</Link></li>
            <li><Link to="/individual">Individual</Link></li>
            <li><Link to="/issued-docs">Issued Documents</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <BlockchainProvider>
        <AppContent />
      </BlockchainProvider>
    </Router>
  );
}

export default App;