# ❗️ReadMe – Manejo de Errores Globales en FedesCRM

Este documento explica cómo manejar errores de forma consistente en **FedesCRM**,
tanto en el **backend** (creación y propagación de errores) como en el **frontend** (visualización en toasts, modales y formularios).

---

## 🧱 Backend

### 📍 Clase `ApiError`

Ubicación: `src/utils/ApiError.js`

```js
export default class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR_GENERAL') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

### 📍 Middleware de Errores

Ubicación: `src/middlewares/errorHandler.js`

```js
import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  const code = err.code || 'ERROR_INTERNO';

  if (!(err instanceof ApiError)) {
    console.error('❌ Error no manejado:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    details: err.details || undefined
  });
};

export default errorHandler;
```

- Captura errores personalizados (`ApiError`) y errores no manejados.
- Devuelve **siempre** la misma estructura JSON para el frontend.

---

### 📍 Middleware de Validación

Ubicación: `src/middlewares/validateRequest.js`

```js
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    const apiError = new ApiError(
      422,
      'Errores de validación',
      'VALIDATION_ERROR'
    );

    apiError.details = formatted;
    return next(apiError);
  }

  next();
};

export default validateRequest;
```

Este middleware convierte automáticamente errores de `express-validator` en una respuesta consistente para el frontend.

---

### 📦 Estructura de Respuesta de Error

Todas las respuestas de error cumplen el siguiente formato:

```json
{
  "success": false,
  "message": "Descripción clara del error",
  "code": "CÓDIGO_INTERNO",
  "details": [
    { "field": "email", "message": "El email es inválido" }
  ]
}
```

- `code` → usado para manejar errores específicos en el frontend.
- `details` → errores por campo, útil en formularios.

---

## 🌐 Frontend

### 📍 Manejo Centralizado

Se recomienda tener un util `handleApiError.js`:

```js
export const handleApiError = (error, showToast, setFieldErrors, showModal) => {
  const resp = error.response?.data;

  if (!resp) {
    showToast?.('Error de red. Intente nuevamente.');
    return;
  }

  const { message, code, details } = resp;

  // 1️⃣ Errores por campo (formularios)
  if (details && setFieldErrors) {
    const map = {};
    details.forEach(err => { map[err.field] = err.message; });
    setFieldErrors(map);
  }

  // 2️⃣ Códigos específicos para modales
  if (code === 'EMAIL_NO_VERIFICADO') {
    showModal?.({
      title: 'Correo no verificado',
      message: 'Por favor, revisá tu email y verificá tu cuenta.'
    });
    return;
  }

  // 3️⃣ Toast genérico
  showToast?.(message || 'Error inesperado');
};
```

---

### ✅ Ejemplo de uso en el frontend

```js
import { handleApiError } from '../utils/handleApiError';
import { login } from '../api/core';

try {
  const { data } = await login(email, password);
  // manejar login
} catch (error) {
  handleApiError(error, showToast, setFieldErrors, showModal);
}
```

---

## 🎯 Beneficios

- **Consistencia**: siempre la misma estructura en la respuesta.
- **Escalable**: fácil agregar nuevos códigos de error (`code`) para manejar en frontend.
- **User-friendly**: mensajes claros, detalles por campo y feedback visual inmediato.

---

> ⚠️ **Tip**: Documentar los `code` más importantes en un archivo compartido
para que backend y frontend tengan una referencia única.

### 📍 Nuevos códigos de error en flujos multi-organización

Con la implementación de multi-organización, invitaciones y solicitudes de unión, se agregaron nuevos códigos (`code`) que el frontend puede usar para mostrar mensajes específicos:

| Código                     | Descripción                                                       | Ejemplo de uso en frontend |
|----------------------------|-------------------------------------------------------------------|----------------------------|
| `ORG_ACCESS_DENIED`        | El usuario no pertenece a la organización solicitada              | Mostrar modal o redirección a selección de organización |
| `MEMBERSHIP_NOT_FOUND`     | No se encontró la solicitud o membresía                           | Mostrar toast de error y refrescar listado |
| `MEMBERSHIP_NOT_PENDING`   | Se intentó aprobar/rechazar una solicitud que ya no está pendiente| Toast de advertencia       |
| `INVITE_INVALID`           | Invitación inválida o expirada                                    | Modal informando al usuario y opción de pedir nueva invitación |
| `REGISTER_TOKEN_MISSING`   | Falta el `pendingToken` en el flujo de registro o unión            | Redirigir a inicio de registro |
| `NO_ORG_MEMBERSHIP`        | El usuario activo no tiene ninguna organización asignada          | Mostrar pantalla para crear o unirse a una organización |

> 💡 **Tip:** Manejar estos códigos en `handleApiError` permite dar feedback inmediato y guiar al usuario al siguiente paso correcto.
