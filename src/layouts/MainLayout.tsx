// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      {/* your navbar */}
      <Navbar />

      {/* the page content */}
      <main className="flex-1 pt-16">   {/* pt-16 if your navbar is fixed-height */}
        <Outlet />
      </main>

      {/* optional footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
