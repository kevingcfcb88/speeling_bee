import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Disable StrictMode temporarily to avoid double-mounting issues with audio/state if needed
// However, React 18 StrictMode is fine with our dnd-kit setup.
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
