// src/migrations/20250728203000-create-audit-logs.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('audit_logs', {
    id: {
      type        : Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey  : true
    },
    usuario_id: {
      type     : Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'usuarios',
        key  : 'id'
      },
      onDelete: 'CASCADE'
    },
    accion: {
      type     : Sequelize.STRING,
      allowNull: false
    },
    descripcion: {
      type     : Sequelize.TEXT,
      allowNull: true
    },
    ip: {
      type     : Sequelize.STRING,
      allowNull: true
    },
    user_agent: {
      type     : Sequelize.STRING,
      allowNull: true
    },
    created_at: {
      type        : Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: Sequelize.DATE
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('audit_logs');
}

module.exports = { up, down };
