// src/modules/core/models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

import organizacion from './organizacion.js';
import usuarioModel from './usuario.js';
import rolModel from './rol.js';
import permisoModel from './permiso.js';
import rolPermisoModel from './rolPermiso.js';
import auditLogModel from './auditLog.js';
import emailVerificationTokenModel from './emailVerificationToken.js';
import passwordResetTokenModel from './passwordResetToken.js';
import organizacionUsuarioModel from './organizacionUsuario.js';
import organizacionInvitacionModel from './organizacionInvitacion.js';
import { applyCoreAssociations } from './associations.js';

// Inicialización de modelos
const Organizacion = organizacion(sequelize, DataTypes);
const Usuario = usuarioModel(sequelize, DataTypes);
const Rol = rolModel(sequelize, DataTypes);
const Permiso = permisoModel(sequelize, DataTypes);
const RolPermiso = rolPermisoModel(sequelize, DataTypes);
const AuditLog = auditLogModel(sequelize, DataTypes);
const EmailVerificationToken = emailVerificationTokenModel(sequelize, DataTypes);
const PasswordResetToken = passwordResetTokenModel(sequelize, DataTypes);
const OrganizacionUsuario = organizacionUsuarioModel(sequelize, DataTypes);
const OrganizacionInvitacion = organizacionInvitacionModel(sequelize, DataTypes);

// Asociaciones
applyCoreAssociations({
  Organizacion,
  Usuario,
  Rol,
  Permiso,
  RolPermiso,
  AuditLog,
  EmailVerificationToken,
  PasswordResetToken,
  OrganizacionUsuario,
  OrganizacionInvitacion
});

// Exportar individualmente
export {
  sequelize,
  Organizacion,
  Usuario,
  Rol,
  Permiso,
  RolPermiso,
  AuditLog,
  EmailVerificationToken,
  PasswordResetToken,
  OrganizacionUsuario,
  OrganizacionInvitacion
};
