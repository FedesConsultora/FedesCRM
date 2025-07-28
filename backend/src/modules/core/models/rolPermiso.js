// src/modules/core/models/rolPermiso.js

export default (sequelize, DataTypes) => {
  const RolPermiso = sequelize.define('RolPermiso', {
    rolId: {
      type      : DataTypes.UUID,
      allowNull : false,
      primaryKey: true
    },
    permisoId: {
      type      : DataTypes.UUID,
      allowNull : false,
      primaryKey: true
    },
    asignadoEn: {
      type        : DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'roles_permisos',
    timestamps: false
  });

  return RolPermiso;
};
