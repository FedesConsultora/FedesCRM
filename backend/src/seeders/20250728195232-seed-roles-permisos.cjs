'use strict';

/** @type {import('sequelize-cli').Seeder} */
async function up(queryInterface) {
  const [roles] = await queryInterface.sequelize.query('SELECT id, nombre FROM roles');
  const [permisos] = await queryInterface.sequelize.query('SELECT id, nombre FROM permisos');

  const roleId = (name) => roles.find(r => r.nombre === name)?.id;
  const permId = (name) => permisos.find(p => p.nombre === name)?.id;
  const now = new Date();

  const allPerms = permisos.map(p => ({
    permiso_id: p.id,
    asignado_en: now
  }));

  const asignaciones = [];

  // Admin org → todos los permisos
  allPerms.forEach(p => asignaciones.push({ rol_id: roleId('admin'), ...p }));

  // Superadmin global → todos los permisos
  allPerms.forEach(p => asignaciones.push({ rol_id: roleId('superadmin_global'), ...p }));

  // Gerente
  const gerentePerms = [
    'dashboard.ver', 'leads.*', 'propiedades.*', 'mensajes.ver', 'agenda.*',
    'reportes.exportar', 'usuarios.ver', 'audit-logs.ver'
  ];
  gerentePerms.flatMap(mask =>
    mask.endsWith('*')
      ? permisos.filter(p => p.nombre.startsWith(mask.replace('.*', ''))).map(p => p.id)
      : [permId(mask)]
  ).forEach(pid => asignaciones.push({ rol_id: roleId('gerente'), permiso_id: pid, asignado_en: now }));

  // Agente
  ['leads.ver', 'leads.crear', 'leads.editar', 'propiedades.ver', 'mensajes.ver', 'mensajes.enviar', 'agenda.ver', 'agenda.crear', 'agenda.editar']
    .forEach(name => asignaciones.push({ rol_id: roleId('agente'), permiso_id: permId(name), asignado_en: now }));

  // Marketing
  const marketingPerms = ['dashboard.ver', 'automatizaciones.*', 'mensajes.ver', 'mensajes.enviar', 'leads.ver', 'propiedades.ver', 'reportes.exportar'];
  marketingPerms.flatMap(mask =>
    mask.endsWith('*')
      ? permisos.filter(p => p.nombre.startsWith(mask.replace('.*', ''))).map(p => p.id)
      : [permId(mask)]
  ).forEach(pid => asignaciones.push({ rol_id: roleId('marketing'), permiso_id: pid, asignado_en: now }));

  // Soporte
  ['audit-logs.ver', 'canales.gestionar', 'settings.gestionar']
    .forEach(name => asignaciones.push({ rol_id: roleId('soporte'), permiso_id: permId(name), asignado_en: now }));

  await queryInterface.bulkInsert('roles_permisos', asignaciones);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('roles_permisos', null);
}

module.exports = { up, down };
