// src/modules/core/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Op } from 'sequelize';
import ApiError from '../../../utils/ApiError.js';
import {
  Usuario,
  Rol,
  Permiso,
  EmailVerificationToken,
  PasswordResetToken
} from '../models/index.js';
import { sendTemplate } from '../../../services/email/index.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -------------------- Helper --------------------
const generarJWT = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
};

// -------------------- Registro --------------------
export const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, organizacionId } = req.body;

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) throw new ApiError(400, 'El email ya está registrado', 'EMAIL_DUPLICATE');

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      organizacionId,
      activo: false // Espera verificación
    });

    // Crear token de verificación
    const token = crypto.randomUUID();
    await EmailVerificationToken.create({
      usuarioId: usuario.id,
      token,
      expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Enviar email de verificación
    await sendTemplate({
      to: usuario.email,
      template: 'verify-email',
      subject: 'Verificá tu cuenta en FedesCRM',
      vars: {
        name: usuario.nombre,
        verifyLink: `${process.env.FRONTEND_URL}/verify/${token}`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.'
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Login --------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.scope(null).findOne({
      where: { email },
      include: {
        model: Rol,
        as: 'rol',
        include: { model: Permiso }
      }
    });

    if (!user) throw new ApiError(401, 'Credenciales inválidas', 'LOGIN_INVALID');

    const valido = await user.validarPassword(password);
    if (!valido) throw new ApiError(401, 'Credenciales inválidas', 'LOGIN_INVALID');

    if (!user.activo) throw new ApiError(403, 'La cuenta no está activada', 'ACCOUNT_INACTIVE');

    // Actualizar último login
    user.ultimoLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token: generarJWT(user),
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol?.nombre,
        permisos: user.rol?.Permisos?.map(p => p.nombre) || []
      }
    });
  } catch (err) {
    next(err);
  }
};


// -------------------- Login con Google --------------------
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new ApiError(400, 'Token de Google requerido', 'GOOGLE_TOKEN_REQUIRED');

    // 1. Verificar token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const nombre = payload.given_name;
    const apellido = payload.family_name;

    // 2. Buscar o crear usuario
    let user = await Usuario.findOne({ where: { oauthId: googleId } });

    if (!user) {
      user = await Usuario.create({
        nombre,
        apellido,
        email,
        oauthId: googleId,
        proveedor: 'google',
        activo: true
      });

      // Email de bienvenida
      await sendTemplate({
        to: user.email,
        template: 'welcome',
        subject: `¡Bienvenido a ${process.env.APP_NAME || 'FedesCRM'}!`,
        vars: {
          name: user.nombre,
          dashboardLink: `${process.env.FRONTEND_URL}/dashboard`
        }
      });
    }

    // 3. Respuesta con JWT
    res.json({
      success: true,
      token: generarJWT(user),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Forgot Password --------------------
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

    // Enviar email de recuperación
    await sendTemplate({
      to: user.email,
      template: 'reset-password',
      subject: 'Recuperá tu contraseña',
      vars: {
        resetLink: `${process.env.FRONTEND_URL}/reset-password/${token}`
      }
    });

    res.json({ success: true, message: 'Se envió el enlace para recuperar la contraseña' });
  } catch (err) {
    next(err);
  }
};

// -------------------- Reset Password --------------------
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

    // Notificar por email que la contraseña se actualizó
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

    // Email de bienvenida
    await sendTemplate({
      to: user.email,
      template: 'welcome',
      subject: `¡Bienvenido a ${process.env.APP_NAME || 'FedesCRM'}!`,
      vars: {
        name: user.nombre,
        dashboardLink: `${process.env.FRONTEND_URL}/dashboard`
      }
    });

    res.json({ success: true, message: 'Email verificado correctamente' });
  } catch (err) {
    next(err);
  }
};

// -------------------- Perfil actual --------------------
export const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
