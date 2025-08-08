// src/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const themes = [
  { id: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  { id: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  { id: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
];

const languages = [
  { id: "en", label: "English", flag: "🇺🇸" },
  { id: "al", label: "Albanian", flag: "🇦🇱" },
  { id: "mk", label: "Macedonian", flag: "🇲🇰" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // For demo, default selections:
  const [selectedTheme, setSelectedTheme] = useState(themes[2]); // system
  const [selectedLang, setSelectedLang] = useState(languages[0]); // English

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Stop propagation to prevent immediate close when clicking dropdown toggles
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {/* Backdrop blur overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/50' 
          : 'bg-background/80 backdrop-blur-md border-b border-border/20'
      }`}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-60" />
        
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-12 h-16">
          {/* Logo with enhanced styling */}
          <a
            href="/"
            className="group relative font-bold text-2xl select-none transition-all duration-300 hover:scale-105"
          >
            <span className="bg-gradient-to-r from-primary via-gold-shine to-amber-rich bg-clip-text text-transparent animate-gradient-x">
              Telemax
            </span>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
            {["Home", "Order", "Contact"].map((item, index) => (
              <li key={item} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <a
                  href={`#${item.toLowerCase()}`}
                  className="group relative px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/5"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -translate-x-1/2" />
                </a>
              </li>
            ))}

            {/* Enhanced Theme selector */}
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
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${themeOpen ? 'rotate-180' : ''}`} />
              </button>
              {themeOpen && (
                <ul className="absolute top-full left-0 mt-2 w-40 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl shadow-black/10 z-50 animate-slide-up">
                  {themes.map((theme, index) => (
                    <li
                      key={theme.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => {
                        setSelectedTheme(theme);
                        setThemeOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl group animate-fade-in-up"
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {theme.icon}
                      </div>
                      <span className="font-medium">{theme.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Enhanced Language selector */}
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
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <ul className="absolute top-full right-0 mt-2 w-44 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl shadow-black/10 z-50 animate-slide-up">
                  {languages.map((lang, index) => (
                    <li
                      key={lang.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl group animate-fade-in-up"
                    >
                      <span className="text-lg transition-transform duration-200 group-hover:scale-110">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
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
              <span className="font-medium">Cart</span>
              <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">2</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>

            <Button
              size="sm"
              className="luxury-gradient rounded-full px-6 py-2 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            >
              Join Premium
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
                {["Home", "Order", "Contact"].map((item, index) => (
                  <li key={item} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                    >
                      <div className="w-1 h-6 bg-gradient-to-b from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                      <span>{item}</span>
                    </a>
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
                      {themes.map((theme, index) => (
                        <li
                          key={theme.id}
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => {
                            setSelectedTheme(theme);
                            setThemeOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl animate-fade-in-up"
                        >
                          {theme.icon}
                          <span className="font-medium">{theme.label}</span>
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
                      {languages.map((lang, index) => (
                        <li
                          key={lang.id}
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => {
                            setSelectedLang(lang);
                            setLangOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl animate-fade-in-up"
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium">{lang.label}</span>
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
                    <span className="font-medium">Cart</span>
                    <span className="ml-auto px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">2</span>
                  </Button>

                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full flex justify-center gap-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Button>

                  <Button
                    size="lg"
                    className="w-full luxury-gradient flex justify-center rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Join
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
      `}</style>
    </>
  );
};

export default Navbar;