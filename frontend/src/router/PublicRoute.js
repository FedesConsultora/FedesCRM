// src/router/PublicRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../shared/context/AuthProvider';
import Loading from '../shared/components/Loading';

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading authCard />; // Loader dentro de tarjeta

  if (user) return <Navigate to="/dashboard" />;

  return children;
}
