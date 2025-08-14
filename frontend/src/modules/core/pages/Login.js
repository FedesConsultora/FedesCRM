// src/modules/core/pages/Login.jsx
import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, login2FA, googleLogin } from '../../../api/core';
import useAuth from '../../../shared/hooks/useAuth';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';
import GoogleButton from '../../../shared/components/GoogleButton';

import CredentialsForm from '../components/CredentialsForm';
import TwoFAForm from '../components/TwoFAForm';

export default function Login() {
  const { login: loginUser } = useAuth();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [need2FA, setNeed2FA] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = useCallback(
    async (payload) => {
      const { data } = await login(payload);

      if (data?.require2FA) {
        setNeed2FA(true);
        showToast('Ingresá tu código 2FA', 'info');
        return;
      }

      // httpOnly cookie → usamos sólo data.user
      loginUser(data.user);
      showToast('Sesión iniciada', 'success');
      navigate('/');
    },
    [loginUser, navigate, showToast]
  );

  const handleSelectOrg = useCallback(
    async (orgId) => {
      try {
        setLoading(true);
        await doLogin({ email, password, orgId });
      } catch (err) {
        handleApiError(err, showToast, null, showModal);
      } finally {
        setLoading(false);
      }
    },
    [doLogin, email, password, showModal, showToast]
  );

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await doLogin({ email, password });
    } catch (err) {
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
        return;
      }

      if (code === '2FA_REQUIRED') {
        setNeed2FA(true);
        showToast('Ingresá tu código 2FA', 'info');
        return;
      }

      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2FA = async ({ token2FA }) => {
    try {
      setLoading(true);
      const { data } = await login2FA({ email, token: token2FA });
      loginUser(data.user);
      showToast('2FA verificado', 'success');
      navigate('/');
    } catch (err) {
      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  // Google (auth-code): recibimos { code } del botón y lo mandamos al backend
  const handleGoogleLogin = async ({ code }) => {
    try {
      setLoading(true);
      const { data } = await googleLogin({ code });

      // Cuenta creada pero sin membresías → paso 2 (crear/unirse a org)
      if (data?.code === 'ACCOUNT_CREATED_NO_ORG' && data?.pendingToken) {
        localStorage.setItem('pendingToken', data.pendingToken);
        showModal({
          title: 'Cuenta creada',
          message: data?.message || 'Continuá creando o uniéndote a una organización.',
        });
        navigate('/register/organization');
        return;
      }

      // Login directo (cookie httpOnly ya seteada)
      if (data?.success && data?.user) {
        loginUser(data.user);
        showToast('Sesión iniciada con Google', 'success');
        navigate('/');
        return;
      }

      // Varias organizaciones
      if (data?.code === 'MULTIPLE_ORGS' && Array.isArray(data?.options)) {
        showModal({
          type: 'select-org',
          title: 'Seleccioná una organización',
          message: 'Tu cuenta pertenece a varias organizaciones. Elegí una para continuar.',
          options: data.options,
          onSelect: async (orgId) => {
            const { data: orgData } = await googleLogin({ code, orgId });
            loginUser(orgData.user);
            showToast('Sesión iniciada con Google', 'success');
            navigate('/');
          }
        });
        return;
      }

      showToast('No se pudo completar el inicio con Google', 'error');
    } catch (err) {
      // 👇 Manejo específico del 403 sin membresías (redirige)
      const code = err?.response?.data?.code;
      if (code === 'NO_ORG_MEMBERSHIP') {
        showModal({
          title: 'Falta unirse a una organización',
          message: 'Creá o uníte a una organización para continuar.',
        });
        navigate('/register/organization');
        setLoading(false);
        return;
      }

      handleApiError(err, showToast, null, showModal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={need2FA ? undefined : handleSubmitCredentials} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Iniciar sesión</h2>

        {!need2FA ? (
          <CredentialsForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            loading={loading}
          />
        ) : (
          <TwoFAForm onSubmit={handleSubmit2FA} loading={loading} />
        )}

        <button type={need2FA ? 'button' : 'submit'} disabled={loading}>
          {loading ? 'Ingresando…' : (need2FA ? 'Verificar 2FA' : 'Ingresar')}
        </button>

        <div className="actions">
          <GoogleButton
            text="Iniciar sesión con Google"
            disabled={loading}
            onSuccess={handleGoogleLogin} // recibe { code }
          />

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