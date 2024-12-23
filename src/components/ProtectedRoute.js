// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Muestra un indicador de carga mientras se verifica el estado
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
