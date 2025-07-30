// src/modules/core/models/usuario.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: DataTypes.STRING,
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fechaAlta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_alta'
    },
    intentosFallidos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'intentos_fallidos'
    },
    bloqueadoHasta: {
      type: DataTypes.DATE,
      field: 'bloqueado_hasta'
    },
    ultimoLogin: {
      type: DataTypes.DATE,
      field: 'ultimo_login'
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      field: 'password_changed_at'
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'two_factor_enabled'
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'two_factor_secret'
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'avatar_url'
    },
    proveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    oauthId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'oauth_id'
    },
    organizacionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organizacion_id'
    },
    rolId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'rol_id'
    }
  }, {
    tableName: 'usuarios',
    paranoid: true,
    defaultScope: { attributes: { exclude: ['password'] } },
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
