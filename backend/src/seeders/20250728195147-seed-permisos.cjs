// src/seeders/20250728204200-seed-permisos.cjs

'use strict';

const crypto = require('crypto');

const permisos = [
  // Dashboard & Config
  'dashboard.ver', 'settings.gestionar',
  // Usuarios / Roles
  'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar',
  'roles.ver', 'roles.crear', 'roles.editar', 'roles.eliminar',
  // Leads
  'leads.ver', 'leads.crear', 'leads.editar', 'leads.eliminar',
  // Propiedades
  'propiedades.ver', 'propiedades.crear', 'propiedades.editar', 'propiedades.eliminar',
  // Mensajería
  'mensajes.ver', 'mensajes.enviar',
  // Agenda
  'agenda.ver', 'agenda.crear', 'agenda.editar', 'agenda.eliminar',
  // Automatizaciones
  'automatizaciones.ver', 'automatizaciones.crear', 'automatizaciones.editar', 'automatizaciones.eliminar'
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
