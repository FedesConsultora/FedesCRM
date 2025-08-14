import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../../router/PrivateRoute';
import PublicRoute from '../../../router/PublicRoute';
import GuardedRoute from '../../../shared/components/GuardedRoute';
import { requirePendingToken, requireEmailRegistrado } from '../utils/routeGuards';

// Pages
import Login from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import RegisterStep1 from '../pages/RegisterStep1';
import VerifyEmail from '../pages/VerifyEmail';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyToken from '../pages/VerifyToken';
import RegisterOrganization from '../pages/RegisterOrganization';

export default function CoreRoutes() {
  return (
    <Routes>
      {/* --- Rutas públicas --- */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Registro multi-step */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterStep1 />
          </PublicRoute>
        }
      />

      <Route
        path="/register/organization"
        element={
          <PublicRoute>
            <GuardedRoute guard={requirePendingToken} redirectTo="/register">
              <RegisterOrganization />
            </GuardedRoute>
          </PublicRoute>
        }
      />

      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <GuardedRoute guard={requireEmailRegistrado} redirectTo="/login">
              <VerifyEmail />
            </GuardedRoute>
          </PublicRoute>
        }
      />

      <Route
        path="/verify/:token"
        element={
          <PublicRoute>
            <VerifyToken />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* --- Ruta privada: Dashboard --- */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
