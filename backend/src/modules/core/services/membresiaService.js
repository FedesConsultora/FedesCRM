import ApiError from '../../../utils/ApiError.js';
import { Usuario, Rol, Organizacion, OrganizacionUsuario } from '../models/index.js';
import { sendTemplate } from '../../../services/email/index.js';


export const listarMiembros = async (orgId, estado = null) => {
  const where = { organizacion_id: orgId };
  if (estado) where.estado = estado;

  return OrganizacionUsuario.findAll({
    where,
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'email', 'nombre', 'apellido', 'activo'] },
      { model: Rol, as: 'rol', attributes: ['id', 'nombre'] }
    ],
    order: [['created_at', 'DESC']]
  });
};

export const aprobarSolicitud = async ({ orgId, membershipId, rolId }) => {
  const mem = await OrganizacionUsuario.findByPk(membershipId, {
    include: [{ model: Usuario, as: 'usuario' }, { model: Organizacion, as: 'organizacion' }]
  });
  if (!mem || mem.organizacion_id !== orgId) {
    throw new ApiError(404, 'Solicitud no encontrada', 'MEMBERSHIP_NOT_FOUND');
  }
  if (mem.estado !== 'pendiente') {
    throw new ApiError(409, 'La solicitud no está pendiente', 'MEMBERSHIP_NOT_PENDING');
  }

  mem.estado = 'activo';
  mem.rol_id = rolId ?? mem.rol_id;
  await mem.save();

  await sendTemplate({
    to: mem.usuario.email,
    template: 'membership-approved',
    subject: `Acceso aprobado en ${mem.organizacion.nombre}`,
    vars: { orgName: mem.organizacion.nombre }
  });

  return mem;
};

export const rechazarSolicitud = async ({ orgId, membershipId }) => {
  const mem = await OrganizacionUsuario.findByPk(membershipId, {
    include: [{ model: Usuario, as: 'usuario' }, { model: Organizacion, as: 'organizacion' }]
  });
  if (!mem || mem.organizacion_id !== orgId) {
    throw new ApiError(404, 'Solicitud no encontrada', 'MEMBERSHIP_NOT_FOUND');
  }
  if (mem.estado !== 'pendiente') {
    throw new ApiError(409, 'La solicitud no está pendiente', 'MEMBERSHIP_NOT_PENDING');
  }

  mem.estado = 'rechazado';
  await mem.save();

  await sendTemplate({
    to: mem.usuario.email,
    template: 'membership-rejected',
    subject: `Tu solicitud en ${mem.organizacion.nombre} fue rechazada`,
    vars: { orgName: mem.organizacion.nombre }
  });

  return mem;
};

export const cambiarRol = async ({ orgId, membershipId, rolId }) => {
  const mem = await OrganizacionUsuario.findByPk(membershipId, {
    include: [{ model: Usuario, as: 'usuario' }]
  });
  if (!mem || mem.organizacion_id !== orgId) {
    throw new ApiError(404, 'Membresía no encontrada', 'MEMBERSHIP_NOT_FOUND');
  }
  if (mem.estado !== 'activo') {
    throw new ApiError(409, 'Solo se puede cambiar el rol a miembros activos', 'MEMBERSHIP_NOT_ACTIVE');
  }
  const rol = await Rol.findByPk(rolId);
  if (!rol || rol.organizacion_id !== orgId) {
    throw new ApiError(404, 'Rol inválido para esta organización', 'ROLE_NOT_FOUND');
  }

  mem.rol_id = rolId;
  await mem.save();
  return mem;
};

export const solicitarUnion = async ({ orgId, userId }) => {
  const org = await Organizacion.findByPk(orgId);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');

  const existente = await OrganizacionUsuario.findOne({
    where: { organizacion_id: orgId, usuario_id: userId }
  });

  if (existente) {
    if (existente.estado === 'activo') throw new ApiError(409, 'Ya sos miembro activo', 'ALREADY_MEMBER');
    if (existente.estado === 'pendiente') throw new ApiError(409, 'Solicitud ya pendiente', 'REQUEST_ALREADY_PENDING');
  }

  const nuevaSolicitud = await OrganizacionUsuario.create({
    organizacion_id: orgId,
    usuario_id: userId,
    estado: 'pendiente',
    rol_id: null
  });

  // Buscar admins de la organización
  const admins = await OrganizacionUsuario.findAll({
    where: { organizacion_id: orgId, estado: 'activo' },
    include: [{ model: Rol, as: 'rol', where: { nombre: 'admin' } }, { model: Usuario, as: 'usuario' }]
  });

  const solicitante = await Usuario.findByPk(userId);

  // Enviar notificación a todos los admins
  await Promise.all(
    admins.map(admin =>
      sendTemplate({
        to: admin.usuario.email,
        template: 'membership-request',
        subject: `Nueva solicitud en ${org.nombre}`,
        vars: {
          userName: `${solicitante.nombre} ${solicitante.apellido}`,
          userEmail: solicitante.email,
          orgName: org.nombre,
          reviewLink: `${process.env.FRONTEND_URL}/orgs/${orgId}/members`
        }
      })
    )
  );

  return nuevaSolicitud;
};
