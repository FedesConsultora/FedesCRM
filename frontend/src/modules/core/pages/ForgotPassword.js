import { useState } from 'react';
import { forgotPassword } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

export default function ForgotPassword() {
  const { showToast } = useToast();
  const { showModal } = useModal();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Ingresá tu correo electrónico', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await forgotPassword({ email });

      showModal({
        title: 'Enlace enviado',
        message:
          data.message ||
          'Si el correo existe en nuestra base, recibirás un enlace para restablecer tu contraseña.',
      });

      setEmail('');
    } catch (err) {
      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Recuperar contraseña</h2>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>

        <div className="actions">
          <a href="/login" className="link">
            Volver al inicio de sesión
          </a>
          <a href="/register" className="link">
            Crear una nueva cuenta
          </a>
        </div>
      </form>
    </div>
  );
}
