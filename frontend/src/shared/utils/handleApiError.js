// src/shared/utils/handleApiError.js

/**
 * Manejo centralizado de errores para FedesCRM Frontend.
 * - Soporta estructura estándar { success, message, code, details?, options? }
 * - Mapea códigos del backend a UX consistente (toasts / modales / confirmaciones)
 * - Pinta errores por campo cuando vienen en `details`
 *
 * @param {Object} error         Error (axios)
 * @param {Function} showToast   showToast(msg, type?) o showToast({ type, message })
 * @param {Function} setFieldErrors  setea errores por campo en formularios
 * @param {Function} showModal   showModal({ type, title, message, ... })
 */
export function handleApiError(error, showToast, setFieldErrors, showModal) {
  const sendToast = (type, message) => {
    if (!showToast) return;
    // Compatibilidad con ambas firmas documentadas
    try {
      if (typeof showToast === 'function') {
        // Preferir firma (msg, type) del Readme
        showToast(message, type);
      }
    } catch (_) {
      // Fallback a firma { type, message }
      try { showToast({ type, message }); } catch (_) {}
    }
  };

  let message = 'Error inesperado';
  let code = 'ERROR_INTERNO';
  let details = [];
  let options = undefined; // p/ MULTIPLE_ORGS u otros

  // ¿Vino de Axios con respuesta estructurada?
  if (error?.response?.data) {
    const data = error.response.data;
    message = data.message || message;
    code = data.code || code;
    details = data.details || [];
    options = data.options;
  } else if (error?.message) {
    // Errores locales (JS / red)
    message = error.message;
  }

  // Log útil para dev
  console.error(`❌ API Error [${code}]:`, message, details, options || '');

  // 1) Errores de validación por campo
  if (code === 'VALIDATION_ERROR' && Array.isArray(details) && details.length && typeof setFieldErrors === 'function') {
    const formErrors = {};
    details.forEach((err) => { formErrors[err.field] = err.message; });
    setFieldErrors(formErrors);
    // Además, un toast corto para contexto
    sendToast('error', 'Revisá los campos del formulario.');
    return;
  }

  // 2) Casos que requieren MODAL (bloquean o necesitan acción)
  switch (code) {
    /* ---------------------------- Sesión / Tokens ---------------------------- */
    case 'AUTH_NO_TOKEN':
    case 'AUTH_INVALID_TOKEN':
    case 'AUTH_TOKEN_EXPIRED':
    case 'AUTH_PAYLOAD_INVALID':
      // Sesión inválida/expirada → modal de info + CTA a login
      showModal?.({
        type: 'confirm',
        title: 'Sesión expirada',
        message: 'Tu sesión no es válida o expiró. Iniciá sesión nuevamente para continuar.',
        onConfirm: () => { window.location.href = '/login'; },
        onCancel: () => { window.location.href = '/login'; },
      });
      return;

    /* -------------------------- Cuenta / Activación -------------------------- */
    case 'ACCOUNT_INACTIVE':
    case 'EMAIL_NO_VERIFICADO':
      // Modal especial (tipo "resend") para reenviar verificación
      showModal?.({
        type: 'resend',
        title: 'Cuenta no verificada',
        message: 'Debés verificar tu email antes de iniciar sesión. Podés reenviar el correo de verificación.',
      });
      return;

    /* ------------------------------ Multi‑organización ------------------------------ */
    case 'ORG_ACCESS_DENIED':
    case 'ORG_ACCESS_DENEGADO': // hay variantes en middlewares
      showModal?.({
        title: 'Organización no permitida',
        message: 'No pertenecés a esa organización. Seleccioná otra o pedí acceso.',
      });
      return;

    case 'NO_ORG_MEMBERSHIP':
      showModal?.({
        title: 'Sin organización activa',
        message: 'Creá una organización o uníte a una existente para continuar.',
      });
      return;

    case 'REGISTER_TOKEN_MISSING':
    case 'REGISTER_TOKEN_EXPIRED':
    case 'REGISTER_TOKEN_INVALID':
      showModal?.({
        title: 'Token de registro inválido',
        message: 'El flujo de registro no es válido o expiró. Iniciá el proceso nuevamente.',
      });
      return;

    case 'INVITE_INVALID':
      showModal?.({
        title: 'Invitación inválida o expirada',
        message: 'Solicitá una nueva invitación al administrador.',
      });
      return;

    case 'MULTIPLE_ORGS':
      // El backend puede devolver `options` con { orgId, nombre, rol }
      // Sugerimos un modal custom "select-org" (extensible en ModalProvider)
      showModal?.({
        type: 'select-org',
        title: 'Seleccioná una organización',
        message: 'Tu usuario pertenece a varias organizaciones. Elegí una para continuar.',
        options: options || [],
      });
      return;

    /* ------------------------------- Permisos / Accesos ------------------------------- */
    case 'PERMISO_DENEGADO':
      showModal?.({
        title: 'Acceso denegado',
        message: 'No tenés permisos para realizar esta acción.',
      });
      return;

    case 'ORG_PARAM_REQUIRED':
      showModal?.({
        title: 'Organización requerida',
        message: 'No se pudo identificar la organización. Volvé a seleccionar una organización.',
      });
      return;

    /* ---------------------------------- 2FA ---------------------------------- */
    case '2FA_REQUIRED':
      showModal?.({
        title: 'Autenticación en dos pasos requerida',
        message: 'Ingresá el código 2FA para continuar.',
      });
      return;
    case '2FA_NOT_CONFIGURED':
      showModal?.({
        title: '2FA no configurado',
        message: 'Configurá 2FA en tu cuenta antes de usar esta función.',
      });
      return;
    case '2FA_INVALID':
      sendToast('error', 'Código 2FA inválido.');
      return;

    /* ------------------------------ Google OAuth ------------------------------ */
    case 'GOOGLE_TOKEN_REQUIRED':
      showModal?.({
        type: 'google',
        title: 'Token de Google requerido',
        message: 'Volvé a iniciar con Google para continuar.',
      });
      return;

    /* --------------------------- Reset / Verify tokens --------------------------- */
    case 'TOKEN_INVALID':
    case 'TOKEN_EXPIRED':
      sendToast('error', 'El enlace ha expirado o no es válido.');
      return;
  }

  // 3) Errores de dominio (toasts: feedback simple y rápido)
  switch (code) {
    /* ------------------------------- Auth básicas ------------------------------- */
    case 'LOGIN_INVALID':
      sendToast('error', 'Credenciales inválidas');
      return;
    case 'AUTH_REQUIRED':
      sendToast('error', 'Necesitás iniciar sesión.');
      return;

    /* --------------------------- Entidades / Recursos --------------------------- */
    case 'USER_NOT_FOUND':
      sendToast('error', 'Usuario no encontrado');
      return;
    case 'EMAIL_DUPLICATE':
    case 'EMAIL_EXISTS':
      // Marcar campo email si hay formulario
      if (typeof setFieldErrors === 'function') setFieldErrors({ email: 'Este correo ya está registrado' });
      else sendToast('error', 'Este correo ya está registrado');
      return;

    case 'ORG_NOT_FOUND':
      sendToast('error', 'Organización no encontrada');
      return;
    case 'ORG_DOMAIN_DUPLICATE':
      if (typeof setFieldErrors === 'function') setFieldErrors({ dominio: 'Este dominio ya está registrado' });
      else sendToast('error', 'El dominio ya está registrado');
      return;

    case 'ROLE_NOT_FOUND':
    case 'ROL_NOT_FOUND':
      sendToast('error', 'Rol no encontrado');
      return;
    case 'PERMISO_NOT_FOUND':
      sendToast('error', 'Permiso no encontrado');
      return;
    case 'MEMBERSHIP_NOT_FOUND':
      sendToast('error', 'Membresía/solicitud no encontrada');
      return;
    case 'MEMBERSHIP_NOT_PENDING':
      sendToast('error', 'La solicitud ya no está pendiente');
      return;
    case 'MEMBERSHIP_NOT_ACTIVE':
      sendToast('error', 'Solo se puede cambiar el rol de miembros activos');
      return;

    /* ------------------------------ Invitaciones ------------------------------ */
    case 'INVITE_EXISTS':
      sendToast('info', 'Ya existe una invitación vigente para ese email');
      return;
    case 'ALREADY_MEMBER':
      sendToast('info', 'El usuario ya es miembro activo de la organización');
      return;
    case 'REQUEST_ALREADY_PENDING':
      sendToast('info', 'Ya existe una solicitud pendiente para esta organización');
      return;
  }

  // 4) Fallbacks: si hay `details` sin VALIDATION_ERROR (poco común), mostrar toast genérico
  if (Array.isArray(details) && details.length && typeof setFieldErrors === 'function') {
    const map = {};
    details.forEach((err) => { map[err.field] = err.message; });
    setFieldErrors(map);
    sendToast('error', message || 'Revisá los campos del formulario.');
    return;
  }

  // 5) Error genérico
  sendToast('error', message || 'Error inesperado');
}
