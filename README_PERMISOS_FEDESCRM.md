# 🔐 README – Manejo de Permisos y Roles en FedesCRM

Este documento explica cómo gestionar y aplicar permisos por rol en **FedesCRM**, incluyendo cómo proteger rutas en el backend y cómo consumir esta información desde el frontend.

---

## 🎭 ¿Cómo funciona el sistema de roles y permisos?

Cada usuario tiene un `rolId` que determina su nivel de acceso.  
Cada `Rol` tiene múltiples `Permisos` relacionados mediante la tabla intermedia `roles_permisos`.

- **roles** → Admin, Gerente, Agente, Marketing
- **permisos** → Acciones atómicas como `usuarios.ver`, `leads.crear`, `agenda.editar`
- **roles_permisos** → Define qué permisos tiene cada rol

---

## 🧱 Estructura de datos

### 📌 Tabla `roles`

```json
[
  { "id": "uuid1", "nombre": "admin", "descripcion": "Súper Administrador" },
  { "id": "uuid2", "nombre": "gerente", "descripcion": "Gerente Comercial" },
  { "id": "uuid3", "nombre": "agente", "descripcion": "Agente Inmobiliario" },
  { "id": "uuid4", "nombre": "marketing", "descripcion": "Mkt & Automatización" }
]
```

### 📌 Tabla `permisos`

Ejemplo de estructura:

```json
{ "nombre": "leads.crear", "descripcion": "LEADS - CREAR" }
```

### 📌 Tabla intermedia `roles_permisos`

```json
{ "rol_id": "uuid1", "permiso_id": "uuidA", "asignado_en": "2025-07-28" }
```

---

## 🧩 Middleware `requirePermiso()`

Ubicación: `/src/middlewares/permisoMiddleware.js`

```js
import ApiError from '../utils/ApiError.js';
import { Permiso, Rol } from '../modules/core/models/index.js';

export const requirePermiso = (permiso) => async (req, _res, next) => {
  try {
    const permisos = req.user?.permisos || [];
    if (!permisos.includes(permiso)) {
      throw new ApiError(403, 'No tienes permiso para esta acción', 'PERMISO_DENEGADO');
    }
    next();
  } catch (err) {
    next(err);
  }
};
```

> 🔹 Se asume que `req.user` es seteado por `authMiddleware` y contiene `permisos`.

---

## 🔐 Cómo usar en rutas

Ejemplo en `/src/modules/core/routes/usuarioRoutes.js`:

```js
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

router.get('/', requirePermiso('usuarios.ver'), controller.listar);
router.post('/', requirePermiso('usuarios.crear'), controller.crear);
router.patch('/:id', requirePermiso('usuarios.editar'), controller.actualizar);
router.delete('/:id', requirePermiso('usuarios.eliminar'), controller.eliminar);
```

---

## 📋 Permisos recomendados por módulo

| Módulo           | Ejemplos de permisos                        |
|------------------|---------------------------------------------|
| Core             | dashboard.ver, settings.gestionar, audit-logs.ver |
| Usuarios / Roles | usuarios.ver, usuarios.crear, roles.editar  |
| Leads            | leads.ver, leads.crear, leads.editar        |
| Propiedades      | propiedades.ver, propiedades.subir-foto     |
| Mensajería       | mensajes.ver, mensajes.enviar, canales.gestionar |
| Agenda           | agenda.ver, agenda.crear, agenda.sync       |
| Automatizaciones | automatizaciones.ver, automatizaciones.ejecutar |
| Reportes         | reportes.exportar                           |

---

## 🎯 Cómo llega al frontend

Si un usuario no tiene permiso para una ruta:

```json
{
  "success": false,
  "message": "No tienes permiso para esta acción",
  "code": "PERMISO_DENEGADO"
}
```

El frontend debe usar `handleApiError` para mostrar un **toast** o **modal** según corresponda.

Además, al iniciar sesión, el backend envía:

```json
{
  "id": "uuid-user",
  "email": "admin@fedes.ai",
  "rol": "admin",
  "permisos": ["usuarios.ver", "roles.ver", "leads.*"]
}
```

Esto permite ocultar botones o secciones en el frontend según permisos.

---

## 🧪 Debug

1. Verificar `req.user` en el backend (populado por `authMiddleware`).
2. Revisar la tabla `roles_permisos` para asegurarse de que el rol tiene el permiso requerido.
3. Confirmar que el frontend recibe `permisos` en `/auth/me`.

---

## 🛠 Sugerencias

- Usar nombres de permiso `modulo.accion` simples y consistentes.
- Cargar permisos al iniciar sesión para condicionar la UI.
- Centralizar la verificación de permisos en el middleware `requirePermiso()`.

---

> ⚡ Consejo: Mantené los permisos claros y segmentados para que roles como `marketing` o `agente` solo vean lo que necesitan.
