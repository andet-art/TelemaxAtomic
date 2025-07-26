import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Globe } from 'lucide-react';

// Mock context hooks - you'll need to implement these
const useLang = () => {
  const [lang, setLang] = useState('en');
  const toggleLanguage = () => {
    const languages = ['en', 'mk', 'al'];
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLang(languages[nextIndex]);
  };
  
  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      orders: 'Orders',
      contact: 'Contact',
      profile: 'Profile',
      signin: 'Sign In',
      join: 'Join',
      logout: 'Logout'
    },
    mk: {
      home: 'Дома',
      about: 'За нас',
      orders: 'Нарачки',
      contact: 'Контакт',
      profile: 'Профил',
      signin: 'Најава',
      join: 'Придружи се',
      logout: 'Одјава'
    },
    al: {
      home: 'Shtëpia',
      about: 'Rreth nesh',
      orders: 'Porositë',
      contact: 'Kontakti',
      profile: 'Profili',
      signin: 'Hyr',
      join: 'Bashkohu',
      logout: 'Dil'
    }
  };
  
  const t = (key) => translations[lang][key] || key;
  
  return { lang, toggleLanguage, t };
};

const useAuth = () => {
  const [user, setUser] = useState(null); // Change to true to test logged in state
  const logout = () => setUser(null);
  return { user, logout };
};

const Button = ({ variant = 'default', className = '', children, onClick, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLang();
  const { user, logout } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShrink(currentScroll > 20);
      setShowNavbar(currentScroll < lastScrollY || currentScroll < 10);
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    // navigate("/signin"); - you'll need react-router-dom
  };

  const scrollToTopAndNavigate = (to) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
    // navigate(to); - you'll need react-router-dom
  };

  const getLanguageFlag = () => {
    const flags = {
      en: '🇺🇸',
      mk: '🇲🇰', 
      al: '🇦🇱'
    };
    return flags[lang];
  };

  const getLanguageLabel = () => {
    const labels = {
      en: 'EN',
      mk: 'МК',
      al: 'AL'
    };
    return labels[lang];
  };

  const links = [
    { to: "/home", label: t("home") },
    { to: "/about", label: t("about") },
    { to: "/orders", label: t("orders") },
    { to: "/contact", label: t("contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm transition-all duration-300 ${
        showNavbar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } ${shrink ? "py-2" : "py-4"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Telemax</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => scrollToTopAndNavigate(link.to)}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">{getLanguageFlag()} {getLanguageLabel()}</span>
          </Button>

          {user ? (
            <>
              <Button
                variant="outline"
                onClick={() => scrollToTopAndNavigate("/profile")}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {t("profile")}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline">
                {t("signin")}
              </Button>
              <Button variant="default">
                {t("join")}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          {open ? (
            <X 
              className="text-gray-600 h-6 w-6 cursor-pointer hover:text-gray-800" 
              onClick={() => setOpen(false)} 
            />
          ) : (
            <Menu 
              className="text-gray-600 h-6 w-6 cursor-pointer hover:text-gray-800" 
              onClick={() => setOpen(true)} 
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pt-4 pb-6 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          {/* Mobile Navigation Links */}
          <div className="space-y-3 mb-6">
            {links.map((link) => (
              <button
                key={link.to}
                onClick={() => scrollToTopAndNavigate(link.to)}
                className="block w-full text-left py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>{getLanguageFlag()} {getLanguageLabel()}</span>
            </Button>

            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => scrollToTopAndNavigate("/profile")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t("profile")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full">
                  {t("signin")}
                </Button>
                <Button variant="default" className="w-full">
                  {t("join")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;