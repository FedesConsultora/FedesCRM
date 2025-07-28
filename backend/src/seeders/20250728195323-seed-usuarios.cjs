// src/seeders/20250728204400-seed-usuarios.cjs

'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Seeder} */
async function up(queryInterface) {
  // Buscar organización y roles
  const [[{ id: orgId }]] = await queryInterface.sequelize.query(
    `SELECT id FROM organizaciones WHERE dominio = 'fedes.ai' LIMIT 1`
  );

  const [roles] = await queryInterface.sequelize.query(`SELECT id, nombre FROM roles`);
  const rolId = (nombre) => roles.find(r => r.nombre === nombre)?.id;

  const now = new Date();
  const hash = (plain) => bcrypt.hashSync(plain, 10);

  await queryInterface.bulkInsert('usuarios', [
    {
      id              : crypto.randomUUID(),
      nombre          : 'Enzo',
      apellido        : 'Pinotti',
      email           : 'admin@fedes.ai',
      password        : hash('Admin123!'),
      activo          : true,
      organizacion_id : orgId,
      rol_id          : rolId('admin'),
      fecha_alta      : now,
      created_at      : now
    },
    {
      id              : crypto.randomUUID(),
      nombre          : 'Belén',
      apellido        : 'García',
      email           : 'gerente@fedes.ai',
      password        : hash('Gerente123!'),
      activo          : true,
      organizacion_id : orgId,
      rol_id          : rolId('gerente'),
      fecha_alta      : now,
      created_at      : now
    },
    {
      id              : crypto.randomUUID(),
      nombre          : 'Matías',
      apellido        : 'López',
      email           : 'agente1@fedes.ai',
      password        : hash('Agente123!'),
      activo          : true,
      organizacion_id : orgId,
      rol_id          : rolId('agente'),
      fecha_alta      : now,
      created_at      : now
    }
  ]);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('usuarios', {
    email: ['admin@fedes.ai', 'gerente@fedes.ai', 'agente1@fedes.ai']
  });
}

module.exports = { up, down };
