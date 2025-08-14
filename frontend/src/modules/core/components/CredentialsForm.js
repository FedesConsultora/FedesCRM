import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function CredentialsForm({ email, password, setEmail, setPassword, loading }) {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <>
      <label htmlFor="login-email" className="sr-only">Correo electrónico</label>
      <input
        id="login-email"
        type="email"
        name="email"
        placeholder="Correo electrónico"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />

      <div className="password-wrapper">
        <label htmlFor="login-password" className="sr-only">Contraseña</label>
        <input
          id="login-password"
          type={showPwd ? 'text' : 'password'}
          name="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
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
    </>
  );
}
