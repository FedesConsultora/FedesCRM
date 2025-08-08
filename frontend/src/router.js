import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './router/PrivateRoute';
import PublicRoute from './router/PublicRoute';
import PublicLayout from './shared/layouts/PublicLayout';
import PrivateLayout from './shared/layouts/PrivateLayout';
import Loading from './shared/components/Loading';

const CoreRoutes = lazy(() => import('./modules/core/routes'));
const LeadsRoutes = lazy(() => import('./modules/leads/routes'));
const PropertiesRoutes = lazy(() => import('./modules/properties/routes'));
const MessagingRoutes = lazy(() => import('./modules/messaging/routes'));
const AgendaRoutes = lazy(() => import('./modules/agenda/routes'));
const AutomationRoutes = lazy(() => import('./modules/automation/routes'));

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading inline  />}>
      <Routes>
        {/* Redirección base */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* --- Páginas públicas --- */}
        <Route
          path="/*" 
          element={
            <PublicRoute>
              <PublicLayout>
                <CoreRoutes />
              </PublicLayout>
            </PublicRoute>
          }
        />

        {/* --- Páginas privadas --- */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <CoreRoutes />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leads/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <LeadsRoutes />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/propiedades/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PropertiesRoutes />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mensajes/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <MessagingRoutes />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agenda/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <AgendaRoutes />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/automatizaciones/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <AutomationRoutes />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Suspense>
  );
}
