import React, { createContext, useContext, useState, useEffect } from 'react';

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [blockchain, setBlockchain] = useState(() => {
    const data = localStorage.getItem('blockchain');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          console.log("📦 Blockchain loaded from localStorage:", parsed);
          return parsed;
        }
      } catch (e) {
        console.error("❌ Error parsing blockchain from localStorage:", e);
      }
    }
    console.log("🔃 Initializing empty blockchain");
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('blockchain', JSON.stringify(blockchain));
      console.log("💾 Saving blockchain to localStorage:", blockchain);
    } catch (error) {
      console.error("❌ Error saving blockchain:", error);
    }
  }, [blockchain]);

  const addDocument = (document) => {
    if (!document || !document.id) {
      console.error("❌ Invalid document:", document);
      return false;
    }

    setBlockchain(prev => {
      if (prev.some(doc => doc.id === document.id)) {
        console.warn("⚠️ Document already exists:", document.id);
        return prev;
      }
      const updated = [...prev, document];
      console.log("✅ Document added to blockchain:", document);
      return updated;
    });

    return true;
  };

  const verifyDocument = (documentId, verifier) => {
    if (!documentId || !verifier) {
      console.error("❌ Invalid verification data:", { documentId, verifier });
      return false;
    }

    setBlockchain(prev => {
      const index = prev.findIndex(doc => doc.id === documentId);
      if (index === -1) {
        console.error("❌ Document not found:", documentId);
        return prev;
      }

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        verified_by: verifier,
        verificationDate: new Date().toISOString()
      };

      console.log("🔐 Document verified:", updated[index]);
      return updated;
    });

    return true;
  };

  return (
    <BlockchainContext.Provider value={{ blockchain, addDocument, verifyDocument }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
