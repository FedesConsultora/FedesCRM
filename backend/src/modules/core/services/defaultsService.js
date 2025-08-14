// src/modules/core/services/defaultsService.js
import { Rol, RolPermiso, Permiso } from '../models/index.js';

export const createDefaultRolesForOrg = async (orgId) => {
  const roles = [
    { nombre: 'admin',    descripcion: 'Súper Administrador' },
    { nombre: 'gerente',  descripcion: 'Gerente comercial' },
    { nombre: 'agente',   descripcion: 'Agente inmobiliario' },
    { nombre: 'marketing',descripcion: 'Mkt & Automatización' }
  ];

  const creados = [];
  for (const r of roles) {
    const [role] = await Rol.findOrCreate({
      where: { organizacion_id: orgId, nombre: r.nombre },
      defaults: { ...r, organizacion_id: orgId }
    });
    creados.push(role);
  }

  // admin → todos los permisos
  const perms = await Permiso.findAll();
  const admin = creados.find(r => r.nombre === 'admin');
  await RolPermiso.bulkCreate(
    perms.map(p => ({ rol_id: admin.id, permiso_id: p.id })),
    { ignoreDuplicates: true }
  );

  return creados;
};
