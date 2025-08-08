// src/modules/core/pages/RegisterStep2.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerOrg } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

const normalizeDomain = (raw = '') => {
  let d = String(raw).trim().toLowerCase();
  d = d.replace(/^https?:\/\//i, '');
  d = d.replace(/^www\./i, '');
  d = d.replace(/\/.*$/i, ''); // corta paths
  return d;
};

export default function RegisterStep2() {
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    dominio: '',
    sector: '',
    descripcionProblema: '',
    consultasMes: '' // opcional
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const sectors = [
    'Bienes Raíces', 'Alimentos y Bebidas', 'Consultoría y Servicios profesionales',
    'Deportes', 'Diseño y Fotografía', 'Educación', 'Eventos y Entretenimiento',
    'Finanzas', 'Hogar y Decoración', 'Indumentaria', 'Industrial', 'Motores',
    'ONG', 'Publicidad y Marketing', 'Venta Minorista', 'Salud y Estética',
    'Seguridad', 'Seguros', 'Legal/Contabilidad', 'TIC', 'Software',
    'Tv, Prensa y Radio', 'Servicios', 'Viajes y Turismo', 'Otro'
  ];

  const validate = () => {
    const e = {};
    if (!String(form.nombre).trim()) e.nombre = 'El nombre de la empresa es obligatorio';
    const dom = normalizeDomain(form.dominio);
    if (!dom) e.dominio = 'El dominio es obligatorio';
    else if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(dom)) e.dominio = 'Dominio inválido (ej: fedes.com)';
    if (!String(form.sector).trim()) e.sector = 'Seleccioná un sector';
    if (form.consultasMes && !/^\d+$/.test(String(form.consultasMes))) e.consultasMes = 'Debe ser un número';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientErrors = validate();
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    const pendingToken = localStorage.getItem('pendingToken');
    if (!pendingToken) {
      showToast('No se encontró el token de registro. Volvé a iniciar el proceso.', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        pendingToken,
        nombre: String(form.nombre).trim(),
        dominio: normalizeDomain(form.dominio),
        sector: form.sector,
        descripcionProblema: form.descripcionProblema?.trim() || undefined,
        consultasMes: form.consultasMes ? Number(form.consultasMes) : undefined
      };

      const { data } = await registerOrg(payload);

      // Feedback y redirección al verify
      showModal({
        title: 'Organización creada',
        message: data?.message || 'Revisá tu email para verificar tu cuenta.'
      });
      navigate('/verify-email');
    } catch (err) {
      // Pintamos errores por campo si vinieron en details (VALIDATION_ERROR) o códigos específicos
      handleApiError(err, showToast, setErrors, showModal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Datos de tu Empresa</h2>

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre de la empresa"
          value={form.nombre}
          onChange={(e) => {
            setForm({ ...form, nombre: e.target.value });
            if (errors.nombre) setErrors({ ...errors, nombre: '' });
          }}
        />
        {errors.nombre && <span className="field-error">{errors.nombre}</span>}

        {/* Dominio */}
        <input
          type="text"
          placeholder="Dominio corporativo (ej: fedes.com)"
          value={form.dominio}
          onChange={(e) => {
            setForm({ ...form, dominio: e.target.value });
            if (errors.dominio) setErrors({ ...errors, dominio: '' });
          }}
        />
        {errors.dominio && <span className="field-error">{errors.dominio}</span>}

        {/* Sector */}
        <select
          value={form.sector}
          onChange={(e) => {
            setForm({ ...form, sector: e.target.value });
            if (errors.sector) setErrors({ ...errors, sector: '' });
          }}
        >
          <option value="">Seleccione el sector</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.sector && <span className="field-error">{errors.sector}</span>}

        {/* Consultas/mes (opcional) */}
        <input
          type="number"
          min="0"
          placeholder="Consultas por mes (opcional)"
          value={form.consultasMes}
          onChange={(e) => {
            setForm({ ...form, consultasMes: e.target.value });
            if (errors.consultasMes) setErrors({ ...errors, consultasMes: '' });
          }}
        />
        {errors.consultasMes && <span className="field-error">{errors.consultasMes}</span>}

        {/* Descripción del problema (opcional) */}
        <textarea
          placeholder="¿Qué problemas buscás resolver con FedesCRM? (opcional)"
          value={form.descripcionProblema}
          onChange={(e) => setForm({ ...form, descripcionProblema: e.target.value })}
          maxLength={500}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Finalizar'}
        </button>
      </form>
    </div>
  );
}
