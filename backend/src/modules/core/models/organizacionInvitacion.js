  export default (sequelize, DataTypes) => {
    const OrganizacionInvitacion = sequelize.define('OrganizacionInvitacion', {
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
      },
      rolId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'rol_id'
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
      estado: {
        type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada', 'expirada'),
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
      tableName: 'organization_invitations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

    return OrganizacionInvitacion;
  };
