# 🖥️ FedesCRM – Frontend

Este documento describe la **arquitectura del frontend** de **FedesCRM**, sus dependencias, estructura de carpetas y convenciones para desarrollo.

---

## 📦 Stack Tecnológico

- **React 19 (CRA)**: Librería principal para la UI
- **React Router 7**: Enrutamiento cliente
- **Axios**: Cliente HTTP con interceptores para JWT
- **Sass**: Estilos modulares y variables globales
- **@react-oauth/google**: Login con Google OAuth2
- **React Icons**: Iconografía en componentes
- **React Context API**: Gestión de sesión y permisos
- **Lottie**: Animaciones ligeras

---

## 📂 Estructura de Carpetas

```bash
/frontend
├── public/               # Archivos estáticos
├── src/
│   ├── api/              # Llamadas a la API (Axios)
│   │   ├── axios.js      # Configuración base Axios + interceptores
│   │   └── core.js       # Endpoints de módulo Core (auth, usuarios, roles)
│   │
│   ├── modules/          # Módulos principales
│   │   ├── core/         # Módulo Core (auth, roles, usuarios)
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── routes.js
│   │   ├── leads/
│   │   ├── properties/
│   │   ├── messaging/
│   │   ├── agenda/
│   │   └── automation/
│   │
│   ├── shared/
│   │   ├── components/   # Botones, inputs, layouts, modales, etc.
│   │   ├── context/      # AuthContext, ToastContext, ModalContext
│   │   └── hooks/        # useAuth, useToast, useModal, etc.
│   │
│   ├── router/           # Configuración de rutas
│   │   ├── index.js      # AppRouter principal (lazy load por módulo)
│   │   ├── PrivateRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── styles/           # Variables globales, mixins, reset, etc.
│   ├── utils/            # Funciones auxiliares (handleApiError, formatters)
│   ├── App.js
│   └── index.js
│
├── .env                  # Configuración (REACT_APP_API_URL, GOOGLE_CLIENT_ID)
└── package.json
```

---

## 🔑 Contextos Globales

### 1️⃣ **AuthContext**

- Maneja el JWT, usuario actual y permisos.
- Guarda el token en `localStorage`.
- Expone métodos: `login(userData)`, `logout()`, `hasPermiso(nombre)`.

### 2️⃣ **ToastContext**

- Sistema de notificaciones globales.
- Función `showToast(message, type)`.

### 3️⃣ **ModalContext**

- Manejo de modales globales.
- Función `showModal({ title, message, onConfirm })`.

---

## 🌐 Comunicación con el Backend

### `src/api/axios.js`

```js
import axios from 'axios';
import { handleApiError } from '../utils/handleApiError';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000
});

// Interceptor JWT
document.addEventListener('authTokenUpdated', () => {
  const token = localStorage.getItem('token');
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    handleApiError(err);
    return Promise.reject(err);
  }
);

export default api;
```

### `src/api/core.js`

```js
import api from './axios';

// --- Auth ---
export const login = (data) => api.post('/core/auth/login', data);
export const register = (data) => api.post('/core/auth/register', data);
export const googleLogin = (data) => api.post('/core/auth/google', data);
export const forgotPassword = (data) => api.post('/core/auth/forgot-password', data);
export const resetPassword = (data) => api.post('/core/auth/reset-password', data);
export const verifyEmail = (data) => api.post('/core/auth/verify-email', data);
export const me = () => api.get('/core/auth/me');

// --- Usuarios ---
export const getUsuarios = () => api.get('/core/usuarios');
export const getUsuario = (id) => api.get(`/core/usuarios/${id}`);
export const createUsuario = (data) => api.post('/core/usuarios', data);
export const updateUsuario = (id, data) => api.patch(`/core/usuarios/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/core/usuarios/${id}`);

// --- Roles ---
export const getRoles = () => api.get('/core/roles');
export const getRol = (id) => api.get(`/core/roles/${id}`);
export const createRol = (data) => api.post('/core/roles', data);
export const updateRol = (id, data) => api.patch(`/core/roles/${id}`, data);
export const deleteRol = (id) => api.delete(`/core/roles/${id}`);
export const assignPermiso = (rolId, permisoId) => api.post(`/core/roles/${rolId}/permisos`, { permisoId });
export const removePermiso = (rolId, permisoId) => api.delete(`/core/roles/${rolId}/permisos/${permisoId}`);

// --- Permisos ---
export const getPermisos = () => api.get('/core/permisos');

// --- Organizaciones ---
export const getOrganizaciones = () => api.get('/core/organizaciones');
export const getOrganizacion = (id) => api.get(`/core/organizaciones/${id}`);
export const createOrganizacion = (data) => api.post('/core/organizaciones', data);
export const updateOrganizacion = (id, data) => api.patch(`/core/organizaciones/${id}`, data);
export const deleteOrganizacion = (id) => api.delete(`/core/organizaciones/${id}`);
```

---

## 🛡️ Rutas Públicas y Privadas

- **PublicRoute**: impide que usuarios logueados accedan a `/login` o `/register`.
- **PrivateRoute**: exige JWT válido y, opcionalmente, un permiso específico.

```jsx
<Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />
<Route path="/dashboard" element={<PrivateRoute><DashboardPage/></PrivateRoute>} />
<Route path="/usuarios" element={<PrivateRoute requiredPermiso="usuarios.ver"><UsuariosPage/></PrivateRoute>} />
```

---

## 📄 Utils Importantes

- **`handleApiError.js`**: Centraliza manejo de errores y muestra toasts o modales.
- **`formatDate.js`**: Formatea fechas en español.
- **`useQueryParams.js`**: Hook para manejar parámetros de URL.

---

## 🧪 Flujo de Autenticación

1. Usuario envía credenciales vía `login()` o `googleLogin()`.
2. Backend responde con JWT y datos del usuario + permisos.
3. `AuthContext` guarda token y usuario.
4. Axios envía automáticamente JWT en cada request.
5. `PrivateRoute` valida sesión y permisos antes de renderizar.

---

## 📧 Google Login

- Configurar `REACT_APP_GOOGLE_CLIENT_ID` en `.env`
- Usar `<GoogleOAuthProvider>` en `index.js`
- Consumir `googleLogin` en el backend tras obtener `idToken`.

---

## 📝 Convenciones

- Variables de estado: `camelCase`
- Componentes: `PascalCase`
- Archivos SCSS: `kebab-case`
- Rutas y permisos: `snake_case` para backend, `camelCase` para frontend.

---

> _"Menos Excel. Más conversión. Datos en tiempo real."_ – **FedesCRM**
