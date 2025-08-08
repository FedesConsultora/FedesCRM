// src/shared/utils/handleApiError.js

/**
 * Manejo centralizado de errores para FedesCRM Frontend.
 *
 * @param {Object} error - Objeto de error capturado (axios)
 * @param {Function} showToast - Función opcional para mostrar toast (tipo éxito/error)
 * @param {Function} setFieldErrors - Función opcional para setear errores por campo en un formulario
 * @param {Function} showModal - Función opcional para mostrar modales de alerta
 */
export function handleApiError(error, showToast, setFieldErrors, showModal) {
  let message = 'Error inesperado';
  let code = 'ERROR_INTERNO';
  let details = [];
  
  // Si viene de Axios
  if (error.response && error.response.data) {
    const data = error.response.data;
    message = data.message || message;
    code = data.code || code;
    details = data.details || [];
  } else if (error.message) {
    // Si es un error local (JS)
    message = error.message;
  }

  console.error(`❌ API Error [${code}]:`, message, details);

  // --- Manejo de errores por código ---
  switch (code) {
    case 'LOGIN_INVALID':
      showToast?.({ type: 'error', message: 'Credenciales inválidas' });
      return;
    case 'EMAIL_DUPLICATE':
      setFieldErrors?.({ email: 'Este correo ya está registrado' });
      return;
    case 'ACCOUNT_INACTIVE':
      showModal?.({
        title: 'Cuenta inactiva',
        message: 'Debes verificar tu email antes de iniciar sesión.'
      });
      return;
    case 'USER_NOT_FOUND':
      showToast?.({ type: 'error', message: 'Usuario no encontrado' });
      return;
    case 'TOKEN_INVALID':
      showToast?.({ type: 'error', message: 'El enlace ha expirado o no es válido.' });
      return;
    case 'VALIDATION_ERROR':
      if (details.length && setFieldErrors) {
        const formErrors = {};
        details.forEach((err) => {
          formErrors[err.field] = err.message;
        });
        setFieldErrors(formErrors);
      } else {
        showToast?.({ type: 'error', message: 'Errores de validación en el formulario.' });
      }
      return;
    case 'PERMISO_DENEGADO':
      showModal?.({
        title: 'Acceso denegado',
        message: 'No tenés permisos para realizar esta acción.'
      });
      return;
    default:
      // Error genérico
      showToast?.({ type: 'error', message });
      return;
  }
}
