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
    foreignKey: 'organizacionId',
    onDelete  : 'CASCADE'
  });

  Usuario.belongsTo(Organizacion, {
    foreignKey: 'organizacionId',
    onDelete  : 'CASCADE'
  });

  // ─────── ROL Y PERMISO ───────
  Rol.hasMany(Usuario, {
    foreignKey: 'rolId',
    as        : 'usuarios'
  });

  Usuario.belongsTo(Rol, {
    foreignKey: 'rolId',
    as        : 'rol'
  });

  Rol.belongsToMany(Permiso, {
    through   : RolPermiso,
    foreignKey: 'rolId',
    otherKey  : 'permisoId',
    onDelete  : 'CASCADE',
    uniqueKey : 'rol_permiso_unique'
  });

  Permiso.belongsToMany(Rol, {
    through   : RolPermiso,
    foreignKey: 'permisoId',
    otherKey  : 'rolId',
    onDelete  : 'CASCADE',
    uniqueKey : 'rol_permiso_unique'
  });

  // ─────── EMAIL VERIFICATION ───────
  Usuario.hasMany(EmailVerificationToken, {
    foreignKey: 'usuarioId',
    onDelete  : 'CASCADE'
  });

  EmailVerificationToken.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    onDelete  : 'CASCADE'
  });

  // ─────── PASSWORD RESET ───────
  Usuario.hasMany(PasswordResetToken, {
    foreignKey: 'usuarioId',
    onDelete  : 'CASCADE'
  });

  PasswordResetToken.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    onDelete  : 'CASCADE'
  });

  // ─────── AUDITORÍA ───────
  Usuario.hasMany(AuditLog, {
    foreignKey: 'usuarioId',
    onDelete  : 'CASCADE'
  });

  AuditLog.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    onDelete  : 'CASCADE'
  });
};
