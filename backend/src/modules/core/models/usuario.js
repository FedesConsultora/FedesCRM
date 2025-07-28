// src/modules/core/models/usuario.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    email: {
      type     : DataTypes.STRING,
      allowNull: false,
      unique   : true,
      validate : { isEmail: true }
    },
    password: {
      type     : DataTypes.STRING,
      allowNull: true // puede ser null si se usa login social
    },
    telefono: DataTypes.STRING,
    activo: {
      type        : DataTypes.BOOLEAN,
      defaultValue: false
    },
    fechaAlta: {
      type        : DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    intentosFallidos: {
      type        : DataTypes.INTEGER,
      defaultValue: 0
    },
    bloqueadoHasta: DataTypes.DATE,
    ultimoLogin: DataTypes.DATE,
    passwordChangedAt: DataTypes.DATE,
    twoFactorEnabled: {
      type        : DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorSecret: {
      type     : DataTypes.STRING,
      allowNull: true
    },
    avatarUrl: {
      type     : DataTypes.STRING,
      allowNull: true
    },
    proveedor: {
      type     : DataTypes.STRING,
      allowNull: true
    },
    oauthId: {
      type     : DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName    : 'usuarios',
    paranoid     : true,
    defaultScope : { attributes: { exclude: ['password'] } },
    hooks: {
      beforeCreate: async (u) => {
        if (u.password) u.password = await bcrypt.hash(u.password, 10);
      },
      beforeUpdate: async (u) => {
        if (u.changed('password') && u.password)
          u.password = await bcrypt.hash(u.password, 10);
      }
    }
  });

  // Métodos de instancia
  Usuario.prototype.validarPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  Usuario.prototype.generarToken = function () {
    return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, {
      expiresIn: '12h'
    });
  };


  return Usuario;
};
