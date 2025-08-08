// src/components/Navbar.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Globe,
  Bell,
  Home,
  ShoppingBag,
  MessageCircle,
  LogOut,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Language hook with persistence
const useLang = () => {
  const [lang, setLang] = useState<'en' | 'mk' | 'al'>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('telemax-language');
      return (stored as 'en' | 'mk' | 'al') || 'en';
    }
    return 'en';
  });

  const setLanguage = (newLang: 'en' | 'mk' | 'al') => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('telemax-language', newLang);
    }
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      home: 'Home',
      orders: 'Orders', 
      contact: 'Contact',
      profile: 'Profile',
      signin: 'Sign In',
      join: 'Join Premium',
      logout: 'Logout',
      cart: 'Cart',
      language: 'Language',
      theme: 'Theme'
    },
    mk: {
      home: 'Дома',
      orders: 'Нарачки', 
      contact: 'Контакт',
      profile: 'Профил',
      signin: 'Најава',
      join: 'Придружи се',
      logout: 'Одјава',
      cart: 'Кошничка',
      language: 'Јазик',
      theme: 'Тема'
    },
    al: {
      home: 'Shtëpia',
      orders: 'Porositë', 
      contact: 'Kontakti',
      profile: 'Profili',
      signin: 'Hyr',
      join: 'Bashkohu',
      logout: 'Dil',
      cart: 'Shporta',
      language: 'Gjuha',
      theme: 'Tema'
    },
  };

  const t = (key: string) => translations[lang][key] || key;
  return { lang, setLanguage, t };
};

// Theme hook
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('telemax-theme');
      return (stored as 'light' | 'dark' | 'system') || 'system';
    }
    return 'system';
  });

  const setThemeMode = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('telemax-theme', newTheme);
      
      // Apply theme to document
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else if (newTheme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  };

  // Apply theme on mount
  useEffect(() => {
    setThemeMode(theme);
  }, []);

  return { theme, setThemeMode };
};

// Auth hook (mock implementation)
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, logout };
};

const themes = [
  { id: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  { id: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  { id: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
];

const languages = [
  { id: "en", label: "English", flag: "🇺🇸", shortLabel: "EN" },
  { id: "mk", label: "Macedonian", flag: "🇲🇰", shortLabel: "МК" },
  { id: "al", label: "Albanian", flag: "🇦🇱", shortLabel: "AL" },
];

// Floating orb component
const FloatingOrb = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => (
  <div 
    className="absolute pointer-events-none transition-all duration-[2500ms] ease-out opacity-6 hidden 2xl:block"
    style={{
      left: `${mousePosition.x}%`,
      top: `${mousePosition.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div className="w-24 h-24 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 rounded-full blur-3xl animate-pulse" />
    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 rounded-full blur-3xl animate-pulse opacity-40" />
  </div>
);

const Navbar: React.FC = () => {
  const { lang, setLanguage, t } = useLang();
  const { theme, setThemeMode } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const navRef = useRef<HTMLElement>(null);

  // Navigation links
  const links = [
    { to: '/', label: t('home'), icon: Home },
    { to: '/orders', label: t('orders'), icon: ShoppingBag },
    { to: '/contact', label: t('contact'), icon: MessageCircle },
    ...(isAuthenticated ? [{ to: '/profile', label: t('profile'), icon: User }] : [])
  ];

  const activeIndex = links.findIndex(link => link.to === location.pathname);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = () => {
      setThemeOpen(false);
      setLangOpen(false);
    };
    if (themeOpen || langOpen) {
      window.addEventListener("click", handler);
    }
    return () => window.removeEventListener("click", handler);
  }, [themeOpen, langOpen]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const navigateToPage = (to: string) => {
    navigate(to);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const selectedTheme = themes.find(t => t.id === theme) || themes[2];
  const selectedLang = languages.find(l => l.id === lang) || languages[0];

  return (
    <>
      {/* Mobile backdrop */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/50' 
            : 'bg-background/80 backdrop-blur-md border-b border-border/20'
        }`}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-60" />
        
        {/* Floating orb effect */}
        <FloatingOrb mousePosition={mousePosition} />
        
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-12 h-16">
          {/* Enhanced Logo */}
          <div 
            className="flex items-center gap-2 group cursor-pointer" 
            onClick={() => navigateToPage('/')}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 rounded-xl w-8 h-8 flex items-center justify-center shadow-lg group-hover:shadow-amber-700/25 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-white font-black text-base">T</span>
                <div className="absolute inset-0.5 bg-gradient-to-br from-white/15 to-transparent rounded-lg" />
              </div>
              <Zap className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 drop-shadow-lg" />
              <Sparkles className="absolute -bottom-0.5 -left-0.5 w-3 h-3 text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-rotate-12 drop-shadow-lg" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl bg-gradient-to-r from-primary via-gold-shine to-amber-rich bg-clip-text text-transparent animate-gradient-x">
                Telemax
              </span>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block font-medium">
                Premium Collection
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
            {links.map((link, index) => (
              <li key={link.to} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <button
                  onClick={() => navigateToPage(link.to)}
                  className={cn(
                    "group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary/5 flex items-center gap-2",
                    location.pathname === link.to 
                      ? "text-foreground bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <link.icon className="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {location.pathname === link.to && (
                    <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2" />
                  )}
                </button>
              </li>
            ))}

            {/* Theme selector */}
            <li className="relative ml-4" onClick={stopPropagation}>
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  themeOpen 
                    ? 'border-primary/60 bg-primary/10 text-primary shadow-lg shadow-primary/20' 
                    : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className="transition-transform duration-300 hover:rotate-12">
                  {selectedTheme.icon}
                </div>
                <span className="hidden lg:inline text-sm">{selectedTheme.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${themeOpen ? 'rotate-180' : ''}`} />
              </button>
              {themeOpen && (
                <ul className="absolute top-full left-0 mt-2 w-40 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl shadow-black/10 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-border/30 bg-muted/20">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('theme')}</span>
                  </div>
                  {themes.map((themeOption, index) => (
                    <li
                      key={themeOption.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => {
                        setThemeMode(themeOption.id as 'light' | 'dark' | 'system');
                        setThemeOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl group animate-fade-in-up",
                        theme === themeOption.id 
                          ? "bg-primary/10 text-primary border-l-2 border-primary/60" 
                          : "hover:bg-primary/5 text-foreground"
                      )}
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {themeOption.icon}
                      </div>
                      <span className="font-medium">{themeOption.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Language selector */}
            <li className="relative" onClick={stopPropagation}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  langOpen 
                    ? 'border-primary/60 bg-primary/10 text-primary shadow-lg shadow-primary/20' 
                    : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Globe className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
                <span className="text-sm">{selectedLang.flag}</span>
                <span className="hidden lg:inline text-sm">{selectedLang.shortLabel}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <ul className="absolute top-full right-0 mt-2 w-44 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl shadow-black/10 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-border/30 bg-muted/20">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('language')}</span>
                  </div>
                  {languages.map((language, index) => (
                    <li
                      key={language.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => {
                        setLanguage(language.id as 'en' | 'mk' | 'al');
                        setLangOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl group animate-fade-in-up",
                        lang === language.id 
                          ? "bg-primary/10 text-primary border-l-2 border-primary/60" 
                          : "hover:bg-primary/5 text-foreground"
                      )}
                    >
                      <span className="text-lg transition-transform duration-200 group-hover:scale-110">{language.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{language.shortLabel}</span>
                        <span className="text-xs text-muted-foreground">{language.label}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Enhanced Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="relative p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-medium">{t('cart')}</span>
              <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">2</span>
            </Button>

            {isAuthenticated ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigateToPage('/signin')}
                className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                <User className="w-4 h-4 mr-2" />
                {t('signin')}
              </Button>
            )}

            <Button
              size="sm"
              className="luxury-gradient rounded-full px-6 py-2 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            >
              {t('join')}
            </Button>
          </div>

          {/* Enhanced Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative p-2 rounded-lg text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-110"
            aria-label="Toggle Menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-1' : ''
              }`} />
              <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`absolute top-4.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-1' : ''
              }`} />
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl animate-slide-down">
            <div className="max-h-96 overflow-y-auto">
              <ul className="flex flex-col gap-2 p-6 text-lg font-medium">
                {links.map((link, index) => (
                  <li key={link.to} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                    <button
                      onClick={() => navigateToPage(link.to)}
                      className={cn(
                        "group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full text-left",
                        location.pathname === link.to 
                          ? "text-foreground bg-primary/10" 
                          : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                      )}
                    >
                      {location.pathname === link.to && (
                        <div className="w-1 h-6 bg-gradient-to-b from-primary/0 via-primary to-primary/0 rounded-full" />
                      )}
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}

                {/* Mobile Theme selector */}
                <li className="relative mt-4" onClick={stopPropagation}>
                  <button
                    onClick={() => setThemeOpen(!themeOpen)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all duration-300 ${
                      themeOpen 
                        ? 'border-primary/60 bg-primary/10 text-primary' 
                        : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="transition-transform duration-300">
                      {selectedTheme.icon}
                    </div>
                    <span className="flex-1 text-left font-medium">{selectedTheme.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${themeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {themeOpen && (
                    <ul className="mt-2 w-full bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl">
                      {themes.map((themeOption, index) => (
                        <li
                          key={themeOption.id}
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => {
                            setThemeMode(themeOption.id as 'light' | 'dark' | 'system');
                            setThemeOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl animate-fade-in-up",
                            theme === themeOption.id 
                              ? "bg-primary/10 text-primary border-l-2 border-primary/60" 
                              : "hover:bg-primary/5"
                          )}
                        >
                          {themeOption.icon}
                          <span className="font-medium">{themeOption.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Mobile Language selector */}
                <li className="relative" onClick={stopPropagation}>
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all duration-300 ${
                      langOpen 
                        ? 'border-primary/60 bg-primary/10 text-primary' 
                        : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-lg">{selectedLang.flag}</span>
                    <span className="flex-1 text-left font-medium">{selectedLang.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {langOpen && (
                    <ul className="mt-2 w-full bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl">
                      {languages.map((language, index) => (
                        <li
                          key={language.id}
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => {
                            setLanguage(language.id as 'en' | 'mk' | 'al');
                            setLangOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl animate-fade-in-up",
                            lang === language.id 
                              ? "bg-primary/10 text-primary border-l-2 border-primary/60" 
                              : "hover:bg-primary/5"
                          )}
                        >
                          <span className="text-lg">{language.flag}</span>
                          <span className="font-medium">{language.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border/30">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full flex justify-center gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-medium">{t('cart')}</span>
                    <span className="ml-auto px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">2</span>
                  </Button>

                  {isAuthenticated ? (
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full flex justify-center gap-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('logout')}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={() => navigateToPage('/signin')}
                      className="w-full flex justify-center gap-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <User className="w-5 h-5" />
                      {t('signin')}
                    </Button>
                  )}

                  <Button
                    size="lg"
                    className="w-full luxury-gradient flex justify-center rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {t('join')}
                  </Button>
                </div>
              </ul>
            </div>
          </div>
        )}
      </nav>

      {/* Add required CSS for animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Custom luxury gradient */
        .luxury-gradient {
          background: linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%);
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        /* Custom utilities for better theme compatibility */
        .dark .luxury-gradient {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%);
          background-size: 200% 200%;
        }
      `}</style>
    </>
  );
};

export default Navbar;