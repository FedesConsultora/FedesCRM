'use strict';

/** @type {import('sequelize-cli').Seeder} */
async function up(queryInterface) {
  const [roles]    = await queryInterface.sequelize.query('SELECT id, nombre FROM roles');
  const [permisos] = await queryInterface.sequelize.query('SELECT id, nombre FROM permisos');

  const roleId = (name) => roles.find(r => r.nombre === name)?.id;
  const permId = (name) => permisos.find(p => p.nombre === name)?.id;
  const now    = new Date();

  // Admin → todos los permisos
  const allPerms = permisos.map(p => ({
    rol_id     : roleId('admin'),
    permiso_id : p.id,
    asignado_en: now
  }));

  // Gerente
  const gerentePerms = [
    'dashboard.ver','leads.*','propiedades.*','mensajes.ver','agenda.*',
    'reportes.exportar','usuarios.ver','audit-logs.ver'
  ].flatMap(mask =>
    mask.endsWith('*')
      ? permisos.filter(p => p.nombre.startsWith(mask.replace('.*', ''))).map(p => p.id)
      : [permId(mask)]
  ).map(pid => ({
    rol_id     : roleId('gerente'),
    permiso_id : pid,
    asignado_en: now
  }));

  // Agente
  const agentePerms = [
    'leads.ver','leads.crear','leads.editar',
    'propiedades.ver',
    'mensajes.ver','mensajes.enviar',
    'agenda.ver','agenda.crear','agenda.editar'
  ].map(name => ({
    rol_id     : roleId('agente'),
    permiso_id : permId(name),
    asignado_en: now
  }));

  // Marketing
  const marketingPerms = [
    'dashboard.ver',
    'automatizaciones.*',
    'mensajes.ver','mensajes.enviar',
    'leads.ver','propiedades.ver',
    'reportes.exportar'
  ].flatMap(mask =>
    mask.endsWith('*')
      ? permisos.filter(p => p.nombre.startsWith(mask.replace('.*', ''))).map(p => p.id)
      : [permId(mask)]
  ).map(pid => ({
    rol_id     : roleId('marketing'),
    permiso_id : pid,
    asignado_en: now
  }));

  // Soporte
  const soportePerms = [
    'audit-logs.ver','canales.gestionar','settings.gestionar'
  ].map(name => ({
    rol_id     : roleId('soporte'),
    permiso_id : permId(name),
    asignado_en: now
  }));

  await queryInterface.bulkInsert('roles_permisos', [
    ...allPerms,
    ...gerentePerms,
    ...agentePerms,
    ...marketingPerms,
    ...soportePerms
  ]);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('roles_permisos', null);
}

module.exports = { up, down };
