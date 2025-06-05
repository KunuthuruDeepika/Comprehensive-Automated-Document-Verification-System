import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BlockchainProvider } from './components/BlockchainContext'; // Fix the import path

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BlockchainProvider>
      <App />
    </BlockchainProvider>
  </React.StrictMode>
);
