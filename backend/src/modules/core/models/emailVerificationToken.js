// src/migrations/20250728201000-create-email-verification-tokens.cjs

'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('email_verification_tokens', {
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

export async function down(queryInterface) {
  await queryInterface.dropTable('email_verification_tokens');
}
