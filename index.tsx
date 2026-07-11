import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import Tailwind CSS

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("FATAL: Failed to mount application", e);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; color: #dc2626;">
      <h1>Application Error</h1>
      <p>Failed to initialize the application. Please check the console for details.</p>
      <pre style="background: #fef2f2; padding: 10px; border-radius: 4px; overflow: auto;">${e}</pre>
    </div>
  `;
}
