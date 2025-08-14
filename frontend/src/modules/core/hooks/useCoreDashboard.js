import { useCallback, useMemo, useState } from 'react';
import {
  getUsuarios, getRoles, getPermisos, listMembers, getAuditLogs
} from '../../../api/core';

const isoDay = (d) => new Date(d).toISOString().slice(0,10);

function countFromPayload(payload) {
  if (!payload) return 0;
  if (typeof payload.total === 'number') return payload.total;
  if (typeof payload.count === 'number') return payload.count;
  if (Array.isArray(payload)) return payload.length;
  return 0;
}

/**
 * kpis.* = number | null
 *   - number: valor visible
 *   - null: sin permiso (403 o no se llama por falta de permiso)
 */
export default function useDashboardCore({
  orgId,
  canUsers,
  canRoles,
  canPermisos,
  canMembers,
  canSeeAudit,
}) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ usuarios: null, roles: null, permisos: null, pendientes: null });
  const [activity, setActivity] = useState([]);
  const [rangeDays] = useState(30);

  const fechaDesde = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - rangeDays);
    return isoDay(d);
  }, [rangeDays]);

  const reload = useCallback(async () => {
    if (!orgId) { setLoading(false); return; }

    setLoading(true);

    // armamos las tareas condicionalmente y recordamos la key
    const tasks = [];
    if (canUsers)    tasks.push({ key: 'usuarios',  p: getUsuarios(orgId) });
    if (canRoles)    tasks.push({ key: 'roles',     p: getRoles(orgId) });
    if (canPermisos) tasks.push({ key: 'permisos',  p: getPermisos(orgId) });
    if (canMembers)  tasks.push({ key: 'pendientes',p: listMembers(orgId, { estado: 'pendiente' }) });
    if (canSeeAudit) tasks.push({ key: 'audit',     p: getAuditLogs({ fechaDesde }) });

    // estado base: null si no hay permiso, 0 si hay permiso pero todavía no sabemos
    const base = {
      usuarios:  canUsers    ? 0 : null,
      roles:     canRoles    ? 0 : null,
      permisos:  canPermisos ? 0 : null,
      pendientes:canMembers  ? 0 : null,
    };

    try {
      const settled = await Promise.allSettled(tasks.map(t => t.p));
      const nextKpis = { ...base };
      let nextActivity = canSeeAudit ? [] : activity;

      settled.forEach((res, i) => {
        const key = tasks[i].key;

        if (key === 'audit') {
          if (res.status === 'fulfilled') {
            // normalizamos fechas
            nextActivity = (res.value || []).map((a, idx) => ({
              key: a.id ?? `${a.accion}-${idx}`,
              accion: a.accion ?? a.action ?? '—',
              usuario: a.usuario ?? a.user ?? '—',
              fecha: a.fecha ? new Date(a.fecha) : (a.createdAt ? new Date(a.createdAt) : new Date()),
            }));
          } else {
            // 403: tratar como “sin permiso” (UI oculta sección)
            const status = res.reason?.response?.status;
            if (status === 403) nextActivity = [];
            // otros errores: dejamos vacío pero no tiramos excepción
          }
          return;
        }

        // KPI keys
        if (res.status === 'fulfilled') {
          nextKpis[key] = countFromPayload(res.value);
        } else {
          const status = res.reason?.response?.status;
          if (status === 403) {
            // sin permiso realmente (backend lo confirma): mostramos null
            nextKpis[key] = null;
          } else {
            // error no-autorización (network, 5xx, etc.) => degradamos a 0
            nextKpis[key] = 0;
          }
        }
      });

      setKpis(nextKpis);
      if (canSeeAudit) setActivity(nextActivity);
    } finally {
      setLoading(false);
    }
  }, [orgId, canUsers, canRoles, canPermisos, canMembers, canSeeAudit, fechaDesde]); // deps correctas

  return { loading, kpis, activity, rangeDays, reload };
}
