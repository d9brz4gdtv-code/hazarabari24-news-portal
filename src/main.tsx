import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Register Service Worker for PWA
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('Service worker registration note:', err);
    });
  });
}

