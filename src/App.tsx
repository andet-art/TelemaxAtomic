// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";

// pages
import Home    from "./pages/Home";
import About   from "./pages/About";
import Orders  from "./pages/Orders";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Cart    from "./pages/Cart";

import SignIn from "./pages/SignIn";
import Join   from "./pages/Join";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="telemax-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LanguageProvider>
            <AuthProvider>
              <Routes>
                {/* auth pages: no navbar */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/join"   element={<Join />} />

                {/* all other pages: wrapped in MainLayout (with Navbar) */}
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <MainLayout>
                      <About />
                    </MainLayout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <MainLayout>
                      <Orders />
                    </MainLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <MainLayout>
                      <Contact />
                    </MainLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <MainLayout>
                      <Cart />
                    </MainLayout>
                  }
                />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="adminDashboard"
                  element={
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  }
                />

                <Route
                  path="*"
                  element={
                    <MainLayout>
                      <NotFound />
                    </MainLayout>
                  }
                />
              </Routes>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
