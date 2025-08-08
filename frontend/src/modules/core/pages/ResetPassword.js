import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

export default function ResetPassword() {
  const { token } = useParams(); // Token de la URL
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal } = useModal();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword) {
      showToast('Completá ambos campos', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await resetPassword({ token, newPassword: form.password });

      showModal({
        title: 'Contraseña actualizada',
        message: data.message || 'Tu contraseña fue restablecida correctamente.',
      });

      navigate('/login');
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
        <h2 className="tituloLogin">Restablecer contraseña</h2>

        {/* Password */}
        <div className="password-wrapper">
          <input
            type={showPwd ? 'text' : 'password'}
            name="password"
            placeholder="Nueva contraseña"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPwd ? <BsEyeSlash /> : <BsEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="password-wrapper">
          <input
            type={showConfirmPwd ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
          <span
            className="toggle-eye"
            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
            aria-label={showConfirmPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirmPwd ? <BsEyeSlash /> : <BsEye />}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando…' : 'Actualizar contraseña'}
        </button>

        <div className="actions">
          <a href="/login" className="link">
            Volver al inicio de sesión
          </a>
        </div>
      </form>
    </div>
  );
}
