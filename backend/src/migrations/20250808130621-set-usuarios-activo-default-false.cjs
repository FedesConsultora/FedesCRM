/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Backfill: solo NULL -> false (no desactiva los que ya están en true)
    await queryInterface.sequelize.query(`
      UPDATE "usuarios"
      SET "activo" = false
      WHERE "activo" IS NULL
    `);

    // 2) Cambiar default y NOT NULL a nivel DB
    await queryInterface.changeColumn('usuarios', 'activo', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Opción A (segura): volver a permitir NULL y sin default
    await queryInterface.changeColumn('usuarios', 'activo', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    });

    // Si antes tu DB tenía default true y querés restaurarlo,
    // usá esto en vez de lo de arriba:
    // await queryInterface.changeColumn('usuarios', 'activo', {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: true,
    // });
  },
};

