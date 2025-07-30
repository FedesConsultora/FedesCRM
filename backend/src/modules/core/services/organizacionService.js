// src/modules/core/services/organizacionService.js
import * as repo from '../repositories/organizacionRepository.js';
import ApiError from '../../../utils/ApiError.js';

export const listarOrganizaciones = async () => {
  return await repo.findAll({ order: [['createdAt', 'DESC']] });
};

export const obtenerOrganizacion = async (id) => {
  const org = await repo.findById(id);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');
  return org;
};

export const crearOrganizacion = async (data) => {
  return await repo.create(data);
};

export const actualizarOrganizacion = async (id, data) => {
  const org = await repo.update(id, data);
  if (!org) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');
  return org;
};

export const eliminarOrganizacion = async (id) => {
  const result = await repo.softDelete(id);
  if (!result) throw new ApiError(404, 'Organización no encontrada', 'ORG_NOT_FOUND');
  return true;
};
