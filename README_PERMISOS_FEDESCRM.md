# 🔐 README – Manejo de Permisos y Roles en FedesCRM (Multi-Organización)

Este documento explica cómo gestionar y aplicar permisos por rol en **FedesCRM**, teniendo en cuenta que ahora el sistema soporta **multi-organización**.

---

## 🎭 Conceptos clave

En el modelo actual:

- Un usuario **puede pertenecer a varias organizaciones** mediante la tabla `organization_user`.
- Cada **membresía** en una organización tiene un `rolId` (puede ser distinto en cada organización).
- Los **roles** pueden ser:
  - **Globales** → `organizacion_id = NULL` (ej. `superadmin_global`).
  - **Por organización** → `organizacion_id` con el ID de la organización a la que pertenecen.
- Los **permisos** (`permisos`) se asignan a roles mediante la tabla intermedia `roles_permisos`.

Esto permite que un usuario tenga distintos niveles de acceso en cada organización en la que participa.

---

## 🧱 Estructura de datos

### 📌 Tabla `roles`

```json
[
  { "id": "uuid1", "nombre": "admin", "descripcion": "Administrador de organización", "organizacion_id": "uuid-org" },
  { "id": "uuid2", "nombre": "gerente", "descripcion": "Gerente Comercial", "organizacion_id": "uuid-org" },
  { "id": "uuid3", "nombre": "superadmin_global", "descripcion": "Super Administrador Global", "organizacion_id": null }
]
```

### 📌 Tabla `permisos`

```json
{ "nombre": "usuarios.ver", "descripcion": "USUARIOS - VER" }
```

### 📌 Tabla `roles_permisos`

```json
{ "rol_id": "uuid1", "permiso_id": "uuidA" }
```

### 📌 Tabla `organization_user` (membresías)

```json
{
  "id": "uuid-mem",
  "organizacion_id": "uuid-org",
  "usuario_id": "uuid-user",
  "rol_id": "uuid1",
  "estado": "activo"
}
```

---

## ⚙️ Flujo de carga de permisos

1. Cuando un usuario inicia sesión, se determina la **organización activa** (`orgId` en el JWT).
2. Se busca la membresía activa (`organization_user`) para esa organización.
3. A partir del rol de esa membresía, se cargan todos sus permisos.
4. Si el usuario es `superadmin_global`, puede acceder a rutas globales sin `orgId`.

> 📌 Los permisos que llegan al frontend siempre dependen de la organización activa.

---

## 🧩 Middleware `requirePermiso()`

Ubicación: `/src/middlewares/permisoMiddleware.js`

```js
import ApiError from '../utils/ApiError.js';

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

> 🔹 Se asume que `req.user` es seteado por `authMiddleware` usando `buildUserPayload()`.

---

## 🔐 Ejemplo de uso en rutas

```js
import { requirePermiso } from '../../../middlewares/permisoMiddleware.js';

router.get('/', requirePermiso('usuarios.ver'), controller.listar);
router.post('/', requirePermiso('usuarios.crear'), controller.crear);
```

---

## 📋 Permisos recomendados por módulo

| Módulo           | Ejemplos de permisos                               |
|------------------|----------------------------------------------------|
| Core             | dashboard.ver, settings.gestionar, audit-logs.ver  |
| Usuarios / Roles | usuarios.ver, usuarios.crear, roles.editar         |
| Leads            | leads.ver, leads.crear, leads.editar               |
| Propiedades      | propiedades.ver, propiedades.subir-foto            |
| Mensajería       | mensajes.ver, mensajes.enviar, canales.gestionar   |
| Agenda           | agenda.ver, agenda.crear, agenda.sync              |
| Automatizaciones | automatizaciones.ver, automatizaciones.ejecutar    |
| Reportes         | reportes.exportar                                  |

---

## 🎯 Respuesta de error si no hay permiso

```json
{
  "success": false,
  "message": "No tienes permiso para esta acción",
  "code": "PERMISO_DENEGADO"
}
```

---

## 🛠 Buenas prácticas

- Usar nombres de permisos en formato `modulo.accion`.
- Cargar permisos al iniciar sesión y condicionar la UI del frontend.
- Mantener roles globales solo para administración central.
- Revisar `roles_permisos` al modificar roles para no dejar permisos huérfanos.
- Usar `superadmin_global` solo para mantenimiento y soporte.

---

> ⚡ Con este modelo, FedesCRM permite un control granular de acceso por organización y también permisos globales para administración central.
