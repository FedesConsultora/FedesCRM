'use strict';

const crypto = require('crypto');

async function up(queryInterface) {
  const [[{ id: orgId }]] = await queryInterface.sequelize.query(
    `SELECT id FROM organizaciones WHERE dominio = 'fedes.ai' LIMIT 1`
  );

  // Roles por organización
  const rolesOrg = [
    { nombre: 'admin', descripcion: 'Súper administrador', organizacion_id: orgId },
    { nombre: 'gerente', descripcion: 'Gerente comercial', organizacion_id: orgId },
    { nombre: 'agente', descripcion: 'Agente inmobiliario', organizacion_id: orgId },
    { nombre: 'marketing', descripcion: 'Mkt & Automatización', organizacion_id: orgId },
    { nombre: 'soporte', descripcion: 'Soporte técnico', organizacion_id: orgId }
  ].map(r => ({
    id: crypto.randomUUID(),
    ...r,
    created_at: new Date()
  }));

  // Roles globales
  const rolesGlobal = [
    { nombre: 'superadmin_global', descripcion: 'Admin global del sistema', organizacion_id: null }
  ].map(r => ({
    id: crypto.randomUUID(),
    ...r,
    created_at: new Date()
  }));

  await queryInterface.bulkInsert('roles', [...rolesOrg, ...rolesGlobal]);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('roles', null);
}

module.exports = { up, down };
