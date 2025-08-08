// src/components/RequireAuth.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default RequireAuth;
