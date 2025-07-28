// src/migrations/20250728195000-create-permisos.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('permisos', {
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
  await queryInterface.dropTable('permisos');
}

module.exports = { up, down };
