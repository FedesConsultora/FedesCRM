# 🪟 ModalProvider – Sistema de Modales Globales en FedesCRM

Este documento describe el uso del sistema de **modales globales** en **FedesCRM**, cómo invocarlos desde cualquier parte de la aplicación y cómo extenderlos para nuevos casos de uso.

---

## ✅ ¿Qué permite?

- Mostrar un modal global desde cualquier componente.
- Controlar modales de confirmación, alertas e interacción con usuarios.
- Reutilizar un único estado global en lugar de manejar modales locales en cada página.

---

## 📦 Estructura

src/
├── context/
│   └── ModalProvider.jsx
├── hooks/
│   └── useModal.js
└── components/
    └── ResendConfirmationModal.jsx

- **ModalProvider.jsx** → Contiene el contexto y la UI del modal global.
- **useModal.js** → Hook para acceder a `showModal()` y `closeModal()`.
- **ResendConfirmationModal.jsx** → Ejemplo de modal personalizado (reenvío de correo).

---

## 🛠 Instalación en la App

1. Envolver la app con el **provider** en `App.js`:

```jsx
import ModalProvider from './context/ModalProvider';

function App() {
  return (
    <ModalProvider>
      <AppRouter />
    </ModalProvider>
  );
}
```

## 2. Importar el hook donde necesites mostrar un modal

```jsx
import useModal from '../hooks/useModal';

const { showModal, closeModal } = useModal();
```

---

## 🎯 Ejemplos de Uso

### 🔹 Modal informativo

```js
showModal({
  title: 'Sesión expirada',
  message: 'Iniciá sesión nuevamente para continuar.',
});
```

### 🔹 Modal de confirmación

```js
showModal({
  type: 'confirm',
  title: '¿Eliminar usuario?',
  message: 'Esta acción no se puede deshacer.',
  onConfirm: () => {
    console.log('Usuario eliminado');
  },
  onCancel: () => {
    console.log('Acción cancelada');
  }
});
```

En `ModalProvider.jsx` se renderiza dinámicamente un bloque con botones Sí y No para `type: 'confirm'`.

### 🔹 Modal con acción especial (Reenviar correo)

```js
showModal({
  type: 'resend',
  title: 'Cuenta no verificada',
  message: 'Te enviamos un email para verificar tu cuenta.',
  email: 'usuario@dominio.com',
});
```

Esto renderiza el componente `ResendConfirmationModal` para manejar el reenvío automático.

---

## 🧩 Extender con nuevos tipos

Para agregar un nuevo modal, por ejemplo `type: 'google'`:

1. Invocar el modal con un nuevo type:

```js
showModal({
  type: 'google',
  title: 'Iniciá sesión con Google',
  message: 'Usá tu cuenta de Google para continuar.',
});
```

## 2. Editar `ModalProvider.jsx`

```jsx
{modal.type === 'google' && (
  <div className="modal-actions">
    <button
      type="button"
      className="google-btn"
      onClick={() => (window.location = '/api/auth/google')}
    >
      Iniciar con Google
    </button>
  </div>
)}
```

---

## 📦 API de showModal

```js
showModal({
  type: 'info' | 'confirm' | 'resend' | 'google',
  title: 'Título del modal',
  message: 'Mensaje principal',
  email: 'opcional@correo.com',
  onConfirm: () => {},  // Para modales de confirmación
  onCancel: () => {},   // Para modales de confirmación
});
```

---

## ✅ Cierre manual

```js
const { closeModal } = useModal();
closeModal();
```

---

## 🧼 Buenas prácticas

- Usar `showModal` para alertas críticas o confirmaciones.
- Para errores simples, usar toasts en lugar de modales.
- Reutilizar `type` para estandarizar la UX.
- Siempre invocar `closeModal()` tras la acción principal del modal.

Con este sistema, cualquier parte de **FedesCRM** puede mostrar un modal consistente y estilizado sin repetir lógica. 🎉
