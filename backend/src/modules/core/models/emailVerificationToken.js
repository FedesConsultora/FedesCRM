export default (sequelize, DataTypes) => {
  const EmailVerificationToken = sequelize.define('EmailVerificationToken', {
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
    tableName: 'email_verification_tokens',
    paranoid: false,
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
  });

  return EmailVerificationToken;
};
