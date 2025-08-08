import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import Logo from '../../../shared/components/Logo';

export default function VerifyToken() {
  const { token } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        showToast('Token inválido o expirado', 'error');
      }
    };

    verify();
  }, [token, showToast]);

  return (
    <div className="register-container">
      <div className="auth-card">
        <Logo showIcon showText vertical />
        {status === 'loading' && <p>Verificando cuenta...</p>}
        {status === 'success' && (
          <>
            <h2>¡Cuenta activada!</h2>
            <p>Ya podés iniciar sesión.</p>
            <button onClick={() => navigate('/login')}>Ir al Login</button>
          </>
        )}
        {status === 'error' && (
          <>
            <h2>Error</h2>
            <p>No se pudo verificar tu cuenta. Verificá el link o solicitá uno nuevo.</p>
          </>
        )}
      </div>
    </div>
  );
}
