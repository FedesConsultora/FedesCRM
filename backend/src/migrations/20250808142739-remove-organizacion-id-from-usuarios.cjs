'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'organizacion_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'organizacion_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'organizaciones',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  }
};
