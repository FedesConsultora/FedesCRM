// src/shared/layouts/PrivateLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Loading from '../components/Loading';

export default function PrivateLayout({ children }) {
  const { user, logout, loading, organizations, activeOrgId, changeOrg } = useContext(AuthContext);

  return (
    <div className="private-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo192.png" alt="FedesCRM" />
          <h2>FedesCRM</h2>
        </div>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/leads">Leads</Link></li>
            <li><Link to="/propiedades">Propiedades</Link></li>
            <li><Link to="/mensajes">Mensajes</Link></li>
            <li><Link to="/agenda">Agenda</Link></li>
            <li><Link to="/automatizaciones">Automatizaciones</Link></li>
            <li><Link to="/usuarios">Usuarios</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1>Bienvenido, {user?.name || user?.nombre || 'Usuario'}</h1>
          </div>

          <div className="header-right" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {organizations?.length > 1 && (
              <select
                value={activeOrgId || ''}
                onChange={(e) => changeOrg(e.target.value)}
                className="org-switch-select"
                title="Cambiar organización"
              >
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>{o.name || o.nombre}</option>
                ))}
              </select>
            )}
            <button onClick={logout} className="logout-btn">Cerrar sesión</button>
          </div>
        </header>

        <main>
          {loading ? <Loading inline /> : (children || <Outlet />)}
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} FedesCRM - Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
}
