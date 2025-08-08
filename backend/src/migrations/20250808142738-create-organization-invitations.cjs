'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization_invitations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      organizacion_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizaciones',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      expiracion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aceptada', 'rechazada', 'expirada'),
        defaultValue: 'pendiente'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('organization_invitations', ['email']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('organization_invitations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_organization_invitations_estado";');
  }
};
