// src/modules/core/models/permiso.js
export default (sequelize, DataTypes) => {
  const Permiso = sequelize.define('Permiso', {
    nombre: {
      type     : DataTypes.STRING,
      allowNull: false,
      unique   : true
    },
    descripcion: {
      type     : DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'permisos',
    timestamps: true,        
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid : true
  });

  return Permiso;
};
