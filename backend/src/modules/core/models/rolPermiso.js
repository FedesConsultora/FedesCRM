// src/modules/core/models/rolPermiso.js
export default (sequelize, DataTypes) => {
  const RolPermiso = sequelize.define('RolPermiso', {
    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'rol_id' // ✅ Mapeo a snake_case
    },
    permisoId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'permiso_id' // ✅ Mapeo a snake_case
    },
    asignadoEn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'asignado_en' 
    }
  }, {
    tableName: 'roles_permisos',
    timestamps: false 
  });

  return RolPermiso;
};
