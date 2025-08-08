# 📢 ReadMe – Sistema de Toasts (Mensajes Flotantes) – FedesCRM

Este sistema permite mostrar mensajes breves (toasts) en cualquier parte de **FedesCRM** de forma global y con diferentes tipos (`success`, `error`, `info`, etc).

---

## 🚀 ¿Cómo usarlo?

### 1️⃣ Asegurarse de envolver la app con `ToastProvider`

```jsx
import ToastProvider from './context/ToastProvider';

<ToastProvider>
  <AppRouter />
</ToastProvider>
```

Esto permite que cualquier componente hijo pueda disparar toasts.

---

### 2️⃣ Usar el hook `useToast` en cualquier componente

```js
import useToast from '../hooks/useToast';

const { showToast } = useToast();
```

---

### 3️⃣ Mostrar un toast

```js
showToast('Operación exitosa', 'success');
showToast('Ocurrió un error', 'error');
showToast('Información útil', 'info');
```

- Si no pasás el segundo parámetro, se usa `success` por defecto.

---

## 🧱 Archivos involucrados

- `/src/context/ToastProvider.jsx`  
  Define el contexto global, renderiza los `<div className="toast">` y elimina el toast luego de 3-4 segundos.

- `/src/hooks/useToast.js`  
  Hook que consume el contexto y permite llamar a `showToast` desde cualquier componente.

---

## 🎨 Estilos recomendados (SCSS)

```scss
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  z-index: 9999;
}

.toast {
  padding: 0.9rem 1.4rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  animation: fadeIn 0.3s ease, fadeOut 0.3s ease 3.2s;
}

.toast--success { background: #28a745; }
.toast--error   { background: #dc3545; }
.toast--info    { background: #007bff; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

---

## 🛠 Ejemplo de uso real

```js
import useToast from '../hooks/useToast';

export default function DashboardPage() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast('Bienvenido a FedesCRM', 'success');
  }, []);

  return <h1>Dashboard</h1>;
}
```

---

## ✅ Buenas prácticas

- Usar `success` para confirmaciones y acciones exitosas.
- Usar `error` para fallos o validaciones rechazadas.
- Usar `info` para información útil sin bloquear al usuario.
- Evitar toasts muy largos, ser conciso.

---

Con esto, cualquier persona del equipo puede mostrar mensajes flotantes sin necesidad de manejar estados manualmente. 🎉
