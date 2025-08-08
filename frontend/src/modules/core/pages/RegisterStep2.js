// src/modules/core/pages/RegisterStep2.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerOrganization } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import Logo from '../../../shared/components/Logo';

export default function RegisterStep2() {
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', dominio: '', sector: '', descripcionProblema: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pendingToken = localStorage.getItem('pendingToken');
    if (!pendingToken) {
      showToast('Error: no se encontró token de registro', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await registerOrganization({ ...form, pendingToken });

      navigate('/verify-email');
    } catch (err) {
      handleApiError(err, showToast, setErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <Logo showIcon showText vertical />
        <h2>Datos de tu Empresa</h2>

        <input
          type="text"
          placeholder="Nombre de la empresa"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        {errors.nombre && <span className="field-error">{errors.nombre}</span>}

        <input
          type="text"
          placeholder="Dominio corporativo (ej: fedes.com)"
          value={form.dominio}
          onChange={(e) => setForm({ ...form, dominio: e.target.value })}
        />
        {errors.dominio && <span className="field-error">{errors.dominio}</span>}

        <select
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        >
          <option value="">Seleccione el sector</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.sector && <span className="field-error">{errors.sector}</span>}

        <textarea
          placeholder="¿Qué problemas busca resolver con FedesCRM?"
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
