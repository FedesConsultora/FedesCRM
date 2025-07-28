// src/migrations/20250728200000-create-roles-permisos.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles_permisos', {
    rol_id: {
      type      : Sequelize.UUID,
      allowNull : false,
      primaryKey: true,
      references: {
        model: 'roles',
        key  : 'id'
      },
      onDelete: 'CASCADE'
    },
    permiso_id: {
      type      : Sequelize.UUID,
      allowNull : false,
      primaryKey: true,
      references: {
        model: 'permisos',
        key  : 'id'
      },
      onDelete: 'CASCADE'
    },
    asignado_en: {
      type        : Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('roles_permisos');
}

module.exports = { up, down };
