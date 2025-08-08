# ⚙️ FedesCRM · Backend

Este directorio contiene el backend de **FedesCRM**, desarrollado con **Node.js + Express** en arquitectura **modular**, diseñado para escalar y organizarse por dominio funcional, con soporte **multi-organización** y control de permisos granular.

---

## 🚀 Tecnologías Principales

- **Node.js** (ES Modules)
- **Express 5** – Framework HTTP
- **PostgreSQL** – Base de datos relacional
- **Sequelize** – ORM con migraciones y seeds
- **JWT** – Autenticación sin estado
- **Nodemailer** – Envío de emails transaccionales
- **Docker Compose** – Entorno de desarrollo
- **express-validator** – Validación de requests
- **Arquitectura modular** – Separación por dominios
- **Manejo centralizado de errores**

---

## 📁 Estructura de Carpetas

```bash
/backend
├── src/
│   ├── config/             # Configuración general (DB, JWT, etc.)
│   ├── middlewares/        # Middlewares globales (auth, permisos, errores)
│   ├── utils/              # Utilidades y helpers
│   ├── services/           # Servicios compartidos (email, storage, etc.)
│   ├── routes/             # Montaje global de rutas por módulo
│   └── modules/            # Módulos funcionales
│       ├── core/           # Autenticación, usuarios, roles, organizaciones
│       ├── leads/          # Gestión de leads
│       ├── properties/     # Propiedades y fotos/documentos
│       ├── messaging/      # Canales, conversaciones, mensajes
│       ├── agenda/         # Eventos y calendario
│       └── automation/     # Automatizaciones y plantillas
├── migrations/             # Migraciones globales (Sequelize CLI)
├── seeders/                # Seeds de datos iniciales
├── Dockerfile              # Configuración backend
└── package.json
```

---

## 🔑 Autenticación y Seguridad

- Registro con email y contraseña
- Login con JWT y Google OAuth
- Verificación de email
- Recuperación y reseteo de contraseña
- Soporte **2FA** (TOTP con Speakeasy)
- Multi-organización con control de acceso por `orgId`
- Middleware de permisos (`requirePermiso`)

Documentación detallada en [`README_AUTH_FEDESCRM.md`](./README_AUTH_FEDESCRM.md)

---

## 🏢 Multi-Organización y Roles

- **Organizaciones**: dominio único, logo, datos generales
- **Membresías**: relación usuario–organización con `rolId` y estado (`activo`, `pendiente`, `invitado`, etc.)
- **Invitaciones**: envío por email con token y expiración
- **Roles por organización** con permisos personalizados
- **Roles globales** para superadmins

Documentación detallada en [`README_PERMISOS_FEDESCRM.md`](./README_PERMISOS_FEDESCRM.md)

---

## 📬 Sistema de Emails

Ubicación: `/src/services/email/`

- Motor Handlebars con layout base y parciales (`header`, `footer`)
- Variables de marca desde `/theme/default.js`
- Plantillas para:
  - Verificación de email
  - Recuperación de contraseña
  - Invitaciones a organizaciones
  - Notificaciones de membresía aprobada/rechazada

---

## 🧩 Manejo Global de Errores

- Clase `ApiError` para errores controlados
- Middleware `errorHandler` con respuesta JSON consistente
- Middleware `validateRequest` para integración con `express-validator`
- Respuesta de error uniforme:

```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "CÓDIGO_INTERNO",
  "details": [ { "field": "email", "message": "Email inválido" } ]
}
```

Documentación detallada en [`README_ERRORS_FEDESCRM.md`](./README_ERRORS_FEDESCRM.md)

---

## 🐳 Docker

### Iniciar entorno local

```bash
docker compose up --build
```

Servicios:

- **db** – PostgreSQL (5432)
- **backend** – API Express (4000)
- **adminer** – UI DB (8080)

### Migraciones y Seeds

```bash
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```

---

## 📌 Estándares de Desarrollo

- **Comentarios de ruta**: cada archivo incluye su ruta relativa al inicio
- **Paranoid deletes** (`deleted_at`) en entidades clave
- **Convención nombres**: `camelCase` en JS, `snake_case` en DB
- **Validadores** con `express-validator` y `validateRequest`
- **Controladores** retornan errores con `next(ApiError)`

---

## 📊 Módulos y Funcionalidad

| Módulo       | Funciones principales |
|--------------|----------------------|
| **Core**     | Auth, usuarios, organizaciones, roles, permisos |
| **Leads**    | Captura, asignación, seguimiento |
| **Properties** | Gestión de propiedades, fotos, documentos |
| **Messaging** | Canales (Meta API), conversaciones, mensajes |
| **Agenda**   | Eventos y sincronización con Google Calendar |
| **Automation** | Reglas, plantillas, logs |

---

## 📜 Licencia

Desarrollo interno Fedes Consultora – Uso restringido
