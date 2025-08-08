# 🔑 Autenticación y Gestión de Sesiones – FedesCRM (Multi-Organización)

Este documento describe el flujo de autenticación y manejo de membresías en **FedesCRM**, que ahora soporta:

- **Usuarios en múltiples organizaciones**
- Roles y permisos **por organización**
- Invitaciones para unirse a organizaciones
- Solicitudes de unión pendientes de aprobación
- Registro de organizaciones nuevas
- Login con Email o Google OAuth
- **2FA opcional**
- Recuperación y reseteo de contraseña
- Tokens temporales (`pendingToken`, `inviteToken`)

---

## ⚙️ Tecnologías usadas

- **JWT**: sesiones sin estado (contiene `orgId` y `roleId` en el payload)
- **Bcrypt**: encriptación de contraseñas
- **Google OAuth**: login social
- **Tokens temporales**: para verificación de email, reset de contraseña e invitaciones
- **Pending Token**: para continuar el registro antes de activar cuenta
- **Nodemailer + Handlebars**: envío de emails con plantillas HTML

---

## 🧱 Flujo de Autenticación y Membresías

### 1️⃣ Registro – Paso 1

**Ruta**: `POST /core/auth/register`

**Flujo**:

1. El usuario envía `nombre, apellido, email, password`.
2. Se crea un usuario **inactivo** (`activo = false`).
3. El backend devuelve un **`pendingToken`** válido por 1 hora.
4. El frontend usará este token para crear o unirse a una organización.

**Ejemplo de respuesta**:

```json
{
  "success": true,
  "message": "Usuario registrado. Continúa con los datos de la empresa o únete a una existente.",
  "pendingToken": "JWT_TEMPORAL"
}
```

---

### 2️⃣ Registro – Paso 2 (Crear Organización)

**Ruta**: `POST /core/auth/register-org`  
**Protección**: `pendingTokenMiddleware`

- El usuario crea una nueva organización y se asigna como **admin**.
- Se genera un token de verificación de email (`EmailVerificationToken`).
- Se envía correo con enlace de verificación.

---

### 3️⃣ Registro – Paso 2 (Unirse a una Organización)

#### Opción 1 – Por invitación

**Ruta**:  

- `POST /core/auth/join-org` → con `pendingToken`  
- `POST /core/auth/join-org-auth` → con `authMiddleware` (usuario activo)

**Flujo**:

- El `inviteToken` se valida.
- Se crea la membresía en `estado = 'activo'`.
- Se envía email de verificación si el usuario aún no está activo.

#### Opción 2 – Por solicitud directa

**Ruta**: `POST /core/orgs/:orgId/join-request`  
**Protección**: `authMiddleware`

**Flujo**:

- Crea una membresía con `estado = 'pendiente'`.
- Notifica a los administradores para que aprueben o rechacen.

---

### 4️⃣ Verificación de Email

**Ruta**: `POST /core/auth/verify-email`

- Recibe `{ token }`.
- Activa el usuario (`activo = true`) y marca el token como usado.
- Envía email de bienvenida.

---

### 5️⃣ Login

**Ruta**: `POST /core/auth/login`

**Flujo**:

- Si el usuario está en **una sola organización**, entra directo.
- Si pertenece a **varias**, devuelve una lista para elegir.
- Los `superadmin_global` no necesitan `orgId` en el JWT.

---

### 6️⃣ Cambio de Organización

**Ruta**: `POST /core/auth/switch-org`

- Devuelve un nuevo JWT con el `orgId` y los permisos correspondientes.

---

### 7️⃣ Google OAuth

**Ruta**: `POST /core/auth/google`

**Flujo**:

- Si el usuario existe, inicia sesión.
- Si no existe:
  - Crea la cuenta.
  - Si no tiene membresías, devuelve `pendingToken` para completar alta.

---

### 8️⃣ 2FA (Autenticación en Dos Pasos)

- **Setup**: `POST /core/auth/2fa/setup`
- **Verificar código**: `POST /core/auth/2fa/verify`
- **Desactivar**: `POST /core/auth/2fa/disable`
- **Login con 2FA**: `POST /core/auth/2fa`

---

### 9️⃣ Recuperación de Contraseña

- **Olvidé mi contraseña**: `POST /core/auth/forgot-password`
- **Resetear contraseña**: `POST /core/auth/reset-password`

---

## 🔐 Middlewares Clave

- **`authMiddleware`**:  
  Valida JWT y carga el usuario con permisos de la organización activa.

- **`pendingTokenMiddleware`**:  
  Permite continuar el registro con `pendingToken` (sin JWT normal).

- **`requirePermiso('permiso')`**:  
  Valida que el rol activo tenga el permiso requerido.

- **`ensureOrgParam`**:  
  Asegura que el `:orgId` de la ruta pertenece al usuario autenticado.

---

## 📌 Ejemplo de Uso en Rutas Protegidas

```js
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../middlewares/permisoMiddleware.js';

router.get(
  '/orgs/:orgId/members',
  authMiddleware,
  requirePermiso('usuarios.ver'),
  controller.listarMiembros
);
```

---

## 🎯 Consejos de Seguridad

1. Usar **HTTPS** en producción.
2. Guardar JWT en **Secure HttpOnly Cookies** o en memoria, nunca en localStorage.
3. Rotar y expirar tokens regularmente.
4. Invalidar tokens cuando se cambie contraseña o email.
5. Limitar intentos de login y aplicar bloqueo temporal.

---

> Con este flujo, FedesCRM soporta registro con email o Google, multi-organización, invitaciones, solicitudes de unión, verificación de correo, 2FA, recuperación de contraseña y control de permisos basado en roles.
