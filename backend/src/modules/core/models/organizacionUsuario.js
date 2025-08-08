export default (sequelize, DataTypes) => {
  const OrganizacionUsuario = sequelize.define('OrganizacionUsuario', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organizacionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organizacion_id'
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'usuario_id'
    },
    rolId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'rol_id'
    },
    estado: {
      type: DataTypes.ENUM('activo', 'invitado', 'pendiente', 'suspendido'),
      defaultValue: 'pendiente'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'organization_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return OrganizacionUsuario;
};
