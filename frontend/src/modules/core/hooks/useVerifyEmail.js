// src/modules/core/hooks/useVerifyEmail.js
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendVerification } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';

export default function useVerifyEmail() {
  const email = localStorage.getItem('emailRegistrado');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const [loading, setLoading] = useState(false);

  // ✅ Guard extra: si no hay email registrado → redirigir
  useEffect(() => {
    if (!email) {
      showToast('No hay un registro pendiente', 'error');
      navigate('/login');
    }
  }, [email, navigate, showToast]);

  const handleResend = useCallback(async () => {
    try {
      setLoading(true);
      await resendVerification({ email });
      showToast('Correo reenviado correctamente', 'success');
    } catch (err) {
      showModal({
        title: 'Error',
        message: 'No se pudo reenviar el correo. Intentalo más tarde.',
      });
    } finally {
      setLoading(false);
    }
  }, [email, showModal, showToast]);

  return { email, loading, handleResend };
}
