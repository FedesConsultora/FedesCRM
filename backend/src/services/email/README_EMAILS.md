# ✉️ Sistema de Emails – FedesCRM

Este directorio contiene el sistema completo de envío de correos de **FedesCRM** mediante plantillas HTML dinámicas con Handlebars.

---

## 📦 Estructura

``` bash
/services/email/
├── index.js              # Método principal `sendTemplate`
├── renderer.js           # Motor de plantillas Handlebars
├── transporter.js        # Configuración SMTP (Nodemailer)
├── theme/default.js      # Variables de marca (colores, logos, nombre)
├── templates/
│   ├── layout.hbs        # Layout principal con header/footer
│   ├── partials/
│   │   ├── header.hbs
│   │   └── footer.hbs
│   └── welcome.hbs       # Ejemplo de plantilla de bienvenida
```

---

## ➕ Cómo agregar una nueva plantilla

1. Crear un nuevo archivo `.hbs` dentro de `templates/`  
   Ejemplo: `verify-email.hbs`

2. Dentro del archivo, usar HTML válido y variables con `{{variable}}`.

3. Usar parciales registrados automáticamente (`{{> header}}`, `{{> footer}}`).

4. Para usar los colores y textos del theme, emplear `{{theme 'clave'}}`.

---

## 🎨 Variables disponibles (`theme/default.js`)

| Clave           | Uso en plantilla              |
|----------------|-------------------------------|
| `brandName`     | Nombre de marca               |
| `logoUrl`       | URL del logo                  |
| `primaryColor`  | Color principal (botón, h1)   |
| `secondaryColor`| Color de acento               |
| `textColor`     | Color de texto principal      |
| `bgColor`       | Fondo general del email       |
| `year`          | Año actual                    |
| `websiteUrl`    | Sitio web                     |
| `copyrightName` | Nombre para el footer         |

---

## 🛠️ Cómo enviar un email

```js
import { sendTemplate } from '../../services/email/index.js';

await sendTemplate({
  to: 'usuario@dominio.com',
  template: 'welcome',     // sin extensión .hbs
  subject: '¡Bienvenido a FedesCRM!',
  vars: {
    name: 'Enzo',
    link: 'https://fedescrm.com/verificar?token=abc123'
  }
});
```

---

## 🧪 Test rápido

Puedes probar con la ruta:

``` bash
GET /test-email
```

Edita el archivo `/src/routes/index.js` para cambiar destino o plantilla.

---

## ✏️ Recomendaciones

- Preferir textos breves y botones llamativos.
- Evitar estilos embebidos complejos.
- Testear en Gmail y Outlook antes de producción.
