import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from './BlockchainContext'; // ✅ adjust path as needed
import '../individual.css';

const Individual = () => {
  const navigate = useNavigate();
  const { blockchain } = useBlockchain();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    // ✅ Access control
    if (role !== 'verifier' || !username) {
      alert("Access denied. Please login as a Verifying Authority.");
      navigate('/login');
      return;
    }

    // ✅ Filter only documents verified by this user
    const userDocs = blockchain.filter(doc => doc.verified_by === username);
    setDocuments(userDocs);
  }, [blockchain, navigate]);

  return (
    <div className="individual-container">
      <h1 className="page-title">Individual Portal</h1>
      <div className="documents-section">
        <h2>Verified Documents</h2>
        {documents.length === 0 ? (
          <p>No verified documents found for your account.</p>
        ) : (
          <ul className="documents-list">
            {documents.map((doc) => (
              <li key={doc.id} className="document-item">
                <div className="document-header">
                  <h3>{doc.type}</h3>
                  <span className="document-id">ID: {doc.id}</span>
                </div>
                <div className="document-details">
                  <p><strong>Issued by:</strong> {doc.issuer}</p>
                  <p><strong>Issue Date:</strong> {new Date(doc.issueDate).toLocaleDateString()}</p>
                  <p><strong>Verified by:</strong> {doc.verified_by}</p>
                  {doc.verificationDate && (
                    <p><strong>Verification Date:</strong> {new Date(doc.verificationDate).toLocaleDateString()}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <a href="/" className="back-home">← Back to Home</a>
    </div>
  );
};

export default Individual;
