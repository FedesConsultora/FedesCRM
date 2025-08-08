// src/modules/core/models/rol.js
export default (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
    nombre: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type     : DataTypes.STRING,
      allowNull: true
    },
    organizacion_id: { 
      type     : DataTypes.UUID,
      allowNull: true,
      field    : 'organizacion_id'
    }
  }, {
    tableName : 'roles',
    timestamps: true,
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
    paranoid  : true,
    indexes   : [
      {
        unique: true,
        fields: ['nombre', 'organizacion_id'] // ✅ Permite mismo nombre en distintas organizaciones
      }
    ]
  });

  return Rol;
};