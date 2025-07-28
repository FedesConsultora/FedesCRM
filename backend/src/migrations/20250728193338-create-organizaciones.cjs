// src/migrations/20250728192000-create-organizaciones.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('organizaciones', {
    id: {
      type        : Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey  : true
    },
    nombre: {
      type     : Sequelize.STRING,
      allowNull: false
    },
    dominio: {
      type     : Sequelize.STRING,
      allowNull: false,
      unique   : true
    },
    logo_url: {
      type     : Sequelize.STRING,
      allowNull: true
    },
    activo: {
      type        : Sequelize.BOOLEAN,
      defaultValue: true
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
  await queryInterface.dropTable('organizaciones');
}

module.exports = { up, down };
