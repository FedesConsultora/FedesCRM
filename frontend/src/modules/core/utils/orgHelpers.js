// Normaliza dominios tipo: " https://www.fedes.com/path " -> "fedes.com"
export const normalizeDomain = (raw = '') => {
  let d = String(raw).trim().toLowerCase();
  d = d.replace(/^https?:\/\//i, '');
  d = d.replace(/^www\./i, '');
  d = d.replace(/\/.*$/i, '');
  return d;
};

export const SECTORS = [
  'Bienes Raíces', 'Alimentos y Bebidas', 'Consultoría y Servicios profesionales',
  'Deportes', 'Diseño y Fotografía', 'Educación', 'Eventos y Entretenimiento',
  'Finanzas', 'Hogar y Decoración', 'Indumentaria', 'Industrial', 'Motores',
  'ONG', 'Publicidad y Marketing', 'Venta Minorista', 'Salud y Estética',
  'Seguridad', 'Seguros', 'Legal/Contabilidad', 'TIC', 'Software',
  'Tv, Prensa y Radio', 'Servicios', 'Viajes y Turismo', 'Otro'
];
