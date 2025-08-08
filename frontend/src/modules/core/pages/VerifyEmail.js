import { useNavigate } from 'react-router-dom';
import Logo from '../../../shared/components/Logo';

export default function VerifyEmail() {
  const email = localStorage.getItem('emailRegistrado') || '';
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="auth-card">
        <Logo showIcon showText vertical />
        <h2>Verificá tu correo</h2>
        <p>
          Te enviamos un correo de verificación a <strong>{email}</strong>.
          Revisa tu bandeja de entrada y seguí las instrucciones para activar tu cuenta.
        </p>
        <button onClick={() => navigate('/login')}>Volver al Login</button>
      </div>
    </div>
  );
}
