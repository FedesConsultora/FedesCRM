// src/modules/core/pages/RegisterStep1.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, googleUrl } from '../../../api/core';
import { FcGoogle } from 'react-icons/fc';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

const normalizeName = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

export default function RegisterStep1() {
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [repeat, setRepeat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      localStorage.setItem('pendingToken', data.pendingToken);
      localStorage.setItem('emailRegistrado', form.email);

      navigate('/register/organization'); // Step 2
    } catch (err) {
      handleApiError(err, showToast, setErrors);
    } finally {
      setLoading(false);
    }
  };

  const startGoogle = () => {
    window.location = googleUrl();
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Registrarse</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        {errors.nombre && <span className="field-error">{errors.nombre}</span>}

        <input
          type="text"
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
        />
        {errors.apellido && <span className="field-error">{errors.apellido}</span>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <div className="password-wrapper register">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </span>
        </div>
        {errors.password && <span className="field-error">{errors.password}</span>}

        <input
          type="password"
          placeholder="Repetir contraseña"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        />
        {errors.repeat && <span className="field-error">{errors.repeat}</span>}

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando…' : 'Siguiente'}
        </button>

        <div className="actions">
          <button type="button" onClick={startGoogle} className="google-btn">
            <FcGoogle size={20} /> Registrarse con Google
          </button>
          <a href="/login" className="link">
            ¿Ya tenés cuenta? Iniciá sesión
          </a>
        </div>
      </form>
    </div>
  );
}
