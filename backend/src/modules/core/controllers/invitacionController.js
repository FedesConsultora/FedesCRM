import * as service from '../services/invitacionService.js';

export const crear = async (req, res, next) => {
  try {
    const { email, rolId, dias, resend } = req.body;
    const { orgId } = req.params;
    const data = await service.crearInvitacion({ orgId, email, rolId, dias, resend });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const listar = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const data = await service.listarInvitaciones(orgId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const revocar = async (req, res, next) => {
  try {
    const { orgId, inviteId } = req.params;
    await service.revocarInvitacion({ inviteId, orgId });
    res.json({ success: true, message: 'Invitación revocada' });
  } catch (err) { next(err); }
};

// Aceptar invitación (usuario autenticado)
export const aceptar = async (req, res, next) => {
  try {
    const { token } = req.body;
    const data = await service.aceptarInvitacion({ userId: req.user.id, token });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
