import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaDatabase, FaHome, FaEnvelope, FaCalendarAlt,
  FaBolt, FaUsers, FaBars, FaAngleDoubleLeft
} from 'react-icons/fa';
import Logo from './Logo';
import useModal from '../hooks/useModal';

const MENU = [
  { key: 'dashboard', label: 'Dashboard',        to: '/dashboard',        icon: FaTachometerAlt, implemented: true  },
  { key: 'leads',     label: 'Leads',            to: '/leads',            icon: FaDatabase,      implemented: false },
  { key: 'props',     label: 'Propiedades',      to: '/propiedades',      icon: FaHome,          implemented: false },
  { key: 'msg',       label: 'Mensajes',         to: '/mensajes',         icon: FaEnvelope,      implemented: false },
  { key: 'agenda',    label: 'Agenda',           to: '/agenda',           icon: FaCalendarAlt,   implemented: false },
  { key: 'auto',      label: 'Automatizaciones', to: '/automatizaciones', icon: FaBolt,          implemented: false },
  { key: 'users',     label: 'Usuarios',         to: '/usuarios',         icon: FaUsers,         implemented: true  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { showModal } = useModal();

  const onClickSoon = (label) =>
    showModal({
      type: 'info',
      title: 'Funcionalidad en desarrollo',
      message: `“${label}” todavía no está disponible en tu versión. Muy pronto lo activamos ✨`
    });

  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      aria-label="Barra lateral de navegación"
      aria-expanded={!collapsed}
    >
      <div className="sidebar-top">
        <Logo showIcon showText={false} horizontal />
      </div>

      <nav className="sidebar-nav" role="navigation">
        {MENU.map(({ key, label, to, icon: Icon, implemented }) =>
          implemented ? (
            <NavLink
              key={key}
              to={to}
              className={({ isActive }) => `side-item${isActive ? ' active' : ''}`}
              title={label}
            >
              <span className="side-icon" aria-hidden><Icon size={18} /></span>
              <span className="side-label">{label}</span>
            </NavLink>
          ) : (
            <button
              key={key}
              type="button"
              className="side-item disabled"
              onClick={() => onClickSoon(label)}
              title={`${label} (en desarrollo)`}
            >
              <span className="side-icon" aria-hidden><Icon size={18} /></span>
              <span className="side-label">{label}</span>
            </button>
          )
        )}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="collapse-btn"
          onClick={onToggle}
          title={collapsed ? 'Expandir' : 'Colapsar'}
          aria-pressed={collapsed}
        >
          {collapsed ? <FaBars /> : <FaAngleDoubleLeft />}
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
};
