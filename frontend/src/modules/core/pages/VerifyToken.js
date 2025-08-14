import Logo from '../../../shared/components/Logo';
import useVerifyToken from '../hooks/useVerifyToken';

export default function VerifyToken() {
  const { status, loading, handleResend } = useVerifyToken();

  return (
    <div className="register-container">
      <div className="auth-card">
        <Logo showIcon showText vertical />

        {status === 'loading' && <p>Verificando cuenta...</p>}

        {status === 'success' && (
          <>
            <h2>¡Cuenta activada!</h2>
            <p>Ya podés iniciar sesión.</p>
            <button className="btn-primary" onClick={() => (window.location.href = '/login')}>
              Ir al Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h2>Error al verificar</h2>
            <p>No se pudo verificar tu cuenta. Podés solicitar un nuevo correo de verificación.</p>
            <button
              className="btn-primary"
              onClick={handleResend}
              disabled={loading}
              
            >
              {loading ? 'Reenviando…' : 'Solicitar nuevo correo'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
