import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from './BlockchainContext'; // ✅ Adjust path if needed
import '../VerifyingAuthority.css';

const VerifyingAuthority = () => {
  const [file, setFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyDocument } = useBlockchain(); // ✅ context hook

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'verifier') {
      alert("Access denied. Please login as a Verifying Authority.");
      navigate('/login');
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a document.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('verifier', localStorage.getItem('username'));

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVerificationResult(data.message);

      // ✅ Update blockchain if matched_id is present
      if (data.message.includes("✅") && data.matched_id) {
        verifyDocument(data.matched_id, localStorage.getItem('username'));
      }

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult('❌ Error during verification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h1 className="verify-title">Verifying Authority Portal</h1>
      <form className="verify-form" onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="file">Upload Document for Verification:</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
        </div>
        <button className="verify-button" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Document"}
        </button>
      </form>

      {verificationResult && (
        <div className="verify-result">
          <h2>Verification Result:</h2>
          <p>{verificationResult}</p>
        </div>
      )}

      <a className="verify-back" href="/">← Back to Home</a>
    </div>
  );
};

export default VerifyingAuthority;
