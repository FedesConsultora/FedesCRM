// src/seeders/20250728204000-seed-organizaciones.cjs

'use strict';

const crypto = require('crypto');

/** @type {import('sequelize-cli').Seeder} */
async function up(queryInterface) {
  await queryInterface.bulkInsert('organizaciones', [{
    id        : crypto.randomUUID(),
    nombre    : 'Fedes Consultora',
    dominio   : 'fedes.ai',
    logo_url  : null,
    activo    : true,
    created_at: new Date()
  }]);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('organizaciones', { dominio: 'fedes.ai' });
}

module.exports = { up, down };
