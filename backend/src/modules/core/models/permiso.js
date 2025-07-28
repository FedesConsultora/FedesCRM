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
    paranoid : true
  });


  return Permiso;
};
