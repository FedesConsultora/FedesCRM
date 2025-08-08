// src/modules/core/pages/Login.jsx
import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, login2FA, googleLogin } from '../../../api/core';
import useAuth from '../../../shared/hooks/useAuth';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { GoogleLogin } from '@react-oauth/google';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

export default function Login() {
  const { login: loginUser } = useAuth();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [need2FA, setNeed2FA] = useState(false);
  const [token2FA, setToken2FA] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = useCallback(
    async (payload) => {
      // payload: { email, password, orgId? }
      const { data } = await login(payload);

      // Si el back decidiera pedir 2FA explícitamente en login:
      if (data?.require2FA) {
        setNeed2FA(true);
        showToast('Ingresá tu código 2FA', 'info');
        return;
      }

      // Éxito normal
      loginUser(data.token, data.user);
      showToast('Sesión iniciada', 'success');
      navigate('/');
    },
    [loginUser, navigate, showToast]
  );

  const handleSelectOrg = useCallback(
    async (orgId) => {
      try {
        setLoading(true);
        await doLogin({ email: form.email, password: form.password, orgId });
      } catch (err) {
        handleApiError(err, showToast, null, showModal);
      } finally {
        setLoading(false);
      }
    },
    [doLogin, form.email, form.password, showModal, showToast]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!need2FA) {
        await doLogin({ email: form.email, password: form.password });
      } else {
        const { data } = await login2FA({ email: form.email, token: token2FA });
        loginUser(data.token, data.user);
        showToast('2FA verificado', 'success');
        navigate('/');
      }
    } catch (err) {
      // Si el back responde con MULTIPLE_ORGS (409) traemos options
      const code = err?.response?.data?.code;
      const options = err?.response?.data?.options;

      if (code === 'MULTIPLE_ORGS' && Array.isArray(options) && options.length) {
        showModal({
          type: 'select-org',
          title: 'Seleccioná una organización',
          message: 'Tu usuario pertenece a varias organizaciones. Elegí una para continuar.',
          options,
          onSelect: handleSelectOrg
        });
        setLoading(false);
        return;
      }

      if (code === '2FA_REQUIRED') {
        setNeed2FA(true);
        showToast('Ingresá tu código 2FA', 'info');
        setLoading(false);
        return;
      }

      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  // Google idToken → /core/auth/google
  const onGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        showToast('No se pudo obtener el token de Google', 'error');
        return;
      }

      const { data } = await googleLogin({ idToken });

      // Si el usuario de Google tiene múltiples orgs, lo manejamos igual que arriba
      if (data?.success && data?.token && data?.user) {
        loginUser(data.token, data.user);
        showToast('Sesión iniciada con Google', 'success');
        navigate('/');
      }
    } catch (err) {
      const code = err?.response?.data?.code;
      const options = err?.response?.data?.options;

      if (code === 'MULTIPLE_ORGS' && Array.isArray(options) && options.length) {
        showModal({
          type: 'select-org',
          title: 'Seleccioná una organización',
          message: 'Tu cuenta pertenece a varias organizaciones. Elegí una para continuar.',
          options,
          onSelect: async (orgId) => {
            try {
              setLoading(true);
              const { data } = await googleLogin({ idToken: credentialResponse.credential, orgId });
              loginUser(data.token, data.user);
              showToast('Sesión iniciada con Google', 'success');
              navigate('/');
            } catch (e2) {
              handleApiError(e2, showToast, null, showModal);
            } finally {
              setLoading(false);
            }
          }
        });
        return;
      }

      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = () => {
    showToast('No se pudo iniciar con Google', 'error');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Iniciar sesión</h2>

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
              role="button"
              tabIndex={0}
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
          {loading ? 'Ingresando…' : (need2FA ? 'Verificar 2FA' : 'Ingresar')}
        </button>

        <div className="actions">
          {/* Google One Tap / Button (idToken) */}
          <div className="google-login-wrapper">
            <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
          </div>

          <Link to="/forgot-password" className="link">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/register" className="link">
            ¿No tenés cuenta? Registrate
          </Link>
        </div>
      </form>
    </div>
  );
}
