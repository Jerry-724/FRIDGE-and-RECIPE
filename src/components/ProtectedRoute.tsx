// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>로딩 중…</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
