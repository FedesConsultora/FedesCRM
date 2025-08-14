import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const displayName = (u) => {
  if (!u) return 'Usuario';
  const full = [u?.nombre, u?.apellido].filter(Boolean).join(' ').trim();
  if (full) return full;
  if (u?.name) return u.name;
  if (u?.email) return u.email.split('@')[0];
  return 'Usuario';
};

function AppHeader({ user, organizations, activeOrgId, onChangeOrg, onLogout }) {
  const bienvenida = useMemo(() => `Bienvenido, ${displayName(user)}`, [user]);
  return (
    <header className="app-header" role="banner">
      <div className="left">
        <h1 className="title">{bienvenida}</h1>
        {user?.organizacion?.nombre && (
          <span className="pill" title="Organización activa">{user.organizacion.nombre}</span>
        )}
        {user?.rol && user.rol !== 'superadmin_global' && (
          <span className="pill pill-outline" title="Rol">{user.rol}</span>
        )}
      </div>

      <div className="right">
        {organizations?.length > 1 && (
          <label className="sr-only" htmlFor="org-switch">Cambiar organización</label>
        )}
        {organizations?.length > 1 && (
          <select
            id="org-switch"
            value={activeOrgId || ''}
            onChange={(e) => onChangeOrg?.(e.target.value)}
            className="org-switch"
            title="Cambiar organización"
          >
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>{o.nombre || o.name}</option>
            ))}
          </select>
        )}
        <button type="button" className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}

AppHeader.propTypes = {
  user: PropTypes.object,
  organizations: PropTypes.array,
  activeOrgId: PropTypes.string,
  onChangeOrg: PropTypes.func,
  onLogout: PropTypes.func,
};

export default memo(AppHeader);
