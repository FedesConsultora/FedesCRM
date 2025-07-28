// src/modules/core/models/organizacion.js
export default (sequelize, DataTypes) => {
  const Organizacion = sequelize.define('Organizacion', {
    nombre: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    dominio: {
      type     : DataTypes.STRING,
      allowNull: false,
      unique   : true,
      validate : { isEmail: false } 
    },
    logoUrl: {
      type     : DataTypes.STRING,
      allowNull: true
    },
    activo: {
      type        : DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'organizaciones',
    paranoid : true,
    timestamps: true
  });


  return Organizacion;
};
