'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'organizacion_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'organizaciones',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roles', 'organizacion_id');
  }
};
