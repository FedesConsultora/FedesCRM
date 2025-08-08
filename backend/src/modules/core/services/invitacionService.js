import crypto from 'crypto';
import { Op } from 'sequelize';
import ApiError from '../../../utils/ApiError.js';
import {
  Usuario, Rol, Organizacion, OrganizacionUsuario, OrganizacionInvitacion
} from '../models/index.js';
import { sendTemplate } from '../../../services/email/index.js';

const FE_BASE = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');

export const crearInvitacion = async ({ orgId, email, rolId = null, dias = 7, resend = false }) => {
  const org = await Organizacion.findByPk(orgId);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

  const emailNorm = String(email).trim().toLowerCase();

  // Ya es miembro activo?
  const user = await Usuario.findOne({ where: { email: emailNorm } });
  if (user) {
    const yaMiembro = await OrganizacionUsuario.findOne({
      where: { organizacion_id: orgId, usuario_id: user.id, estado: 'activo' }
    });
    if (yaMiembro) {
      throw new ApiError(409, 'El usuario ya es miembro de la organización', 'ALREADY_MEMBER');
    }
  }

  // Hay invitación vigente?
  let invite = await OrganizacionInvitacion.findOne({
    where: {
      organizacion_id: orgId,
      email: emailNorm,
      accepted_at: null,
      expires_at: { [Op.gt]: new Date() }
    }
  });

  if (invite && !resend) {
    throw new ApiError(409, 'Ya existe una invitación vigente para ese email', 'INVITE_EXISTS');
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);

  if (invite) {
    invite.token = token;
    invite.expires_at = expiresAt;
    invite.rol_id = rolId ?? invite.rol_id;
    await invite.save();
  } else {
    invite = await OrganizacionInvitacion.create({
      organizacion_id: orgId,
      email: emailNorm,
      rol_id: rolId,
      token,
      expires_at: expiresAt
    });
  }

  await sendTemplate({
    to: emailNorm,
    template: 'org-invite',
    subject: `Te invitaron a unirte a ${org.nombre}`,
    vars: {
      orgName: org.nombre,
      inviteLink: `${FE_BASE}/invite/${token}`
    }
  });

  return { id: invite.id, email: invite.email, expiresAt: invite.expires_at };
};

export const aceptarInvitacion = async ({ userId, token }) => {
  const invite = await OrganizacionInvitacion.findOne({
    where: { token, accepted_at: null, expires_at: { [Op.gt]: new Date() } }
  });
  if (!invite) throw new ApiError(400, 'Invitación inválida o expirada', 'INVITE_INVALID');

  const org = await Organizacion.findByPk(invite.organizacion_id);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

  // ¿ya es miembro activo?
  const yaMiembro = await OrganizacionUsuario.findOne({
    where: { organizacion_id: org.id, usuario_id: userId, estado: 'activo' }
  });
  if (yaMiembro) {
    invite.accepted_at = new Date();
    await invite.save();
    return { alreadyMember: true, orgId: org.id };
  }

  await OrganizacionUsuario.create({
    organizacion_id: org.id,
    usuario_id: userId,
    rol_id: invite.rol_id ?? null,
    estado: 'activo'
  });

  invite.accepted_at = new Date();
  await invite.save();

  return { orgId: org.id };
};

export const revocarInvitacion = async ({ inviteId, orgId }) => {
  const invite = await OrganizacionInvitacion.findByPk(inviteId);
  if (!invite || invite.organizacion_id !== orgId) {
    throw new ApiError(404, 'Invitación no encontrada', 'INVITE_NOT_FOUND');
  }
  await invite.destroy();
};

export const listarInvitaciones = async (orgId) => {
  return OrganizacionInvitacion.findAll({
    where: { organizacion_id: orgId, accepted_at: null, expires_at: { [Op.gt]: new Date() } },
    order: [['created_at', 'DESC']]
  });
};
