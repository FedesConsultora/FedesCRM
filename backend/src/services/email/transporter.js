// src/services/email/transporter.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host   : process.env.SMTP_HOST,
  port   : process.env.SMTP_PORT,
  secure : true,                       // usamos 465
  auth   : { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  logger : false,
  debug  : false
});

transporter.verify(err => {
  if (err) console.error('❌ SMTP error:', err);
  else     console.log('📨 SMTP listo');
});

export default transporter;
