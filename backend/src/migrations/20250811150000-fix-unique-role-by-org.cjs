// src/migrations/20250811150000-fix-unique-role-by-org.cjs

'use strict';

module.exports = {
  async up(queryInterface) {
    // 1. Eliminar la constraint única global actual
    await queryInterface.removeConstraint('roles', 'roles_nombre_key');

    // 2. Crear constraint única compuesta
    await queryInterface.addConstraint('roles', {
      fields: ['nombre', 'organizacion_id'],
      type: 'unique',
      name: 'roles_nombre_organizacion_unique'
    });
  },

  async down(queryInterface) {
    // Revertir: eliminar la constraint compuesta y volver a la global
    await queryInterface.removeConstraint('roles', 'roles_nombre_organizacion_unique');

    await queryInterface.addConstraint('roles', {
      fields: ['nombre'],
      type: 'unique',
      name: 'roles_nombre_key'
    });
  }
};
