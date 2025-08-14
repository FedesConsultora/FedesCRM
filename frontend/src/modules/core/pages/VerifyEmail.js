import Logo from '../../../shared/components/Logo';
import useVerifyEmail from '../hooks/useVerifyEmail';

export default function VerifyEmail() {
  const { email, loading, handleResend } = useVerifyEmail();

  if (!email) return null; // Guard extra, igual ya lo hace el hook

  return (
    <div className="register-container">
      <div className="auth-card">
        <Logo showIcon showText vertical />
        <h2>Verificá tu correo</h2>
        <p>
          Te enviamos un correo de verificación a <strong>{email}</strong>.
          Revisá tu bandeja de entrada y seguí las instrucciones.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="btn-primary"
          
        >
          {loading ? 'Reenviando…' : 'Reenviar verificación'}
        </button>

        <p>
          Si no lo encontrás, revisá la carpeta de spam o promociones.
        </p>
      </div>
    </div>
  );
}
