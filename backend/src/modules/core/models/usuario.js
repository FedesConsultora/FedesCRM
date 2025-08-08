import bcrypt from 'bcrypt';

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
      allowNull: false,
      defaultValue: false
    },
    fecha_alta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_alta'
    },
    intentos_fallido: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'intentos_fallidos'
    },
    bloqueado_hasta: {
      type: DataTypes.DATE,
      field: 'bloqueado_hasta'
    },
    ultimo_login: {
      type: DataTypes.DATE,
      field: 'ultimo_login'
    },
    password_changed_at: {
      type: DataTypes.DATE,
      field: 'password_changed_at'
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'two_factor_enabled'
    },
    two_factor_secret: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'two_factor_secret'
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'avatar_url'
    },
    proveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    oauth_id: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'oauth_id'
    },
    organizacion_id: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'organizacion_id'
    },
    rol_id: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'rol_id'
    }
  }, {
    tableName: 'usuarios',
    paranoid: true,
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
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
