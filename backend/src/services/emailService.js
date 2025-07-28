// src/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error al conectar con SMTP:', error);
  } else {
    console.log('📨 Conexión SMTP lista para enviar emails');
  }
});

export const enviarEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"FedesCRM" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  return await transporter.sendMail(mailOptions);
};
