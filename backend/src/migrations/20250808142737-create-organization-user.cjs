'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization_user', {
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
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      estado: {
        type: Sequelize.ENUM('activo', 'invitado', 'pendiente', 'suspendido'),
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

    await queryInterface.addConstraint('organization_user', {
      fields: ['organizacion_id', 'usuario_id'],
      type: 'unique',
      name: 'uq_organization_user'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('organization_user');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_organization_user_estado";');
  }
};
