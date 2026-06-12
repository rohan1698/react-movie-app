import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import './styles/moviecon.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker (vite-plugin-pwa). autoUpdate keeps the cached
// shell fresh on the next visit; bundled here so no inline script is injected.
registerSW({ immediate: true });
