// src/layouts/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    // full‐screen background, centering etc. if you like
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
