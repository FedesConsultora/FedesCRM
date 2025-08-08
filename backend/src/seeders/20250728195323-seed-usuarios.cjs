'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

async function up(queryInterface) {
  const [[{ id: orgId }]] = await queryInterface.sequelize.query(
    `SELECT id FROM organizaciones WHERE dominio = 'fedes.ai' LIMIT 1`
  );

  const [roles] = await queryInterface.sequelize.query(`SELECT id, nombre FROM roles`);
  const rolId = (nombre) => roles.find(r => r.nombre === nombre)?.id;

  const now = new Date();
  const hash = (plain) => bcrypt.hashSync(plain, 10);

  // Usuarios org (sin incluir 'rol' en el objeto que se inserta en usuarios)
  const usuariosOrgRaw = [
    { nombre: 'Enzo', apellido: 'Pinotti', email: 'admin@fedes.ai', password: hash('Admin123!'), rol: 'admin' },
    { nombre: 'Belén', apellido: 'García', email: 'gerente@fedes.ai', password: hash('Gerente123!'), rol: 'gerente' },
    { nombre: 'Matías', apellido: 'López', email: 'agente1@fedes.ai', password: hash('Agente123!'), rol: 'agente' }
  ];

  // Generamos IDs y armamos los objetos para usuarios
  const usuariosOrg = usuariosOrgRaw.map(u => ({
    id: crypto.randomUUID(),
    nombre: u.nombre,
    apellido: u.apellido,
    email: u.email,
    password: u.password,
    activo: true,
    fecha_alta: now,
    created_at: now,
    updated_at: now
  }));

  // Insertamos usuarios
  await queryInterface.bulkInsert('usuarios', usuariosOrg);

  // Ahora creamos los registros para organization_user usando el rol original
  const orgUsers = usuariosOrg.map((u, i) => ({
    id: crypto.randomUUID(),
    organizacion_id: orgId,
    usuario_id: u.id,
    rol_id: rolId(usuariosOrgRaw[i].rol),
    estado: 'activo',
    created_at: now,
    updated_at: now
  }));

  await queryInterface.bulkInsert('organization_user', orgUsers);

  // Usuario global (sin organización)
  const usuarioGlobal = {
    id: crypto.randomUUID(),
    nombre: 'Enzo Pinotti',
    apellido: 'AdminGlobal',
    email: 'globaladmin@fedes.ai',
    password: hash('Global123!'),
    activo: true,
    fecha_alta: now,
    created_at: now,
    updated_at: now
  };

  await queryInterface.bulkInsert('usuarios', [usuarioGlobal]);
}

async function down(queryInterface) {
  await queryInterface.bulkDelete('organization_user', null);
  await queryInterface.bulkDelete('usuarios', {
    email: ['admin@fedes.ai', 'gerente@fedes.ai', 'agente1@fedes.ai', 'globaladmin@fedes.ai']
  });
}

module.exports = { up, down };
