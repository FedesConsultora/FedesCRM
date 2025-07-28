import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load de rutas modulares
const CoreRoutes = lazy(() => import('./modules/core/routes'));
const LeadsRoutes = lazy(() => import('./modules/leads/routes'));
const PropertiesRoutes = lazy(() => import('./modules/properties/routes'));
const MessagingRoutes = lazy(() => import('./modules/messaging/routes'));
const AgendaRoutes = lazy(() => import('./modules/agenda/routes'));
const AutomationRoutes = lazy(() => import('./modules/automation/routes'));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Redirección base */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Inyección de rutas por módulo */}
        <Route path="/*" element={<CoreRoutes />} />
        <Route path="/leads/*" element={<LeadsRoutes />} />
        <Route path="/propiedades/*" element={<PropertiesRoutes />} />
        <Route path="/mensajes/*" element={<MessagingRoutes />} />
        <Route path="/agenda/*" element={<AgendaRoutes />} />
        <Route path="/automatizaciones/*" element={<AutomationRoutes />} />

        {/* Ruta no encontrada */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
