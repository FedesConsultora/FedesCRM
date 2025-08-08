// src/router/PrivateRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../shared/context/AuthProvider';
import Loading from '../shared/components/Loading';

export default function PrivateRoute({ children, requiredPermiso }) {
  const { user, loading, hasPermiso } = useContext(AuthContext);

  if (loading) return <Loading inline />; // Loader solo en el main

  if (!user) return <Navigate to="/login" />;

  if (requiredPermiso && !hasPermiso(requiredPermiso)) {
    return <Navigate to="/403" />;
  }

  return children;
}
