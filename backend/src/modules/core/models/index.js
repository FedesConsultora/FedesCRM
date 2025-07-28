import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

import usuarioModel                from './usuario.js';
import rolModel                    from './rol.js';
import permisoModel                from './permiso.js';
import rolPermisoModel             from './rolPermiso.js';
import auditLogModel               from './auditLog.js';
import emailVerificationTokenModel from './emailVerificationToken.js';
import passwordResetTokenModel     from './passwordResetToken.js';
import { applyCoreAssociations }   from './associations.js';

// Inicialización de modelos
const Usuario                = usuarioModel(sequelize, DataTypes);
const Rol                    = rolModel(sequelize, DataTypes);
const Permiso                = permisoModel(sequelize, DataTypes);
const RolPermiso             = rolPermisoModel(sequelize, DataTypes);
const AuditLog               = auditLogModel(sequelize, DataTypes);
const EmailVerificationToken = emailVerificationTokenModel(sequelize, DataTypes);
const PasswordResetToken     = passwordResetTokenModel(sequelize, DataTypes);

// Aplicar asociaciones
applyCoreAssociations({
  Usuario,
  Rol,
  Permiso,
  RolPermiso,
  AuditLog,
  EmailVerificationToken,
  PasswordResetToken
});

// Exportar individualmente
export {
  sequelize,
  Usuario,
  Rol,
  Permiso,
  RolPermiso,
  AuditLog,
  EmailVerificationToken,
  PasswordResetToken
};
