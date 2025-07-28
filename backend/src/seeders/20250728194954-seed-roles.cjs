// src/seeders/20250728204100-seed-roles.cjs

'use strict';

const crypto = require('crypto');

/** @type {import('sequelize-cli').Seeder} */
async function up(queryInterface) {
  await queryInterface.bulkInsert('roles', [
    {
      id         : crypto.randomUUID(),
      nombre     : 'admin',
      descripcion: 'Súper administrador',
      created_at : new Date()
    },
    {
      id         : crypto.randomUUID(),
      nombre     : 'gerente',
      descripcion: 'Gerente comercial',
      created_at : new Date()
    },
    {
      id         : crypto.randomUUID(),
      nombre     : 'agente',
      descripcion: 'Agente inmobiliario',
      created_at : new Date()
    },
    {
      id         : crypto.randomUUID(),
      nombre     : 'marketing',
      descripcion: 'Mkt & Automatización',
      created_at : new Date()
    }
  ]);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('roles', {
    nombre: ['admin', 'gerente', 'agente', 'marketing']
  });
}

module.exports = { up, down };
