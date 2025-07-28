// src/modules/core/models/rol.js

export default (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
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
    tableName: 'roles',
    paranoid : true
  });



  return Rol;
};
