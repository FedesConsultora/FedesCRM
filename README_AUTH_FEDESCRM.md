# 🔑 README – Autenticación y Gestión de Sesiones en FedesCRM

Este documento explica el flujo completo de autenticación en **FedesCRM**, incluyendo:

- Registro de usuarios
- Login con email y contraseña
- Login con Google OAuth
- Verificación de correo electrónico
- Recuperación y reseteo de contraseña
- Middleware de autenticación y autorización

---

## ⚙️ Tecnologías usadas

- **JWT (JSON Web Token)** para sesiones sin estado
- **Bcrypt** para encriptación de contraseñas
- **Google OAuth** para login social
- **Email Verification & Password Reset** mediante tokens temporales

---

## 🧱 Flujo de Autenticación

### 1️⃣ Registro

**Ruta**: `POST /auth/register`

**Flujo**:

1. El usuario envía `nombre, apellido, email, password, organizacionId`.
2. Se crea un usuario **inactivo** (`activo = false`).
3. Se genera un `EmailVerificationToken` válido por 24h.
4. Se envía un correo con el link de verificación.

**Respuesta**:

```json
{
  "success": true,
  "message": "Usuario registrado. Revisa tu email para verificar tu cuenta."
}
```

---

### 2️⃣ Verificación de Email

**Ruta**: `POST /auth/verify-email`

- Recibe `{ token }`.
- Si el token es válido y no está expirado:
  - Activa la cuenta (`activo = true`).
  - Marca el token como `usado = true`.

**Respuesta**:

```json
{
  "success": true,
  "message": "Email verificado correctamente"
}
```

---

### 3️⃣ Login con Email y Contraseña

**Ruta**: `POST /auth/login`

**Flujo**:

1. Se valida el usuario y contraseña (con `bcrypt.compare`).
2. Si está activo, se genera un **JWT** válido por 12h.
3. Se retorna el token y la información del usuario, incluyendo su rol y permisos.

**Respuesta**:

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "email": "admin@fedes.ai",
    "rol": "admin",
    "permisos": ["usuarios.ver", "roles.ver", "leads.ver"]
  }
}
```

---

### 4️⃣ Login con Google OAuth

**Ruta**: `POST /auth/google`

**Flujo**:

1. El frontend obtiene un `credential` desde `@react-oauth/google`.
2. Envía al backend `googleId, email, nombre, apellido`.
3. Si no existe el usuario, se crea uno con `proveedor = 'google'` y `activo = true`.
4. Devuelve un JWT igual que el login normal.

> 🔹 **Frontend** usa `<GoogleOAuthProvider>` para obtener la credencial y luego hace un `POST` al backend.

---

### 5️⃣ Olvidé mi contraseña

**Ruta**: `POST /auth/forgot-password`

**Flujo**:

1. El usuario envía su `email`.
2. Se crea un `PasswordResetToken` válido por 1h.
3. Se envía un correo con el link para resetear la contraseña.

**Respuesta**:

```json
{
  "success": true,
  "message": "Se envió el enlace para recuperar la contraseña"
}
```

---

### 6️⃣ Resetear Contraseña

**Ruta**: `POST /auth/reset-password`

**Flujo**:

1. Recibe `{ token, newPassword }`.
2. Verifica el `PasswordResetToken` (no usado y vigente).
3. Cambia la contraseña del usuario y marca el token como `usado = true`.

**Respuesta**:

```json
{
  "success": true,
  "message": "Contraseña actualizada correctamente"
}
```

---

## 🧩 Middleware de Autenticación

Ubicación: `src/middlewares/authMiddleware.js`

```js
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { Usuario, Rol, Permiso } from '../modules/core/models/index.js';

export const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'No se encontró el token', 'AUTH_NO_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Usuario.findByPk(payload.id, {
      include: { model: Rol, as: 'rol', include: { model: Permiso } }
    });

    if (!user) throw new ApiError(401, 'Usuario no encontrado', 'AUTH_USER_NOT_FOUND');

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol?.nombre,
      permisos: user.rol?.Permisos?.map(p => p.nombre) || []
    };

    next();
  } catch (err) {
    next(new ApiError(401, 'Token inválido o expirado', 'AUTH_INVALID_TOKEN'));
  }
};
```

---

## 🔐 Uso en Rutas Protegidas

```js
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { requirePermiso } from '../../middlewares/permisoMiddleware.js';

router.get('/usuarios', authMiddleware, requirePermiso('usuarios.ver'), listarUsuarios);
router.post('/usuarios', authMiddleware, requirePermiso('usuarios.crear'), crearUsuario);
```

---

## 🎯 Consejos de Seguridad

1. Usar `HTTPS` en producción para proteger el JWT.
2. Almacenar el JWT en **Memory** o **Secure HttpOnly Cookie**.
3. Rotar tokens y manejar expiración (`expiresIn`) correctamente.
4. Invalidar tokens si se cambia la contraseña (`passwordChangedAt`).

---

> 🧠 Con este flujo, FedesCRM soporta registro con email, autenticación con Google, verificación de correo, recuperación de contraseña y control de permisos basado en roles.
