// src/migrations/20250728193000-create-usuarios.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('usuarios', {
    id: {
      type        : Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey  : true
    },
    nombre: {
      type     : Sequelize.STRING,
      allowNull: false
    },
    apellido: {
      type     : Sequelize.STRING,
      allowNull: false
    },
    email: {
      type     : Sequelize.STRING,
      allowNull: false,
      unique   : true
    },
    password: {
      type     : Sequelize.STRING,
      allowNull: true
    },
    telefono: Sequelize.STRING,
    activo: {
      type        : Sequelize.BOOLEAN,
      defaultValue: false
    },
    fecha_alta: {
      type        : Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    intentos_fallidos: {
      type        : Sequelize.INTEGER,
      defaultValue: 0
    },
    bloqueado_hasta: Sequelize.DATE,
    ultimo_login: Sequelize.DATE,
    password_changed_at: Sequelize.DATE,
    two_factor_enabled: {
      type        : Sequelize.BOOLEAN,
      defaultValue: false
    },
    two_factor_secret: Sequelize.STRING,
    avatar_url: Sequelize.STRING,
    proveedor: Sequelize.STRING,
    oauth_id: Sequelize.STRING,

    organizacion_id: {
      type     : Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'organizaciones',
        key  : 'id'
      },
      onDelete: 'CASCADE'
    },

    rol_id: {
      type     : Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'roles',
        key  : 'id'
      },
      onDelete: 'SET NULL'
    },

    created_at: {
      type        : Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: Sequelize.DATE,
    deleted_at: Sequelize.DATE
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('usuarios');
}

module.exports = { up, down };
