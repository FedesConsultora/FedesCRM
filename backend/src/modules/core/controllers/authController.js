// src/modules/core/controllers/authController.js
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import crypto from 'crypto';
import { Op } from 'sequelize';
import ApiError from '../../../utils/ApiError.js';

import {
  Usuario,
  Rol,
  Permiso,
  EmailVerificationToken,
  PasswordResetToken,
  Organizacion,
  OrganizacionUsuario,
  OrganizacionInvitacion
} from '../models/index.js';

import { sendTemplate } from '../../../services/email/index.js';
import { OAuth2Client } from 'google-auth-library';
import { setAuthCookie, clearAuthCookie } from '../../../utils/authCookies.js';

// -------------------- Config / Google OAuth --------------------
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.googleClientId;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.googleClientSecret;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID); // verifyIdToken
const googleOAuth = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'postmessage'); // code -> tokens

// -------------------- Helpers --------------------
const FE_BASE = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');

const generarJWT = (userId, orgId, roleId) =>
  jwt.sign({ id: userId, orgId, roleId }, process.env.JWT_SECRET, { expiresIn: '12h' });

/**
 * Devuelve el payload de usuario consistente para el frontend.
 * Incluye:
 *  - organizacion activa (o null si superadmin)
 *  - rol, permisos
 *  - organizations: [{ id, nombre, rol }]
 */
const buildUserPayload = async (userId, orgId = null) => {
  const user = await Usuario.findByPk(userId);
  if (!user) throw new ApiError(401, 'Usuario no encontrado', 'AUTH_USER_NOT_FOUND');

  // ¡OJO! camelCase en atributos del modelo
  const all = await OrganizacionUsuario.findAll({
    where: { usuarioId: userId, estado: 'activo' },
    include: [
      { model: Organizacion, as: 'organizacion' },
      { model: Rol, as: 'rol', include: [{ model: Permiso, as: 'permisos' }] },
    ],
  });

  const organizations = all.map(m => ({
    id   : m.organizacionId,
    nombre: m.organizacion?.nombre,
    rol  : m.rol?.nombre || null,
  }));

  if (!orgId) {
    return {
      id   : user.id,
      email: user.email,
      organizacion: null,
      rol  : 'superadmin_global',
      permisos: ['*'],
      organizations,
    };
  }

  const membership = all.find(m => m.organizacionId === orgId);
  if (!membership) throw new ApiError(403, 'No perteneces a esta organización', 'ORG_ACCESS_DENIED');

  return {
    id   : user.id,
    email: user.email,
    organizacion: {
      id     : membership.organizacionId,
      nombre : membership.organizacion?.nombre,
      dominio: membership.organizacion?.dominio
    },
    rol     : membership.rol?.nombre || null,
    permisos: membership.rol?.permisos?.map(p => p.nombre) || [],
    organizations,
  };
};

const ensureAdminRoleForOrg = async (orgId) => {
  let role = await Rol.findOne({ where: { organizacion_id: orgId, nombre: 'admin' } });
  if (!role) {
    role = await Rol.create({
      organizacion_id: orgId,
      nombre: 'admin',
      descripcion: 'Súper Administrador'
    });
  }
  return role;
};

// -------------------- Registro Step 1 --------------------
export const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) throw new ApiError(400, 'El email ya está registrado', 'EMAIL_DUPLICATE');

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      activo: false
    });

    const pendingToken = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado. Continúa con los datos de la empresa o unite a una existente.',
      pendingToken
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Registro Step 2 (Crear organización) --------------------
export const registerOrganization = async (req, res, next) => {
  try {
    const { pendingToken, nombre, dominio, sector, descripcionProblema, consultasMes } = req.body;
    if (!pendingToken) throw new ApiError(400, 'Token de registro requerido', 'REGISTER_TOKEN_MISSING');

    const decoded = jwt.verify(pendingToken, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.userId);
    if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');

    const dominioLower = (dominio || '').trim().toLowerCase();
    const existente = await Organizacion.findOne({ where: { dominio: dominioLower } });
    if (existente) throw new ApiError(400, 'El dominio ya está registrado', 'ORG_DOMAIN_DUPLICATE');

    const organizacion = await Organizacion.create({
      nombre,
      dominio: dominioLower,
      sector,
      problemas: descripcionProblema || null,
      consultas_mes: consultasMes || null,
      activo: true
    });

    const rolAdmin = await ensureAdminRoleForOrg(organizacion.id);

    await OrganizacionUsuario.create({
      organizacionId: organizacion.id,
      usuarioId: usuario.id,
      rolId: rolAdmin.id,
      estado: 'activo'
    });

    const token = crypto.randomUUID();
    await EmailVerificationToken.create({
      usuarioId: usuario.id,
      token,
      expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await sendTemplate({
      to: usuario.email,
      template: 'verify-email',
      subject: 'Verificá tu cuenta en FedesCRM',
      vars: { verifyLink: `${FE_BASE}/verify/${token}` }
    });

    res.json({ success: true, message: 'Organización creada. Revisá tu email para activar tu cuenta.' });
  } catch (err) {
    next(err);
  }
};

// -------------------- Unirse a organización --------------------
export const joinOrganization = async (req, res, next) => {
  try {
    const { inviteToken, orgId, dominio } = req.body;

    // Detecta si viene del flujo pendingToken o de usuario activo
    const usuarioId = req.pendingUser?.id || req.user?.id;
    if (!usuarioId) throw new ApiError(401, 'Usuario no autenticado', 'AUTH_REQUIRED');

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');

    let org = null;

    // Caso 1: unión por invitación
    if (inviteToken) {
      const invite = await OrganizacionInvitacion.findOne({
        where: {
          token: inviteToken,
          accepted_at: null,
          expires_at: { [Op.gt]: new Date() }
        }
      });

      if (!invite) throw new ApiError(400, 'Invitación inválida o expirada', 'INVITE_INVALID');

      org = await Organizacion.findByPk(invite.organizacion_id);
      if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

      await OrganizacionUsuario.create({
        organizacionId: org.id,
        usuarioId: usuario.id,
        rolId: invite.rol_id || null,
        estado: 'activo'
      });

      invite.accepted_at = new Date();
      await invite.save();
    } else {
      // Caso 2: unión directa por orgId o dominio
      org = orgId
        ? await Organizacion.findByPk(orgId)
        : await Organizacion.findOne({ where: { dominio: (dominio || '').toLowerCase() } });

      if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

      await OrganizacionUsuario.create({
        organizacionId: org.id,
        usuarioId: usuario.id,
        rolId: null,
        estado: 'pendiente'
      });
    }

    // Si el usuario aún no está activo (flujo pendingToken), generar token de verificación de email
    if (!usuario.activo) {
      const token = crypto.randomUUID();
      await EmailVerificationToken.create({
        usuarioId: usuario.id,
        token,
        expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      await sendTemplate({
        to: usuario.email,
        template: 'verify-email',
        subject: 'Verificá tu cuenta en FedesCRM',
        vars: { verifyLink: `${FE_BASE}/verify/${token}` }
      });
    }

    res.json({
      success: true,
      message: inviteToken
        ? 'Te uniste a la organización correctamente.'
        : 'Solicitud enviada. Un admin debe aprobar tu acceso.'
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- CSRF + Logout --------------------
export const csrf = async (_req, res) => {
  res.json({ success: true, csrfToken: 'ok' });
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);
  res.clearCookie('csrf_token', { path: '/', sameSite: 'lax', secure: true });
  res.json({ success: true });
};

// -------------------- Login --------------------
export const login = async (req, res, next) => {
  try {
    const { email, password, orgId } = req.body;
    const user = await Usuario.scope(null).findOne({ where: { email } });
    if (!user) throw new ApiError(401, 'Credenciales inválidas', 'LOGIN_INVALID');

    const valido = await user.validarPassword(password);
    if (!valido) throw new ApiError(401, 'Credenciales inválidas', 'LOGIN_INVALID');
    if (!user.activo) throw new ApiError(403, 'La cuenta no está activada', 'ACCOUNT_INACTIVE');

    const memberships = await OrganizacionUsuario.findAll({
      where: { usuarioId: user.id, estado: 'activo' },
      include: [{ model: Organizacion, as: 'organizacion' }, { model: Rol, as: 'rol' }]
    });

    if (!memberships.length) {
      if (user.rolGlobal === 'superadmin_global') {
        const token = generarJWT(user.id, null, null);
        const payload = await buildUserPayload(user.id, null);
        setAuthCookie(res, token);
        return res.json({ success: true, user: payload });
      }
      throw new ApiError(403, 'No perteneces a ninguna organización', 'NO_ORG_MEMBERSHIP');
    }

    let selected = memberships[0];
    if (orgId) {
      selected = memberships.find(m => m.organizacionId === orgId);
      if (!selected) throw new ApiError(403, 'No perteneces a esa organización', 'ORG_ACCESS_DENIED');
    } else if (memberships.length > 1) {
      return res.status(409).json({
        success: false,
        code: 'MULTIPLE_ORGS',
        message: 'Seleccioná una organización',
        options: memberships.map(m => ({
          orgId : m.organizacionId,
          nombre: m.organizacion?.nombre,
          rol   : m.rol?.nombre
        }))
      });
    }

    user.ultimoLogin = new Date();
    await user.save();

    const token   = generarJWT(user.id, selected.organizacionId, selected.rolId);
    const payload = await buildUserPayload(user.id, selected.organizacionId);

    setAuthCookie(res, token);
    return res.json({ success: true, user: payload });
  } catch (err) { next(err); }
};

// -------------------- Login con 2FA --------------------
export const login2FA = async (req, res, next) => {
  try {
    const { email, token, orgId } = req.body;
    if (!email || !token) throw new ApiError(400, 'Email y token 2FA requeridos', '2FA_REQUIRED');

    const user = await Usuario.scope(null).findOne({ where: { email } });
    if (!user) throw new ApiError(401, 'Credenciales inválidas', 'LOGIN_INVALID');

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new ApiError(400, 'El usuario no tiene 2FA configurado', '2FA_NOT_CONFIGURED');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2
    });
    if (!verified) throw new ApiError(401, 'Código 2FA inválido', '2FA_INVALID');

    const memberships = await OrganizacionUsuario.findAll({
      where: { usuarioId: user.id, estado: 'activo' },
      include: [{ model: Organizacion, as: 'organizacion' }, { model: Rol, as: 'rol' }]
    });

    if (!memberships.length) {
      if (user.rolGlobal === 'superadmin_global') {
        const jwtToken = generarJWT(user.id, null, null);
        const payload  = await buildUserPayload(user.id, null);
        setAuthCookie(res, jwtToken);
        return res.json({ success: true, user: payload });
      }
      throw new ApiError(403, 'No perteneces a ninguna organización', 'NO_ORG_MEMBERSHIP');
    }

    let selected = memberships[0];
    if (orgId) {
      selected = memberships.find(m => m.organizacionId === orgId);
      if (!selected) throw new ApiError(403, 'No perteneces a esa organización', 'ORG_ACCESS_DENIED');
    } else if (memberships.length > 1) {
      return res.status(409).json({
        success: false,
        code: 'MULTIPLE_ORGS',
        message: 'Seleccioná una organización',
        options: memberships.map(m => ({
          orgId : m.organizacionId,
          nombre: m.organizacion?.nombre,
          rol   : m.rol?.nombre
        }))
      });
    }

    user.ultimoLogin = new Date();
    await user.save();

    const jwtToken = generarJWT(user.id, selected.organizacionId, selected.rolId);
    const payload  = await buildUserPayload(user.id, selected.organizacionId);

    setAuthCookie(res, jwtToken);
    return res.json({ success: true, user: payload });
  } catch (err) { next(err); }
};

// -------------------- Login con Google --------------------
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken, code, orgId } = req.body;

    let idTokenToVerify = idToken || null;
    if (!idTokenToVerify && code) {
      const { tokens } = await googleOAuth.getToken({ code });
      idTokenToVerify = tokens?.id_token || null;
    }
    if (!idTokenToVerify) throw new ApiError(400, 'Token de Google requerido', 'GOOGLE_TOKEN_REQUIRED');

    const ticket  = await googleClient.verifyIdToken({ idToken: idTokenToVerify, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email    = payload.email;
    const nombre   = payload.given_name || '';
    const apellido = payload.family_name || '';

    let user = await Usuario.findOne({ where: { oauth_id: googleId } });

    if (!user) {
      user = await Usuario.create({
        nombre, apellido, email, oauth_id: googleId, proveedor: 'google', activo: true
      });
      return res.status(200).json({
        success: true,
        code: 'ACCOUNT_CREATED_NO_ORG',
        message: 'Cuenta creada con Google. Debés crear o unirte a una organización.',
        pendingToken: jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
      });
    }

    const memberships = await OrganizacionUsuario.findAll({
      where: { usuarioId: user.id, estado: 'activo' },
      include: [{ model: Organizacion, as: 'organizacion' }, { model: Rol, as: 'rol' }]
    });

    if (!memberships.length) {
      if (user.rolGlobal === 'superadmin_global') {
        const token = generarJWT(user.id, null, null);
        const data  = await buildUserPayload(user.id, null);
        setAuthCookie(res, token);
        return res.json({ success: true, user: data });
      }
      return res.status(403).json({
        success: false,
        code: 'NO_ORG_MEMBERSHIP',
        message: 'No perteneces a ninguna organización. Creá o unite a una.'
      });
    }

    let selected = memberships[0];
    if (orgId) {
      selected = memberships.find(m => m.organizacionId === orgId);
      if (!selected) throw new ApiError(403, 'No perteneces a esa organización', 'ORG_ACCESS_DENEGADO');
    } else if (memberships.length > 1) {
      return res.status(409).json({
        success: false,
        code: 'MULTIPLE_ORGS',
        message: 'Seleccioná una organización',
        options: memberships.map(m => ({
          orgId : m.organizacionId,
          nombre: m.organizacion?.nombre,
          rol   : m.rol?.nombre
        }))
      });
    }

    const token = generarJWT(user.id, selected.organizacionId, selected.rolId);
    const data  = await buildUserPayload(user.id, selected.organizacionId);

    setAuthCookie(res, token);
    return res.json({ success: true, user: data });
  } catch (err) { next(err); }
};

// -------------------- Forgot / Reset Password --------------------
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    if (!user) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');

    const token = crypto.randomUUID();
    await PasswordResetToken.create({
      usuarioId: user.id,
      token,
      expiracion: new Date(Date.now() + 3600 * 1000)
    });

    await sendTemplate({
      to: user.email,
      template: 'reset-password',
      subject: 'Recuperá tu contraseña',
      vars: { resetLink: `${FE_BASE}/reset-password/${token}` }
    });

    res.json({ success: true, message: 'Se envió el enlace para recuperar la contraseña' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const record = await PasswordResetToken.findOne({
      where: {
        token,
        usado: false,
        expiracion: { [Op.gt]: new Date() }
      }
    });

    if (!record) throw new ApiError(400, 'Token inválido o expirado', 'TOKEN_INVALID');

    const user = await Usuario.findByPk(record.usuarioId);
    user.password = newPassword;
    await user.save();

    record.usado = true;
    await record.save();

    await sendTemplate({
      to: user.email,
      template: 'password-updated',
      subject: 'Tu contraseña fue actualizada',
      vars: {}
    });

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};

// -------------------- Verify Email --------------------
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      throw new ApiError(422, 'Token requerido', 'VALIDATION_ERROR');
    }

    const record = await EmailVerificationToken.findOne({
      where: {
        token,
        usado: false,
        expiracion: { [Op.gt]: new Date() }
      }
    });

    if (!record) throw new ApiError(400, 'Token inválido o expirado', 'TOKEN_INVALID');

    const user = await Usuario.findByPk(record.usuarioId);
    user.activo = true;
    await user.save();

    record.usado = true;
    await record.save();

    await sendTemplate({
      to: user.email,
      template: 'welcome',
      subject: `¡Bienvenido a ${process.env.APP_NAME || 'FedesCRM'}!`,
      vars: {
        name: user.nombre,
        dashboardLink: `${FE_BASE}/dashboard`
      }
    });

    res.json({ success: true, message: 'Email verificado correctamente' });
  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    if (!user) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
    if (user.activo) throw new ApiError(400, 'La cuenta ya está verificada', 'ACCOUNT_ALREADY_VERIFIED');

    await EmailVerificationToken.update(
      { usado: true },
      { where: { usuarioId: user.id, usado: false } }
    );

    const token = crypto.randomUUID();
    await EmailVerificationToken.create({
      usuarioId: user.id,
      token,
      expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await sendTemplate({
      to: user.email,
      template: 'verify-email',
      subject: 'Verificá tu cuenta en FedesCRM',
      vars: { verifyLink: `${FE_BASE}/verify/${token}` }
    });

    res.json({ success: true, message: 'Correo de verificación reenviado' });
  } catch (err) {
    next(err);
  }
};

// -------------------- Switch de organización --------------------
export const switchOrganization = async (req, res, next) => {
  try {
    const { orgId } = req.body;
    if (!orgId) throw new ApiError(422, 'orgId requerido', 'VALIDATION_ERROR');

    const userId = req.user.id;

    if (req.user.rol === 'superadmin_global' && !orgId) {
      const token = generarJWT(userId, null, null);
      const user  = await buildUserPayload(userId, null);
      setAuthCookie(res, token);
      return res.json({ success: true, user });
    }

    const membership = await OrganizacionUsuario.findOne({
      where: { usuarioId: userId, organizacionId: orgId, estado: 'activo' }
    });
    if (!membership) throw new ApiError(403, 'No perteneces a esa organización', 'ORG_ACCESS_DENIED');

    const token = generarJWT(userId, orgId, membership.rolId);
    const user  = await buildUserPayload(userId, orgId);

    setAuthCookie(res, token);
    return res.json({ success: true, user });
  } catch (err) { next(err); }
};

// -------------------- Perfil actual --------------------
export const me = async (req, res, next) => {
  try {
    const orgId  = req.user?.orgId ?? null;
    const payload = await buildUserPayload(req.user.id, orgId);
    res.json({ success: true, user: payload });
  } catch (err) { next(err); }
};

// -------------------- Setup 2FA --------------------
export const setup2FA = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');

    const secret = speakeasy.generateSecret({ name: 'FedesCRM 2FA' });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const QRCode = await import('qrcode');
    const qrImage = await QRCode.toDataURL(secret.otpauth_url);

    res.json({ success: true, secret: secret.base32, qrImage });
  } catch (err) {
    next(err);
  }
};

// -------------------- Verify 2FA --------------------
export const verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await Usuario.findByPk(req.user.id);
    if (!user || !user.twoFactorSecret)
      throw new ApiError(400, '2FA no configurado', '2FA_NOT_CONFIGURED');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!verified) throw new ApiError(401, 'Código inválido', '2FA_INVALID');

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ success: true, message: '2FA activado correctamente' });
  } catch (err) {
    next(err);
  }
};

// -------------------- Disable 2FA --------------------
export const disable2FA = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({ success: true, message: '2FA desactivado correctamente' });
  } catch (err) {
    next(err);
  }
};
