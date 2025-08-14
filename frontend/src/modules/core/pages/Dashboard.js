import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../shared/context/AuthProvider';
import useToast from '../../../shared/hooks/useToast';
import useDashboardCore from '../hooks/useCoreDashboard';

function KpiCard({ title, value, hint, onClick }) {
  const clickable = typeof onClick === 'function' && value !== null;
  const display = value === null ? '—' : value;

  return (
    <div
      className={`kpi-card${clickable ? ' clickable' : ''}${value === null ? ' muted' : ''}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : 'presentation'}
      tabIndex={clickable ? 0 : -1}
      aria-label={title}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      }}
      title={value === null ? 'Sin permiso para ver este dato' : undefined}
    >
      <div className="kpi-title">{title}</div>
      <div className="kpi-value" aria-live="polite">{display}</div>
      {hint && <div className="kpi-hint">{hint}</div>}
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <section className="dash-section">
      <div className="dash-section-head">
        <h3>{title}</h3>
        {right}
      </div>
      <div className="dash-section-body">{children}</div>
    </section>
  );
}

const CHANNELS = [
  { key: 'whatsapp',  name: 'WhatsApp',  color: '#25D366', url: '/mensajes?canal=whatsapp'  },
  { key: 'instagram', name: 'Instagram', color: '#E4405F', url: '/mensajes?canal=instagram' },
  { key: 'facebook',  name: 'Facebook',  color: '#1877F2', url: '/mensajes?canal=facebook'  },
  { key: 'web',       name: 'Sitio Web', color: '#6C63FF', url: '/mensajes?canal=web'       },
];

// Cambiá a false si preferís mostrar tarjetas deshabilitadas en lugar de ocultarlas
const HIDE_DENIED_CARDS = true;

export default function DashboardPage() {
  const { activeOrgId, hasPermiso } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [channels] = useState(CHANNELS.map(c => ({ ...c, connected: false, count30d: 0 })));

  // Regla de permisos:
  // - admin global ve todo (admin.global o superadmin)
  // - si no, necesita permisos por organización
  const isAdminGlobal = useMemo(
    () => hasPermiso('admin.global') || hasPermiso('superadmin'),
    [hasPermiso]
  );

  const caps = useMemo(() => ({
    canUsers:    isAdminGlobal || hasPermiso('usuarios.ver'),
    canRoles:    isAdminGlobal || hasPermiso('roles.ver'),
    canPermisos: isAdminGlobal || hasPermiso('permisos.ver'),
    canMembers:  isAdminGlobal || hasPermiso('miembros.ver'),
    canAudit:    isAdminGlobal || hasPermiso('audit-logs.ver'),
  }), [isAdminGlobal, hasPermiso]);

  const { loading, kpis, activity, rangeDays, reload } = useDashboardCore({
    orgId: activeOrgId,
    canUsers: caps.canUsers,
    canRoles: caps.canRoles,
    canPermisos: caps.canPermisos,
    canMembers: caps.canMembers,
    canSeeAudit: caps.canAudit,
  });

  // Evitar loop: no pongas showToast en deps; usá ref
  const toastRef = useRef(showToast);
  useEffect(() => { toastRef.current = showToast; }, [showToast]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch {
        if (!cancelled) toastRef.current('No se pudieron cargar los datos del dashboard', 'error');
      }
    })();
    return () => { cancelled = true; };
  }, [reload]);

  const kpiCards = [
    { key: 'usuarios',  title: 'Usuarios',  value: kpis.usuarios,  onClick: () => navigate('/usuarios') },
    { key: 'roles',     title: 'Roles',     value: kpis.roles,     onClick: () => navigate('/usuarios?tab=roles') },
    { key: 'permisos',  title: 'Permisos',  value: kpis.permisos,  onClick: () => navigate('/usuarios?tab=roles') },
    { key: 'pendientes',title: 'Solicitudes pendientes', value: kpis.pendientes, hint: 'Aprobar/Rechazar en Usuarios', onClick: () => navigate('/usuarios?tab=solicitudes') },
  ];

  const visibleKpis = HIDE_DENIED_CARDS
    ? kpiCards.filter(c => c.value !== null)
    : kpiCards; // si querés verlas deshabilitadas, poné HIDE_DENIED_CARDS=false

  return (
    <div className="dashboard-page">
      <div className="dash-header">
        <div className="welcome">
          <h2>Resumen</h2>
          <p className="muted">Indicadores del módulo Core</p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={reload} disabled={loading}>
            {loading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
      </div>

      <div className={`kpi-grid${loading ? ' loading' : ''}`}>
        {visibleKpis.length === 0
          ? <div className="empty muted">No hay indicadores visibles para tu rol en esta organización.</div>
          : visibleKpis.map(c => (
              <KpiCard
                key={c.key}
                title={c.title}
                value={c.value}
                hint={c.hint}
                onClick={c.value !== null ? c.onClick : undefined}
              />
            ))
        }
      </div>

      <Section title="Canales" right={<span className="muted">Conecta tus canales para centralizar tus mensajes</span>}>
        <div className="channels-panel">
          <div className="channels-sparkline">
            {Array.from({ length: 10 }).map((_, i) => (
              <div className="spark" key={i} style={{ height: `${30 + (i % 5) * 10}px` }} />
            ))}
          </div>

          <div className="channels-strip">
            {channels.map(ch => (
              <button
                key={ch.key}
                className={`channel ${ch.connected ? 'connected' : 'disconnected'}`}
                onClick={() => navigate(ch.url)}
                title={ch.connected ? 'Ir al inbox' : 'Conectar canal'}
                style={{ '--ch': ch.color }}
              >
                <div className="channel-avatar" aria-hidden />
                <div className="channel-name">{ch.name}</div>
                <div className="channel-status">
                  <span className="dot" />
                  {ch.connected ? 'Conectado' : 'Conectar'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {caps.canAudit && (
        <Section title={`Actividad de los últimos ${rangeDays} días`} right={<span className="muted">Fuente: Audit Logs</span>}>
          {activity.length === 0 ? (
            <div className="empty">Sin actividad registrada.</div>
          ) : (
            <ul className="activity-list">
              {activity.map(a => (
                <li key={a.key}>
                  <div className="act-accion">{a.accion}</div>
                  <div className="act-user">{a.usuario}</div>
                  <div className="act-date" title={a.fecha.toISOString()}>
                    {a.fecha.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}
    </div>
  );
}
