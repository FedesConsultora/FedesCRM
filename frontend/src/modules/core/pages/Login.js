// src/modules/core/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, login2FA, googleUrl } from '../../../api/core';
import useAuth from '../../../shared/hooks/useAuth';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { FcGoogle } from 'react-icons/fc';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

export default function Login() {
  const { login: loginUser } = useAuth();
  const { showToast } = useToast();
  const { showModal } = useModal();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [need2FA, setNeed2FA] = useState(false);
  const [token2FA, setToken2FA] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!need2FA) {
        const { data } = await login(form);

        if (data.require2FA) {
          setNeed2FA(true);
          showToast('Ingrese su código 2FA', 'info');
        } else {
          loginUser(data.token, data.user);
          showToast('Sesión iniciada', 'success');
          navigate('/');
        }
      } else {
        const { data } = await login2FA({ email: form.email, token: token2FA });
        loginUser(data.token, data.user);
        showToast('2FA exitoso', 'success');
        navigate('/');
      }
    } catch (err) {
      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  const startGoogle = () => {
    window.location = googleUrl();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />  
        <h2 className='tituloLogin'>Iniciar sesión</h2>

        <label htmlFor="login-email" className="sr-only">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {!need2FA && (
          <div className="password-wrapper">
            <label htmlFor="login-password" className="sr-only">Contraseña</label>
            <input
              id="login-password"
              type={showPwd ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              autoComplete="current-password"
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
        )}

        {need2FA && (
          <>
            <label htmlFor="token2FA" className="sr-only">Código 2FA</label>
            <input
              id="token2FA"
              name="token2FA"
              placeholder="Código 2FA"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              autoComplete="one-time-code"
              value={token2FA}
              onChange={(e) => setToken2FA(e.target.value.replace(/\D/g, ''))}
              required
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <div className="actions">
          <button type="button" onClick={startGoogle} className="google-btn">
            <FcGoogle size={20} /> Iniciar con Google
          </button>

          <a href="/forgot-password" className="link">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="/register" className="link">
            ¿No tenés cuenta? Registrate
          </a>
        </div>
      </form>
    </div>
  );
}
