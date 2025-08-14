// src/modules/core/hooks/useVerifyToken.js
import { useState, useEffect, useCallback } from 'react';
import { verifyEmail, resendVerification } from '../../../api/core';
import { useParams, useNavigate } from 'react-router-dom';
import useToast from '../../../shared/hooks/useToast';

export default function useVerifyToken() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [loading, setLoading] = useState(false);
  const [email] = useState(localStorage.getItem('emailRegistrado') || '');

  // ✅ Guard extra: si no hay token → redirigir
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        localStorage.removeItem('pendingToken');
        localStorage.removeItem('emailRegistrado');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  const handleResend = useCallback(async () => {
    if (!email) {
      navigate('/register');
      return;
    }
    try {
      setLoading(true);
      await resendVerification({ email });
      showToast('Correo reenviado correctamente', 'success');
      navigate('/verify-email');
    } catch {
      showToast('No se pudo reenviar el correo', 'error');
    } finally {
      setLoading(false);
    }
  }, [email, navigate, showToast]);

  return { status, loading, handleResend };
}
