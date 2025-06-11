import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlockchain } from './BlockchainContext'; 
import '../IssuingAuthority.css';

const IssuingAuthority = () => {
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addDocument } = useBlockchain();

  // ✅ Restrict access to issuer role
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'issuer') {
      alert("Access denied. Please login as Issuing Authority.");
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentType || !file) {
      alert('Please select a document type and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/issue', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.documentId) {
        throw new Error('No document ID received from backend.');
      }

      const document = {
        id: data.documentId,
        type: documentType,
        content: data.extractedText,
        issueDate: new Date().toISOString(),
        issuer: localStorage.getItem('username'),
        verified_by: null,
      };

      const success = addDocument(document);
      if (success) {
        console.log('✅ Document added to blockchain:', document);
        alert(`✅ Document issued with ID: ${data.documentId}`);
      } else {
        console.warn('⚠️ Document already exists in blockchain.');
        alert('⚠️ Document already exists.');
      }

      // Reset state and form
      setDocumentType('');
      setFile(null);
      e.target.reset();

    } catch (error) {
      console.error('❌ Error issuing document:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issuing-container">
      <h1 className="page-title">Issuing Authority Portal</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="documentType">Document Type:</label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            required
          >
            <option value="">Select a document type</option>
            <option value="birthCertificate">Birth Certificate</option>
            <option value="academicTranscript">Academic Transcript</option>
            <option value="experienceCertificate">Experience Certificate</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload Document:</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Generate and Store Document'}
        </button>
      </form>

      <Link to="/" className="back-home">← Back to Home</Link>
    </div>
  );
};

export default IssuingAuthority;