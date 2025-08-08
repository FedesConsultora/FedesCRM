// src/modules/core/models/passwordResetToken.js

export default (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'usuario_id'
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiracion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'password_reset_tokens',
    timestamps: true,
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
    paranoid: false           
  });

  return PasswordResetToken;
};
