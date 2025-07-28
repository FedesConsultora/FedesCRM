// src/modules/core/models/auditLog.js

export default (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type      : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    usuarioId: {
      type     : DataTypes.UUID,
      allowNull: false
    },
    accion: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type     : DataTypes.TEXT,
      allowNull: true
    },
    ip: {
      type     : DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type     : DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true
  });



  return AuditLog;
};
