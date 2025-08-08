# 🏢 FedesCRM – CRM Inmobiliario Integrado

**FedesCRM** es una plataforma web multi-tenant desarrollada por Fedes Consultora para centralizar la gestión comercial de inmobiliarias, integrando leads, mensajería en tiempo real, propiedades, agenda y automatizaciones.

---

## 🚀 Objetivo

Reducir la dependencia de Excel y herramientas dispersas, logrando:

- Captura y seguimiento unificado de leads desde Meta Ads, WhatsApp, formularios, etc.
- Bandeja de entrada omnicanal (Messenger, Instagram, WhatsApp)
- Panel de propiedades enlazado a cada lead
- Automatizaciones de seguimiento y respuesta
- Dashboard de rendimiento en tiempo real
- **Gestión multi-organización** con control de acceso por roles y permisos
- **Invitaciones y solicitudes de unión** a organizaciones con aprobación/rechazo por administradores

---

## 🧱 Stack Tecnológico

| Capa       | Tecnología                            |
|------------|----------------------------------------|
| Backend    | Node.js + Express                     |
| Frontend   | React.js (CRA)                        |
| DB         | PostgreSQL                            |
| API Meta   | Facebook Graph, Instagram, WhatsApp   |
| Infra      | Docker + Docker Compose               |

---

## 📁 Estructura del Proyecto

### Backend (`/backend`)

- `src/modules/*`: cada módulo contiene:

``` bash
controllers/
models/
routes/
services/
validators/
```

- `src/middlewares/`, `src/utils/`, `src/config/`: compartidos entre módulos

### Frontend (`/frontend`)

- CRA con estructura modular:

``` bash
/modules/
  /core/
    components/
    pages/
    services/
    routes.js
/shared/
  /components/
  /hooks/
  /context/
```

---

## 📦 Módulos

| Módulo           | Descripción                                                                 |
|------------------|-----------------------------------------------------------------------------|
| 1. Core & Tenancy| Multi-tenancy avanzado: organizaciones, usuarios, membresías, invitaciones, roles globales y por organización, control de permisos y seguridad |
| 2. Leads         | Captura, asignación, seguimiento, historial y etiquetas                    |
| 3. Propiedades   | Fichas de propiedades, fotos, documentos, features, relación con leads     |
| 4. Mensajería    | Canales integrados (Meta), inbox, conversaciones, mensajes, adjuntos       |
| 5. Agenda        | Eventos calendarizados, visitas, sincronización con Google Calendar        |
| 6. Automatizaciones | Reglas activas, plantillas, logs, respuestas y recordatorios automáticos |

---

## 🐳 Docker Setup

```bash
docker compose up --build
```

Servicios:

- `db`: PostgreSQL (puerto 5432)
- `backend`: Express API (puerto 4000)
- `frontend`: React (puerto 3000)
- `adminer`: DB admin (puerto 8080)

---

## 📊 Funcionalidades Clave

- Captura automática de leads desde formularios, Meta Ads y mensajería
- Clasificación por tipo de interés y asignación automática
- Historial 360° de cada lead (mensajes, emails, llamadas)
- CRM visual y responsive
- Dashboard interactivo con KPIs: tasa de conversión, ROI, tiempo de respuesta
- Gestión de propiedades con galería, documentos y geolocalización
- Integración nativa con APIs de Meta
- **Gestión multi-organización** con membresías y control de acceso granular
- **Invitaciones y solicitudes de unión** a organizaciones con aprobación y rechazo
- Seguridad por roles y permisos, tanto globales como por organización
- Auditoría de accesos y cambios
- Arquitectura modular y escalable (lista para microservicios)

---

## 📁 Archivos Importantes

- `/docs/Fedes CRM - Requerimientos v1.docx`: Documento base funcional
- `/sql/`: DERs de cada módulo (`Core`, `Leads`, `Propiedades`, etc.)
- `/Dockerfile` + `/docker-compose.yml`: entorno local completo
- `/README.md`: este archivo 😉

---

## 🔀 Flujo de trabajo con Git

Durante la etapa inicial de desarrollo (monousuario), se utilizará un esquema de ramas simple y efectivo:

### 🧱 Ramas base

- `main`: rama **estable y deployable** (solo recibe código probado y funcional).
- `dev`: rama de desarrollo principal. Aquí se agregan y prueban nuevas funcionalidades.

> ⚠️ Mientras el proyecto esté siendo desarrollado por una sola persona, **todo el desarrollo ocurrirá en `dev`**.  
> Luego, se integrará a `main` cuando se alcance una funcionalidad completa y estable.

### 🧩 A futuro: trabajo colaborativo

Cuando se sumen otros desarrolladores, se utilizará el siguiente esquema:

- `feature/<nombre>`: ramas para cada módulo o funcionalidad (ej. `feature/leads-module`).
- Merge a `dev` cuando esté probado.
- Merge de `dev` a `main` para releases.

### 💡 Ejemplo

```bash
# Desarrollo diario
git checkout dev

# Al finalizar una feature puntual
git checkout -b feature/core-auth
# ... trabajar ...
git checkout dev
git merge feature/core-auth
```

---

## 🧑‍💻 Autor

**Enzo Pinotti** – Fedes Consultora  
Contacto: [sistemas@fedes.ai](mailto:sistemas@fedes.ai)

---

> _"Menos Excel. Más conversión. Datos en tiempo real."_ – Visión FedesCRM
