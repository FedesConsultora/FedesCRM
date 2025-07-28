// src/services/email/renderer.js
import fs               from 'fs/promises';
import path             from 'path';
import Handlebars       from 'handlebars';
import defaultTheme     from './theme/default.js';

const TPL_DIR      = path.resolve('src/services/email/templates');
const PARTIALS_DIR = path.join(TPL_DIR, 'partials');

// ▸ Helper para obtener cualquier variable del theme dentro de las plantillas
Handlebars.registerHelper('theme', key => defaultTheme[key] || '');

for (const file of await fs.readdir(PARTIALS_DIR)) {
  const name = path.parse(file).name;
  const html = await fs.readFile(path.join(PARTIALS_DIR, file), 'utf8');
  Handlebars.registerPartial(name, html);
}

// Compile del layout
const layoutHtml = await fs.readFile(path.join(TPL_DIR, 'layout.hbs'), 'utf8');
const layoutTpl  = Handlebars.compile(layoutHtml);

export const render = async (templateName, data = {}) => {
  // Plantilla específica
  const html = await fs.readFile(path.join(TPL_DIR, `${templateName}.hbs`), 'utf8');
  const tpl  = Handlebars.compile(html);

  // Contenido renderizado
  const body = tpl({ ...defaultTheme, ...data });

  // Inyectamos en layout con theme completo
  return layoutTpl({ ...defaultTheme, ...data, body });
};
