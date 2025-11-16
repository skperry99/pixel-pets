// src/main.jsx
// Entry point for the Pixel Pets frontend.
// Mounts the React app and wraps it in global providers (e.g., NoticeProvider).

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { NoticeProvider } from './components/NoticeProvider';
import './style.css';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <NoticeProvider>
      <App />
    </NoticeProvider>
  </StrictMode>,
);
