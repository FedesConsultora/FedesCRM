import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas.
 * @param {function} guard - Función que devuelve true/false según si se puede acceder.
 * @param {string} redirectTo - Ruta a la que redirigir si falla el guard.
 * @param {React.ReactNode} children - Componentes hijos a renderizar si pasa el guard.
 */
export default function GuardedRoute({ guard, redirectTo, children }) {
  if (!guard()) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
