// src/migrations/20250728202000-create-password-reset-tokens.cjs

'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('password_reset_tokens', {
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
    token: {
      type     : Sequelize.STRING,
      allowNull: false,
      unique   : true
    },
    expiracion: {
      type     : Sequelize.DATE,
      allowNull: false
    },
    usado: {
      type        : Sequelize.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type        : Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: Sequelize.DATE
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('password_reset_tokens');
}

module.exports = { up, down };
