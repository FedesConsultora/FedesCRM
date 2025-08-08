'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('organizaciones', 'website', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('organizaciones', 'sector', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('organizaciones', 'consultas_mes', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('organizaciones', 'problemas', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('organizaciones', 'website');
    await queryInterface.removeColumn('organizaciones', 'sector');
    await queryInterface.removeColumn('organizaciones', 'consultas_mes');
    await queryInterface.removeColumn('organizaciones', 'problemas');
  }
};