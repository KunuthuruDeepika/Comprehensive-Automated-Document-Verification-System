import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IssuedDocuments = () => {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('username');
    if (role !== 'issuer') {
      alert('Access denied. Only issuing authorities can view issued documents.');
      navigate('/login');
      return;
    }

    const blockchain = JSON.parse(localStorage.getItem('blockchain') || '[]');
    const myDocs = blockchain.filter(doc => doc.issuer === user); // ✅ fixed key
    setDocs(myDocs);
  }, [navigate]);

  return (
    <div style={{ padding: '40px', backgroundColor: '#e6f0ff', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#004285', textShadow: '1px 1px 4px #00ff88' }}>
        Documents Issued by You
      </h2>

      {docs.length === 0 ? (
        <p style={{ marginTop: '20px' }}>No documents issued yet.</p>
      ) : (
        <ul style={{ marginTop: '20px' }}>
          {docs.map(doc => (
            <li key={doc.id} style={{ marginBottom: '16px', fontSize: '1rem' }}>
              📄 <strong>{doc.type}</strong> | 🆔 ID: {doc.id} | 🗓 Issued on: {new Date(doc.issueDate).toLocaleDateString()}
              <br />
              {doc.verified_by && (
                <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Verified by: {doc.verified_by}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <a href="/" style={{ display: 'block', marginTop: '30px', color: '#3b82f6', fontWeight: 'bold' }}>
        ← Back to Home
      </a>
    </div>
  );
};

export default IssuedDocuments;
