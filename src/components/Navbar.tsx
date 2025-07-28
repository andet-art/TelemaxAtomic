import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Globe, Zap, Home, Info, ShoppingBag, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const useLang = () => {
  const [lang, setLang] = useState<'en' | 'mk' | 'al'>('en');
  const toggleLanguage = () => {
    const languages: ('en' | 'mk' | 'al')[] = ['en', 'mk', 'al'];
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLang(languages[nextIndex]);
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      home: 'Home', about: 'About', orders: 'Orders', contact: 'Contact',
      profile: 'Profile', signin: 'Sign In', join: 'Join', logout: 'Logout'
    },
    mk: {
      home: 'Дома', about: 'За нас', orders: 'Нарачки', contact: 'Контакт',
      profile: 'Профил', signin: 'Најава', join: 'Придружи се', logout: 'Одјава'
    },
    al: {
      home: 'Shtëpia', about: 'Rreth nesh', orders: 'Porositë', contact: 'Kontakti',
      profile: 'Profili', signin: 'Hyr', join: 'Bashkohu', logout: 'Dil'
    },
  };

  const t = (key: string) => translations[lang][key] || key;
  return { lang, toggleLanguage, t };
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const logout = () => setUser(null);
  return { user, logout };
};

// Optimized floating orb with reduced intensity
const FloatingOrb = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => (
  <div 
    className="absolute pointer-events-none transition-all duration-[2000ms] ease-out opacity-15 hidden xl:block"
    style={{
      left: `${mousePosition.x}%`,
      top: `${mousePosition.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div className="w-32 h-32 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" />
    <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full blur-3xl animate-pulse opacity-40" />
  </div>
);

// Sleeker floating indicator
const FloatingIndicator = ({ activeIndex, links }: { activeIndex: number; links: any[] }) => {
  if (activeIndex === -1) return null;
  
  return (
    <div 
      className="absolute top-0 bottom-0 rounded-2xl transition-all duration-500 ease-out overflow-hidden mx-0.5"
      style={{
        left: `${activeIndex * (100 / links.length)}%`,
        width: `${100 / links.length}%`,
      }}
    >
      {/* Refined gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/25 to-pink-500/20" />
      
      {/* Subtle border */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 shadow-lg shadow-purple-500/10" />
      
      {/* Refined shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer rounded-2xl" />
      
      {/* Inner glow */}
      <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-400/5 via-purple-400/8 to-pink-400/5" />
    </div>
  );
};

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLang();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shrink, setShrink] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShrink(currentScroll > 30);
      setShowNavbar(currentScroll < lastScrollY || currentScroll < 15);
      setLastScrollY(currentScroll);
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

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigateToPage('/signin');
  };

  const navigateToPage = (to: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
    setShowLangDropdown(false);
    navigate(to);
  };

  const flags = { en: '🇺🇸', mk: '🇲🇰', al: '🇦🇱' };
  const labels = { en: 'EN', mk: 'МК', al: 'AL' };

  const links = [
    { to: '/', label: t('home'), icon: Home },
    { to: '/about', label: t('about'), icon: Info },
    { to: '/orders', label: t('orders'), icon: ShoppingBag },
    { to: '/contact', label: t('contact'), icon: MessageCircle },
  ];

  const activeIndex = links.findIndex(link => link.to === location.pathname);

  return (
    <>
      {/* Mobile backdrop */}
      <div className={cn(
        "fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40 transition-all duration-500 lg:hidden",
        open ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setOpen(false)} />

      <header 
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out',
          showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
          shrink ? 'py-1 sm:py-1.5' : 'py-2 sm:py-3 lg:py-4'
        )}
      >
        {/* Refined glassmorphism background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base glass effect */}
          <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-900/88 to-slate-950/92" />
          
          {/* Mouse-following gradient orb */}
          <FloatingOrb mousePosition={mousePosition} />
          
          {/* Refined animated mesh gradient */}
          <div className="absolute inset-0 opacity-12">
            <div className="absolute top-0 left-1/6 w-64 h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl animate-float" />
            <div className="absolute top-0 right-1/6 w-64 h-64 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 rounded-full blur-3xl animate-float-delayed" />
          </div>
          
          {/* Subtle border gradients */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
        </div>

        {/* Container with better proportions */}
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex justify-between items-center">
          {/* Streamlined logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 lg:gap-4 group cursor-pointer z-10" 
            onClick={() => navigateToPage('/')}
          >
            <div className="relative">
              <div className={cn(
                "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
                shrink ? "w-8 h-8 sm:w-9 sm:h-9" : "w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11"
              )}>
                <span className={cn(
                  "text-white font-black",
                  shrink ? "text-sm sm:text-base" : "text-base sm:text-lg lg:text-xl"
                )}>T</span>
                {/* Inner glow */}
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg sm:rounded-xl" />
              </div>
              <Zap className={cn(
                "absolute -top-0.5 -right-0.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 drop-shadow-lg",
                shrink ? "w-3 h-3" : "w-3.5 h-3.5 lg:w-4 lg:h-4"
              )} />
              <Sparkles className={cn(
                "absolute -bottom-0.5 -left-0.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-rotate-12 drop-shadow-lg",
                shrink ? "w-2.5 h-2.5" : "w-3 h-3 lg:w-3.5 lg:h-3.5"
              )} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-black bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent tracking-tight",
                shrink ? "text-lg sm:text-xl" : "text-xl sm:text-2xl lg:text-3xl"
              )}>
                Telemax
              </span>
              <span className={cn(
                "text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block font-medium tracking-wide",
                shrink ? "text-[10px]" : "text-xs lg:text-sm"
              )}>
                Excellence Redefined
              </span>
            </div>
          </div>

          {/* Sleeker Desktop Navigation */}
          <nav className="hidden lg:flex">
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-full p-1.5 lg:p-2 border border-slate-700/40 shadow-xl shadow-slate-900/30">
              <FloatingIndicator activeIndex={activeIndex} links={links} />
              
              <div className="relative flex items-center">
                {links.map(({ to, label, icon: Icon }, index) => (
                  <button
                    key={to}
                    onClick={() => navigateToPage(to)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(-1)}
                    className={cn(
                      "relative px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 rounded-full font-semibold transition-all duration-500 flex items-center gap-2 lg:gap-3 group z-10",
                      location.pathname === to
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    <span className="text-sm lg:text-base font-semibold tracking-wide">{label}</span>
                    
                    {/* Refined hover glow effect */}
                    {hoverIndex === index && location.pathname !== to && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 via-purple-500/15 to-pink-500/8 rounded-full backdrop-blur-sm border border-white/5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Streamlined Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4">
            {/* Compact Language dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="gap-2 bg-slate-800/40 hover:bg-slate-700/50 border border-slate-600/40 hover:border-slate-500/50 text-slate-200 hover:text-white transition-all duration-500 backdrop-blur-xl px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl"
              >
                <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="text-sm font-semibold hidden lg:inline">{flags[lang]} {labels[lang]}</span>
                <span className="text-sm font-semibold lg:hidden">{flags[lang]}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-500", showLangDropdown && "rotate-180")} />
              </Button>
              
              {/* Refined language dropdown menu */}
              {showLangDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl shadow-slate-900/30 overflow-hidden z-50 min-w-[180px]">
                  {Object.entries(flags).map(([langCode, flag]) => (
                    <button
                      key={langCode}
                      onClick={() => {
                        toggleLanguage();
                        setShowLangDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-slate-200 hover:text-white hover:bg-slate-800/40 transition-all duration-300 flex items-center gap-3 font-medium text-sm"
                    >
                      <span className="text-lg">{flag}</span>
                      <span>{labels[langCode as keyof typeof labels]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/profile')} 
                  className="gap-2 bg-slate-800/40 hover:bg-slate-700/50 border-slate-600/40 hover:border-slate-500/50 text-slate-200 hover:text-white transition-all duration-500 backdrop-blur-xl px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-sm font-semibold"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{t('profile')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/25 border border-red-800/30 hover:border-red-700/50 transition-all duration-500 backdrop-blur-xl px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{t('logout')}</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigateToPage('/signin')}
                  className="bg-slate-800/40 hover:bg-slate-700/50 border-slate-600/40 hover:border-slate-500/50 text-slate-200 hover:text-white transition-all duration-500 backdrop-blur-xl px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl text-sm font-semibold"
                >
                  {t('signin')}
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigateToPage('/join')}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl text-sm font-bold"
                >
                  {t('join')}
                </Button>
              </>
            )}
          </div>

          {/* Compact Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-800/40 border border-slate-600/40 hover:bg-slate-700/50 transition-all duration-500 backdrop-blur-xl"
            >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                <Menu className={cn(
                  "absolute inset-0 text-slate-200 transition-all duration-500",
                  open ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                )} />
                <X className={cn(
                  "absolute inset-0 text-slate-200 transition-all duration-500",
                  open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-700 ease-out",
        open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        {/* Refined background */}
        <div className="absolute inset-0 bg-slate-950/96 backdrop-blur-3xl">
          {/* Subtle animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-pink-950/30" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div className="relative h-full flex flex-col">
          {/* Compact mobile header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Telemax</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-800/40 transition-colors duration-300"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200" />
            </button>
          </div>

          {/* Streamlined mobile navigation */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 space-y-3 sm:space-y-4">
            {links.map(({ to, label, icon: Icon }, index) => (
              <button
                key={to}
                onClick={() => navigateToPage(to)}
                className={cn(
                  "flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl font-semibold transition-all duration-700 group text-left border",
                  location.pathname === to
                    ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-white border-purple-500/25 shadow-lg shadow-purple-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/25 border-slate-700/25 hover:border-slate-600/40"
                )}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transform: open ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transition: `all 0.7s ease-out ${index * 150}ms`
                }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
                <span className="text-lg sm:text-xl font-semibold tracking-wide">{label}</span>
              </button>
            ))}
          </div>

          {/* Compact mobile actions */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 border-t border-slate-700/40">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage} 
              className="w-full h-12 sm:h-14 bg-slate-800/40 hover:bg-slate-700/50 border border-slate-600/40 text-slate-200 hover:text-white text-base font-semibold rounded-xl gap-3"
            >
              <Globe className="w-5 h-5" />
              <span>{flags[lang]} {labels[lang]}</span>
            </Button>

            {user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/profile')} 
                  className="w-full h-12 sm:h-14 bg-slate-800/40 border-slate-600/40 text-slate-200 hover:text-white text-base font-semibold rounded-xl gap-3"
                >
                  <User className="w-5 h-5" />
                  {t('profile')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="w-full h-12 sm:h-14 text-red-400 hover:text-red-300 hover:bg-red-900/25 border border-red-800/30 text-base font-semibold rounded-xl gap-3"
                >
                  <LogOut className="w-5 h-5" />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/signin')}
                  className="w-full h-12 sm:h-14 bg-slate-800/40 border-slate-600/40 text-slate-200 hover:text-white text-base font-semibold rounded-xl"
                >
                  {t('signin')}
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigateToPage('/join')}
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20 text-base font-bold rounded-xl"
                >
                  {t('join')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default Navbar;