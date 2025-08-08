// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ModalProvider from './shared/context/ModalProvider';
import ToastProvider from './shared/context/ToastProvider';
import { AuthProvider } from './shared/context/AuthProvider';
import './styles/main.scss';

// Cargamos el Client ID desde .env
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
