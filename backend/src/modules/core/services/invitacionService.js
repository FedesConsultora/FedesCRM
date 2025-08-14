import crypto from 'crypto';
import { Op } from 'sequelize';
import ApiError from '../../../utils/ApiError.js';
import { Usuario, Rol, Organizacion, OrganizacionUsuario, OrganizacionInvitacion } from '../models/index.js';
import { sendTemplate } from '../../../services/email/index.js';

const FE_BASE = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');

export const crearInvitacion = async ({ orgId, email, rolId = null, dias = 7, resend = false }) => {
  const org = await Organizacion.findByPk(orgId);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

  const emailNorm = String(email).trim().toLowerCase();

  const user = await Usuario.findOne({ where: { email: emailNorm } });
  if (user) {
    const yaMiembro = await OrganizacionUsuario.findOne({
      where: { organizacionId: orgId, usuarioId: user.id, estado: 'activo' }
    });
    if (yaMiembro) throw new ApiError(409, 'El usuario ya es miembro de la organización', 'ALREADY_MEMBER');
  }

  let invite = await OrganizacionInvitacion.findOne({
    where: {
      organizacionId: orgId,
      email: emailNorm,
      estado: 'pendiente',
      expiracion: { [Op.gt]: new Date() }
    }
  });

  if (invite && !resend) {
    throw new ApiError(409, 'Ya existe una invitación vigente para ese email', 'INVITE_EXISTS');
  }

  const token      = crypto.randomUUID();
  const expiracion = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);

  if (invite) {
    invite.token      = token;
    invite.expiracion = expiracion;
    invite.rolId      = rolId ?? invite.rolId;
    await invite.save();
  } else {
    invite = await OrganizacionInvitacion.create({
      organizacionId: orgId,
      email: emailNorm,
      rolId,
      token,
      expiracion,
      estado: 'pendiente'
    });
  }

  await sendTemplate({
    to: emailNorm,
    template: 'org-invite',
    subject: `Te invitaron a unirte a ${org.nombre}`,
    vars: { orgName: org.nombre, inviteLink: `${FE_BASE}/invite/${token}` }
  });

  return { id: invite.id, email: invite.email, expiracion: invite.expiracion };
};

export const aceptarInvitacion = async ({ userId, token }) => {
  const invite = await OrganizacionInvitacion.findOne({
    where: { token, estado: 'pendiente', expiracion: { [Op.gt]: new Date() } }
  });
  if (!invite) throw new ApiError(400, 'Invitación inválida o expirada', 'INVITE_INVALID');

  const org = await Organizacion.findByPk(invite.organizacionId);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

  const yaMiembro = await OrganizacionUsuario.findOne({
    where: { organizacionId: org.id, usuarioId: userId, estado: 'activo' }
  });
  if (!yaMiembro) {
    await OrganizacionUsuario.create({
      organizacionId: org.id,
      usuarioId: userId,
      rolId: invite.rolId ?? null,
      estado: 'activo'
    });
  }

  invite.estado = 'aceptada';
  await invite.save();

  return { orgId: org.id };
};

export const revocarInvitacion = async ({ inviteId, orgId }) => {
  const invite = await OrganizacionInvitacion.findByPk(inviteId);
  if (!invite || invite.organizacionId !== orgId) {
    throw new ApiError(404, 'Invitación no encontrada', 'INVITE_NOT_FOUND');
  }
  invite.estado = 'rechazada';
  await invite.save();
};

export const listarInvitaciones = async (orgId) => {
  return OrganizacionInvitacion.findAll({
    where: { organizacionId: orgId, estado: 'pendiente', expiracion: { [Op.gt]: new Date() } },
    order: [['created_at', 'DESC']]
  });
};
