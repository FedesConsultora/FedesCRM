// src/modules/core/pages/RegisterStep1.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

import Logo from '../../../shared/components/Logo';
import GoogleButton from '../../../shared/components/GoogleButton';
import useRegisterAccount from '../hooks/useRegisterAccount';

export default function RegisterStep1() {
  const {
    form, setForm,
    repeat, setRepeat,
    loading, errors, setErrors,
    passwordValidations,
    handleSubmit,
    handleGoogleOAuth,
    onGoogleError,
  } = useRegisterAccount();

  const [showPassword, setShowPassword] = useState(false);

  // Acepta { code } (Auth Code) o { credential } (ID Token de One Tap)
  const handleGoogleRegister = async (payload) => {
    try {
      const { code, credential } = payload || {};
      await handleGoogleOAuth({ code, idToken: credential });
    } catch (e) {
      onGoogleError?.(e);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Registrarse</h2>

        {/* Nombre */}
        <label htmlFor="register-nombre" className="sr-only">Nombre</label>
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
          disabled={loading}
        />
        {errors.nombre && <span className="field-error">{errors.nombre}</span>}

        {/* Apellido */}
        <label htmlFor="register-apellido" className="sr-only">Apellido</label>
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
          disabled={loading}
        />
        {errors.apellido && <span className="field-error">{errors.apellido}</span>}

        {/* Email */}
        <label htmlFor="register-email" className="sr-only">Correo</label>
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
          disabled={loading}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}

        {/* Contraseña */}
        <div className="password-wrapper register">
          <label htmlFor="register-password" className="sr-only">Contraseña</label>
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
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={0}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        </div>
        {errors.password && <span className="field-error">{errors.password}</span>}

        {/* Reglas de contraseña */}
        <div className="password-rules" aria-live="polite">
          <p className={passwordValidations.length ? 'valid' : ''}>• Mínimo 8 caracteres</p>
          <p className={passwordValidations.upper ? 'valid' : ''}>• Al menos una mayúscula</p>
          <p className={passwordValidations.lower ? 'valid' : ''}>• Al menos una minúscula</p>
          <p className={passwordValidations.number ? 'valid' : ''}>• Al menos un número</p>
          <p className={passwordValidations.special ? 'valid' : ''}>• Al menos un símbolo (!@#$%)</p>
        </div>

        {/* Repetir contraseña */}
        <label htmlFor="register-repeat" className="sr-only">Repetir contraseña</label>
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
          style={{ borderColor: repeat && repeat === form.password ? '#3cb371' : '#ccc' }}
          disabled={loading}
        />
        {errors.repeat && <span className="field-error">{errors.repeat}</span>}

        {repeat && (
          <p className="match-status" style={{ color: repeat === form.password ? '#3cb371' : '#dc143c' }}>
            {repeat === form.password ? '✓ Coinciden' : '✗ No coinciden'}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Registrando…' : 'Siguiente'}
        </button>

        <div className="actions">
          <GoogleButton
            text="Registrarse con Google"
            disabled={loading}
            onSuccess={handleGoogleRegister}
            onError={onGoogleError}
          />

          <Link to="/login" className="link">
            ¿Ya tenés cuenta? Iniciá sesión
          </Link>
        </div>
      </form>
    </div>
  );
}