// src/modules/core/pages/RegisterStep1.jsx
import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, googleLogin } from '../../../api/core';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { GoogleLogin } from '@react-oauth/google';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';
import useAuth from '../../../shared/hooks/useAuth';

// Normaliza nombres: " juan  pérez " -> "Juan Pérez"
const normalizeName = (str) =>
  String(str || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

export default function RegisterStep1() {
  const { login: loginUser } = useAuth();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [repeat, setRepeat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validaciones de contraseña en tiempo real
  const passwordValidations = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[!@#$%^&*]/.test(form.password),
  };
  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Correo inválido';

    if (!form.password) newErrors.password = 'La contraseña es obligatoria';
    else if (!allValid) newErrors.password = 'La contraseña no cumple los requisitos';

    if (repeat !== form.password) newErrors.repeat = 'Las contraseñas no coinciden';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const cleanData = {
        ...form,
        nombre: normalizeName(form.nombre),
        apellido: normalizeName(form.apellido),
      };

      const { data } = await register(cleanData);

      // Guardamos pendingToken para step 2
      if (data?.pendingToken) {
        localStorage.setItem('pendingToken', data.pendingToken);
      }
      localStorage.setItem('emailRegistrado', form.email);

      showModal({
        title: 'Registro iniciado',
        message: data?.message || 'Continuá con los datos de tu organización.',
      });

      // Paso 2: crear organización o unirse
      navigate('/register/organization');
    } catch (err) {
      // Pintar validaciones / duplicados, etc.
      handleApiError(err, showToast, setErrors, showModal);
    } finally {
      setLoading(false);
    }
  };

  // Google idToken → /core/auth/google
  const onGoogleSuccess = useCallback(
    async (credentialResponse) => {
      try {
        setLoading(true);
        const idToken = credentialResponse?.credential;
        if (!idToken) {
          showToast('No se pudo obtener el token de Google', 'error');
          return;
        }

        const { data } = await googleLogin({ idToken });

        // Caso 1: cuenta nueva via Google -> debe crear/unirse a org (ACCOUNT_CREATED_NO_ORG)
        if (data?.code === 'ACCOUNT_CREATED_NO_ORG' && data?.pendingToken) {
          localStorage.setItem('pendingToken', data.pendingToken);
          showModal({
            title: 'Cuenta creada',
            message: 'Continuá creando o uniéndote a una organización.',
          });
          navigate('/register/organization');
          return;
        }

        // Caso 2: login directo (ya tiene org)
        if (data?.success && data?.token && data?.user) {
          loginUser(data.token, data.user);
          showToast('Sesión iniciada con Google', 'success');
          navigate('/');
          return;
        }

        // Si cae algo raro, forzamos manejo genérico
        showToast('No se pudo completar el inicio con Google', 'error');
      } catch (err) {
        const code = err?.response?.data?.code;
        const options = err?.response?.data?.options;

        // Caso 3: varias orgs -> seleccionar
        if (code === 'MULTIPLE_ORGS' && Array.isArray(options) && options.length) {
          showModal({
            type: 'select-org',
            title: 'Seleccioná una organización',
            message: 'Tu cuenta pertenece a varias organizaciones. Elegí una para continuar.',
            options,
            onSelect: async (orgId) => {
              try {
                setLoading(true);
                const { data } = await googleLogin({
                  idToken: credentialResponse.credential,
                  orgId,
                });
                loginUser(data.token, data.user);
                showToast('Sesión iniciada con Google', 'success');
                navigate('/');
              } catch (e2) {
                handleApiError(e2, showToast, setErrors, showModal);
              } finally {
                setLoading(false);
              }
            },
          });
          return;
        }

        // Caso 4: usuario existente sin org
        if (code === 'NO_ORG_MEMBERSHIP') {
          showModal({
            title: 'Falta unirse a una organización',
            message: 'Creá o uníte a una organización para continuar.',
          });
          navigate('/register/organization');
          return;
        }

        handleApiError(err, showToast, setErrors, showModal);
      } finally {
        setLoading(false);
      }
    },
    [loginUser, navigate, showModal, showToast]
  );

  const onGoogleError = () => {
    showToast('No se pudo iniciar con Google', 'error');
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Registrarse</h2>

        {/* Nombre */}
        <input
          id="register-nombre"
          name="nombre"
          type="text"
          placeholder="Nombre"
          autoComplete="given-name"
          value={form.nombre}
          onChange={(e) => {
            setForm({ ...form, nombre: e.target.value });
            if (errors.nombre) setErrors({ ...errors, nombre: '' });
          }}
        />
        {errors.nombre && <span className="field-error">{errors.nombre}</span>}

        {/* Apellido */}
        <input
          id="register-apellido"
          name="apellido"
          type="text"
          placeholder="Apellido"
          autoComplete="family-name"
          value={form.apellido}
          onChange={(e) => {
            setForm({ ...form, apellido: e.target.value });
            if (errors.apellido) setErrors({ ...errors, apellido: '' });
          }}
        />
        {errors.apellido && <span className="field-error">{errors.apellido}</span>}

        {/* Email */}
        <input
          id="register-email"
          name="email"
          type="email"
          placeholder="Correo electrónico"
          autoComplete="email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}

        {/* Contraseña */}
        <div className="password-wrapper register">
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            role="button"
            tabIndex={0}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </span>
        </div>
        {errors.password && <span className="field-error">{errors.password}</span>}

        {/* Reglas de contraseña en tiempo real */}
        <div className="password-rules" aria-live="polite">
          <p className={passwordValidations.length ? 'valid' : ''}>• Mínimo 8 caracteres</p>
          <p className={passwordValidations.upper ? 'valid' : ''}>• Al menos una mayúscula</p>
          <p className={passwordValidations.lower ? 'valid' : ''}>• Al menos una minúscula</p>
          <p className={passwordValidations.number ? 'valid' : ''}>• Al menos un número</p>
          <p className={passwordValidations.special ? 'valid' : ''}>• Al menos un símbolo (!@#$%)</p>
        </div>

        {/* Repetir contraseña */}
        <input
          id="register-repeat"
          name="repeat"
          type="password"
          placeholder="Repetir contraseña"
          autoComplete="new-password"
          value={repeat}
          onChange={(e) => {
            setRepeat(e.target.value);
            if (errors.repeat) setErrors({ ...errors, repeat: '' });
          }}
          style={{
            borderColor: repeat && repeat === form.password ? '#3cb371' : '#ccc',
          }}
        />
        {errors.repeat && <span className="field-error">{errors.repeat}</span>}

        {repeat && (
          <p
            className="match-status"
            style={{ color: repeat === form.password ? '#3cb371' : '#dc143c' }}
          >
            {repeat === form.password ? '✓ Coinciden' : '✗ No coinciden'}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando…' : 'Siguiente'}
        </button>

        <div className="actions">
          {/* Google One Tap / Button (idToken) */}
          <div className="google-login-wrapper">
            <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
          </div>

          <Link to="/login" className="link">
            ¿Ya tenés cuenta? Iniciá sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
