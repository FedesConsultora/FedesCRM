import * as service from '../services/membresiaService.js';

export const listarMiembros = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { estado } = req.query; // activo | pendiente | rechazado
    const data = await service.listarMiembros(orgId, estado || null);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const aprobar = async (req, res, next) => {
  try {
    const { orgId, membershipId } = req.params;
    const { rolId } = req.body;
    const data = await service.aprobarSolicitud({ orgId, membershipId, rolId });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const rechazar = async (req, res, next) => {
  try {
    const { orgId, membershipId } = req.params;
    const data = await service.rechazarSolicitud({ orgId, membershipId });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const cambiarRol = async (req, res, next) => {
  try {
    const { orgId, membershipId } = req.params;
    const { rolId } = req.body;
    const data = await service.cambiarRol({ orgId, membershipId, rolId });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const solicitarUnion = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const data = await service.solicitarUnion({ orgId, userId: req.user.id });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};