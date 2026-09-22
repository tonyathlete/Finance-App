import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from '@/context/AppContext';
import { RouterProvider } from '@/lib/router';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Élément racine introuvable');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </AppProvider>
  </React.StrictMode>
);
