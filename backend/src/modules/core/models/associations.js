// src/modules/core/models/associations.js
export const applyCoreAssociations = (models) => {
  const {
    Usuario,
    Organizacion,
    Rol,
    RolPermiso,
    Permiso,
    EmailVerificationToken,
    PasswordResetToken,
    AuditLog
  } = models;

  // ─────── ORGANIZACIÓN ───────
  Organizacion.hasMany(Usuario, {
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  Usuario.belongsTo(Organizacion, {
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  // ─────── ROL Y PERMISO ───────
  Rol.hasMany(Usuario, {
    foreignKey: { name: 'rolId', field: 'rol_id' },
    as: 'usuarios'
  });

  Usuario.belongsTo(Rol, {
    foreignKey: { name: 'rolId', field: 'rol_id' },
    as: 'rol'
  });

  Rol.belongsToMany(Permiso, {
    through: RolPermiso,
    foreignKey: { name: 'rolId', field: 'rol_id' },
    otherKey: { name: 'permisoId', field: 'permiso_id' },
    onDelete: 'CASCADE',
    uniqueKey: 'rol_permiso_unique'
  });

  Permiso.belongsToMany(Rol, {
    through: RolPermiso,
    foreignKey: { name: 'permisoId', field: 'permiso_id' },
    otherKey: { name: 'rolId', field: 'rol_id' },
    onDelete: 'CASCADE',
    uniqueKey: 'rol_permiso_unique'
  });

  // ─────── EMAIL VERIFICATION ───────
  Usuario.hasMany(EmailVerificationToken, {
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  EmailVerificationToken.belongsTo(Usuario, {
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  // ─────── PASSWORD RESET ───────
  Usuario.hasMany(PasswordResetToken, {
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  PasswordResetToken.belongsTo(Usuario, {
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  // ─────── AUDITORÍA ───────
  Usuario.hasMany(AuditLog, {
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  AuditLog.belongsTo(Usuario, {
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });
};
