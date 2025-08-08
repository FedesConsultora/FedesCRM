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
    AuditLog,
    OrganizacionUsuario,
    OrganizacionInvitacion
  } = models;

  /* ───────────────────────────── ORGANIZACIÓN ───────────────────────────── */
  Organizacion.hasMany(OrganizacionUsuario, {
    as: 'miembros',
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  OrganizacionUsuario.belongsTo(Organizacion, {
    as: 'organizacion',
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  Organizacion.hasMany(OrganizacionInvitacion, {
    as: 'invitaciones',
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  OrganizacionInvitacion.belongsTo(Organizacion, {
    as: 'organizacion',
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  /* ─────────────────────── USUARIO ↔ ORGANIZACIÓN ───────────────────────── */
  Usuario.hasMany(OrganizacionUsuario, {
    as: 'membresias',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  OrganizacionUsuario.belongsTo(Usuario, {
    as: 'usuario',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  /* ───────────────────────────── ROL Y PERMISO ──────────────────────────── */
  Rol.hasMany(OrganizacionUsuario, {
    as: 'miembros',
    foreignKey: { name: 'rolId', field: 'rol_id' }
  });

  OrganizacionUsuario.belongsTo(Rol, {
    as: 'rol',
    foreignKey: { name: 'rolId', field: 'rol_id' }
  });

  Rol.belongsTo(Organizacion, {
    as: 'organizacion',
    foreignKey: { name: 'organizacionId', field: 'organizacion_id' },
    onDelete: 'CASCADE'
  });

  Rol.belongsToMany(Permiso, {
    as: 'permisos',
    through: RolPermiso,
    foreignKey: { name: 'rolId', field: 'rol_id' },
    otherKey: { name: 'permisoId', field: 'permiso_id' },
    onDelete: 'CASCADE',
    uniqueKey: 'rol_permiso_unique'
  });

  Permiso.belongsToMany(Rol, {
    as: 'roles',
    through: RolPermiso,
    foreignKey: { name: 'permisoId', field: 'permiso_id' },
    otherKey: { name: 'rolId', field: 'rol_id' },
    onDelete: 'CASCADE',
    uniqueKey: 'rol_permiso_unique'
  });

  /* ─────────────────────── INVITACIONES Y ROLES ─────────────────────────── */
  OrganizacionInvitacion.belongsTo(Rol, {
    as: 'rol',
    foreignKey: { name: 'rolId', field: 'rol_id' },
    onDelete: 'SET NULL'
  });

  /* ─────────────────────── EMAIL VERIFICATION ───────────────────────────── */
  Usuario.hasMany(EmailVerificationToken, {
    as: 'emailTokens',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  EmailVerificationToken.belongsTo(Usuario, {
    as: 'usuario',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  /* ─────────────────────── PASSWORD RESET ───────────────────────────────── */
  Usuario.hasMany(PasswordResetToken, {
    as: 'passwordTokens',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  PasswordResetToken.belongsTo(Usuario, {
    as: 'usuario',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  /* ───────────────────────────── AUDITORÍA ─────────────────────────────── */
  Usuario.hasMany(AuditLog, {
    as: 'logs',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });

  AuditLog.belongsTo(Usuario, {
    as: 'usuario',
    foreignKey: { name: 'usuarioId', field: 'usuario_id' },
    onDelete: 'CASCADE'
  });
};
