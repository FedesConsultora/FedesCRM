// src/migrations/20250728194000-create-roles.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles', {
    id: {
      type        : Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey  : true
    },
    nombre: {
      type     : Sequelize.STRING,
      allowNull: false,
      unique   : true
    },
    descripcion: {
      type     : Sequelize.STRING,
      allowNull: true
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
  await queryInterface.dropTable('roles');
}

module.exports = { up, down };
