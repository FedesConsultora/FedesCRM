'use strict';

const crypto = require('crypto');

const permisos = [
  // Core
  'dashboard.ver', 'settings.gestionar', 'audit-logs.ver',
  'usuarios.ver','usuarios.crear','usuarios.editar','usuarios.eliminar',
  'roles.ver','roles.crear','roles.editar','roles.eliminar',
  'permisos.ver',

  // Leads
  'leads.ver','leads.crear','leads.editar','leads.eliminar',
  'leads.importar','leads.asignar','leads.exportar',

  // Propiedades
  'propiedades.ver','propiedades.crear','propiedades.editar','propiedades.eliminar',
  'propiedades.subir-foto','propiedades.subir-doc',

  // Mensajería
  'mensajes.ver','mensajes.enviar','mensajes.cerrar-conversacion',
  'canales.gestionar',

  // Agenda
  'agenda.ver','agenda.crear','agenda.editar','agenda.eliminar','agenda.sync',

  // Automatizaciones
  'automatizaciones.ver','automatizaciones.crear',
  'automatizaciones.editar','automatizaciones.eliminar',
  'automatizaciones.ejecutar',

  // Reportes
  'reportes.exportar'
];

/** @type {import('sequelize-cli').Seeder} */
async function up(queryInterface) {
  await queryInterface.bulkInsert('permisos',
    permisos.map(p => ({
      id         : crypto.randomUUID(),
      nombre     : p,
      descripcion: p.replace('.', ' - ').toUpperCase(),
      created_at : new Date()
    }))
  );
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('permisos', null);
}

module.exports = { up, down };
