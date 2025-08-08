// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import RequireAuth from '@/components/RequireAuth';

import MainLayout from './layouts/MainLayout';

// pages
import Home from './pages/Home';
import About from './pages/About';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Signin from './pages/Signin';
import Join from './pages/Join';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="telemax-ui-theme">
        <TooltipProvider />
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              {/* public: no layout */}
              <Route path="signin" element={<Signin />} />
              <Route path="join" element={<Join />} />

              {/* protected: admin dashboard */}
              <Route
                path="adminDashboard"
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />

              {/* everything else inside MainLayout */}
              <Route path="/" element={<MainLayout />}>
                {/* these inherit the layout */}
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="orders" element={<Orders />} />
                <Route path="contact" element={<Contact />} />
                <Route path="cart" element={<Cart />} />

                {/* protected nested routes */}
                <Route
                  path="profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route
                  path="checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />

                {/* 404 fallback for any path under "/" */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
