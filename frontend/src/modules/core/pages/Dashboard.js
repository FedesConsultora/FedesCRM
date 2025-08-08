import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../shared/context/AuthProvider';
import useToast from '../../../shared/hooks/useToast';
import { getUsuarios } from '../../../api/core';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalLeads: 0,
    totalPropiedades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usuarios = await getUsuarios();
        setStats((prev) => ({ ...prev, totalUsuarios: usuarios.data.data.length }));
      } catch {
        showToast('Error al cargar estadísticas', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <p>Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong></p>

      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Usuarios</h3>
            <p>{stats.totalUsuarios}</p>
          </div>
          <div className="stat-card">
            <h3>Leads</h3>
            <p>{stats.totalLeads}</p>
          </div>
          <div className="stat-card">
            <h3>Propiedades</h3>
            <p>{stats.totalPropiedades}</p>
          </div>
        </div>
      )}
    </div>
  );
}
