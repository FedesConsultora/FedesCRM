// src/services/email/index.js
import transporter from './transporter.js';
import { render }  from './renderer.js';

/**
 * Envía un email usando una plantilla.
 * @param {Object} opts
 *  - to: correo destino
 *  - template: nombre de plantilla (sin .hbs)
 *  - subject: asunto
 *  - vars: objeto con variables de la plantilla
 */
export const sendTemplate = async ({ to, template, subject, vars = {} }) => {
  const html = await render(template, vars);
  return transporter.sendMail({
    from: `"FedesCRM" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};
