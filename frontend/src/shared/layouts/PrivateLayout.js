import { Outlet } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';

const LS_KEY = 'sidebar:collapsed';

export default function PrivateLayout({ children }) {
  const { user, logout, loading, organizations, activeOrgId, changeOrg } = useContext(AuthContext);

  const mq = useMemo(() => window.matchMedia('(max-width: 1024px)'), []);
  const [collapsed, setCollapsed] = useState(() => {
    const pref = localStorage.getItem(LS_KEY);
    if (pref === 'true' || pref === 'false') return pref === 'true';
    return mq.matches;
  });

  useEffect(() => {
    const onChange = (e) => {
      if (e.matches) setCollapsed(true);
      else {
        const pref = localStorage.getItem(LS_KEY);
        setCollapsed(pref === 'true' ? true : pref === 'false' ? false : false);
      }
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [mq]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(LS_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="private-layout" style={{ ['--sidebar-w']: collapsed ? '76px' : '260px' }}>
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      <div className="main-area">
        <AppHeader
          user={user}
          organizations={organizations}
          activeOrgId={activeOrgId}
          onChangeOrg={changeOrg}
          onLogout={logout}
        />

        <main className="app-main">
          {loading ? <Loading inline /> : (children || <Outlet />)}
        </main>

        <footer className="app-footer">© {new Date().getFullYear()} FedesCRM</footer>
      </div>
    </div>
  );
}
