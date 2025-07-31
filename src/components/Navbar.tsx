import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Globe, Zap, Home, Info, ShoppingBag, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
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
    className="absolute pointer-events-none transition-all duration-[2500ms] ease-out opacity-8 hidden 2xl:block"
    style={{
      left: `${mousePosition.x}%`,
      top: `${mousePosition.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" />
    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full blur-3xl animate-pulse opacity-30" />
  </div>
);

// Ultra-sleek floating indicator with improved proportions
const FloatingIndicator = ({ activeIndex, links }: { activeIndex: number; links: any[] }) => {
  if (activeIndex === -1) return null;
  
  return (
    <div 
      className="absolute top-0 bottom-0 rounded-xl transition-all duration-600 ease-out overflow-hidden mx-0.5"
      style={{
        left: `${activeIndex * (100 / links.length)}%`,
        width: `${100 / links.length}%`,
      }}
    >
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/70 via-slate-700/80 to-slate-800/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-purple-500/20 to-pink-500/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
      
      {/* Enhanced border with multiple layers */}
      <div className="absolute inset-0 rounded-xl border border-white/15 shadow-lg shadow-purple-500/8" />
      <div className="absolute inset-0.5 rounded-lg border border-white/8" />
      
      {/* Refined shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-shimmer rounded-xl" />
      
      {/* Inner glow layers */}
      <div className="absolute inset-1 rounded-lg bg-gradient-to-r from-indigo-400/3 via-purple-400/5 to-pink-400/3" />
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
      const newShrink = currentScroll > 20;
      const newShowNavbar = currentScroll < lastScrollY || currentScroll < 10;
      
      // Smooth transitions with minimal delay
      if (newShrink !== shrink) {
        setShrink(newShrink);
      }
      if (newShowNavbar !== showNavbar) {
        setShowNavbar(newShowNavbar);
      }
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

    const handleClickOutside = (e: MouseEvent) => {
      if (showLangDropdown && navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };

    // Optimized event listeners with passive scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [lastScrollY, shrink, showNavbar, showLangDropdown]);

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
        "fixed inset-0 bg-slate-900/75 backdrop-blur-md z-40 transition-all duration-500 xl:hidden",
        open ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setOpen(false)} />

      <header 
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out',
          showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
          // Much thinner navbar heights
          shrink ? 'py-0.5 sm:py-1' : 'py-1 sm:py-1.5 lg:py-2'
        )}
      >
        {/* Ultra-refined glassmorphism background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced glass layers */}
          <div className="absolute inset-0 bg-white/[0.008] backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/94 via-slate-900/90 to-slate-950/94" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/5 via-transparent to-slate-800/5" />
          
          {/* Mouse-following gradient orb */}
          <FloatingOrb mousePosition={mousePosition} />
          
          {/* Subtle animated mesh gradient */}
          <div className="absolute inset-0 opacity-6">
            <div className="absolute top-0 left-1/5 w-48 h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl animate-float" />
            <div className="absolute top-0 right-1/5 w-48 h-48 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 rounded-full blur-3xl animate-float-delayed" />
          </div>
          
          {/* Enhanced border gradients */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/25 to-transparent" />
        </div>

        {/* Container with enhanced spacing */}
        <div className="relative max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex justify-between items-center">
          {/* Compact logo */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 group cursor-pointer z-10" 
            onClick={() => navigateToPage('/')}
          >
            <div className="relative">
              <div className={cn(
                "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/15 group-hover:shadow-purple-500/30 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
                shrink ? "w-6 h-6 sm:w-7 sm:h-7" : "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9"
              )}>
                <span className={cn(
                  "text-white font-black",
                  shrink ? "text-xs sm:text-sm" : "text-sm sm:text-base lg:text-lg"
                )}>T</span>
                {/* Inner glow */}
                <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-md sm:rounded-lg" />
              </div>
              <Zap className={cn(
                "absolute -top-0.5 -right-0.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 drop-shadow-lg",
                shrink ? "w-2.5 h-2.5" : "w-3 h-3 lg:w-3.5 lg:h-3.5"
              )} />
              <Sparkles className={cn(
                "absolute -bottom-0.5 -left-0.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-rotate-12 drop-shadow-lg",
                shrink ? "w-2 h-2" : "w-2.5 h-2.5 lg:w-3 lg:h-3"
              )} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-black bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent tracking-tight",
                shrink ? "text-base sm:text-lg" : "text-lg sm:text-xl lg:text-2xl"
              )}>
                Telemax
              </span>
              <span className={cn(
                "text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block font-medium tracking-wide",
                shrink ? "text-[9px]" : "text-[10px] lg:text-xs"
              )}>
                Excellence Redefined
              </span>
            </div>
          </div>

          {/* Ultra-sleek Desktop Navigation */}
          <nav className="hidden lg:flex">
            <div className="relative bg-slate-900/40 backdrop-blur-2xl rounded-2xl p-1 border border-slate-700/30 shadow-2xl shadow-slate-900/20">
              <FloatingIndicator activeIndex={activeIndex} links={links} />
              
              <div className="relative flex items-center">
                {links.map(({ to, label, icon: Icon }, index) => (
                  <button
                    key={to}
                    onClick={() => navigateToPage(to)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(-1)}
                    className={cn(
                      "relative px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 rounded-xl font-semibold transition-all duration-500 flex items-center gap-2 lg:gap-2.5 group z-10",
                      location.pathname === to
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4 lg:w-4.5 lg:h-4.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    <span className="text-sm lg:text-sm xl:text-base font-semibold tracking-wide">{label}</span>
                    
                    {/* Enhanced hover glow effect */}
                    {hoverIndex === index && location.pathname !== to && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/6 via-purple-500/12 to-pink-500/6 rounded-xl backdrop-blur-sm border border-white/4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Enhanced Desktop Actions with wider buttons */}
          <div className={cn(
            "hidden xl:flex items-center gap-1.5 lg:gap-2 xl:gap-3 transition-all duration-300 ease-out",
            showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Premium Language dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                onMouseEnter={() => setShowLangDropdown(true)}
                className={cn(
                  "gap-2 bg-slate-800/35 hover:bg-slate-700/45 border border-slate-600/35 hover:border-slate-500/45 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-3 lg:px-5 xl:px-6 py-1.5 lg:py-2 rounded-xl relative overflow-hidden group",
                  showLangDropdown && "bg-slate-700/45 border-slate-500/45 text-white"
                )}
              >
                {/* Button background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                <Globe className="w-4 h-4 lg:w-4.5 lg:h-4.5 relative z-10 transition-all duration-300 group-hover:rotate-12" />
                <span className="text-sm font-semibold hidden lg:inline relative z-10">{flags[lang]} {labels[lang]}</span>
                <span className="text-sm font-semibold lg:hidden relative z-10">{flags[lang]}</span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-all duration-300 relative z-10", 
                  showLangDropdown ? "rotate-180 text-purple-400" : "rotate-0"
                )} />
              </Button>
              
              {/* Ultra-premium language dropdown menu */}
              <div 
                className={cn(
                  "absolute top-full right-0 mt-1 min-w-[220px] z-50 transition-all duration-300 ease-out origin-top-right",
                  showLangDropdown 
                    ? "opacity-100 visible scale-100 translate-y-0" 
                    : "opacity-0 invisible scale-95 -translate-y-2 pointer-events-none"
                )}
                onMouseLeave={() => setShowLangDropdown(false)}
              >
                {/* Dropdown container with enhanced styling */}
                <div className="bg-slate-900/98 backdrop-blur-3xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-slate-900/40 overflow-hidden">
                  {/* Subtle header */}
                  <div className="px-4 py-2 border-b border-slate-700/30 bg-slate-800/20">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</span>
                  </div>
                  
                  {/* Language options */}
                  <div className="py-1">
                    {Object.entries(flags).map(([langCode, flag], index) => (
                      <button
                        key={langCode}
                        onClick={() => {
                          if (langCode !== lang) toggleLanguage();
                          setShowLangDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-4 font-medium text-sm relative group",
                          langCode === lang 
                            ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-white border-l-2 border-purple-500/50" 
                            : "text-slate-200 hover:text-white hover:bg-slate-800/40"
                        )}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                          transform: showLangDropdown ? 'translateX(0)' : 'translateX(-10px)',
                          transition: `all 0.3s ease-out ${index * 50}ms`
                        }}
                      >
                        {/* Hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/8 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        
                        <span className="text-xl relative z-10">{flag}</span>
                        <div className="flex flex-col relative z-10">
                          <span className="font-semibold">{labels[langCode as keyof typeof labels]}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            {langCode === 'en' ? 'English' : langCode === 'mk' ? 'Македонски' : 'Shqip'}
                          </span>
                        </div>
                        
                        {/* Active indicator */}
                        {langCode === lang && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                          </div>
                        )}
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Subtle footer gradient */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-pink-500/20" />
                </div>
              </div>
            </div>

            {user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/profile')} 
                  className={cn(
                    "gap-2 bg-slate-800/35 hover:bg-slate-700/45 border-slate-600/35 hover:border-slate-500/45 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-3 lg:px-5 xl:px-6 py-1.5 lg:py-2 rounded-xl text-sm font-semibold group relative overflow-hidden",
                    showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/8 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <User className="w-4 h-4 lg:w-4.5 lg:h-4.5 relative z-10 transition-all duration-300 group-hover:scale-110" />
                  <span className="hidden lg:inline relative z-10">{t('profile')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className={cn(
                    "gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800/25 hover:border-red-700/40 transition-all duration-300 backdrop-blur-2xl px-3 lg:px-5 xl:px-6 py-1.5 lg:py-2 rounded-xl text-sm font-semibold group relative overflow-hidden",
                    showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-400/8 to-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <LogOut className="w-4 h-4 lg:w-4.5 lg:h-4.5 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="hidden lg:inline relative z-10">{t('logout')}</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigateToPage('/signin')}
                  className={cn(
                    "bg-slate-800/35 hover:bg-slate-700/45 border-slate-600/35 hover:border-slate-500/45 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-4 lg:px-6 xl:px-8 py-1.5 lg:py-2 rounded-xl text-sm font-semibold min-w-[80px] lg:min-w-[100px] group relative overflow-hidden",
                    showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-slate-500/15 to-slate-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative z-10">{t('signin')}</span>
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigateToPage('/join')}
                  className={cn(
                    "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-300 hover:scale-105 px-4 lg:px-6 xl:px-8 py-1.5 lg:py-2 rounded-xl text-sm font-bold min-w-[80px] lg:min-w-[100px] group relative overflow-hidden",
                    showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/15 to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative z-10">{t('join')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                </Button>
              </>
            )}
          </div>

          {/* Ultra-compact Mobile menu button */}
          <div className="xl:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-1.5 sm:p-2 rounded-lg bg-slate-800/35 border border-slate-600/35 hover:bg-slate-700/45 transition-all duration-500 backdrop-blur-2xl"
            >
              <div className="relative w-5 h-5 sm:w-5.5 sm:h-5.5">
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
        "fixed inset-0 z-50 xl:hidden transition-all duration-700 ease-out",
        open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        {/* Refined background */}
        <div className="absolute inset-0 bg-slate-950/97 backdrop-blur-3xl">
          {/* Subtle animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/25 via-slate-900 to-pink-950/25" />
          <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-gradient-to-r from-indigo-500/12 via-purple-500/12 to-pink-500/12 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-r from-emerald-500/12 via-teal-500/12 to-cyan-500/12 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div className="relative h-full flex flex-col">
          {/* Thinner mobile header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-700/35">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Telemax</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800/35 transition-colors duration-300"
            >
              <X className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-200" />
            </button>
          </div>

          {/* Thinner mobile navigation */}
          <div className="flex-1 flex flex-col justify-center px-3 sm:px-4 space-y-2.5 sm:space-y-3">
            {links.map(({ to, label, icon: Icon }, index) => (
              <button
                key={to}
                onClick={() => navigateToPage(to)}
                className={cn(
                  "flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl font-semibold transition-all duration-700 group text-left border",
                  location.pathname === to
                    ? "bg-gradient-to-r from-indigo-500/12 via-purple-500/12 to-pink-500/12 text-white border-purple-500/20 shadow-lg shadow-purple-500/8"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/20 border-slate-700/20 hover:border-slate-600/35"
                )}
                style={{ 
                  animationDelay: `${index * 120}ms`,
                  transform: open ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.95)',
                  transition: `all 0.7s ease-out ${index * 120}ms`
                }}
              >
                <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
                <span className="text-lg sm:text-xl font-semibold tracking-wide">{label}</span>
              </button>
            ))}
          </div>

          {/* Thinner mobile actions */}
          <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 border-t border-slate-700/35">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage} 
              className="w-full h-11 sm:h-12 bg-slate-800/35 hover:bg-slate-700/45 border border-slate-600/35 text-slate-200 hover:text-white text-base font-semibold rounded-xl gap-3"
            >
              <Globe className="w-4.5 h-4.5" />
              <span>{flags[lang]} {labels[lang]}</span>
            </Button>

            {user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/profile')} 
                  className="w-full h-11 sm:h-12 bg-slate-800/35 border-slate-600/35 text-slate-200 hover:text-white text-base font-semibold rounded-xl gap-3"
                >
                  <User className="w-4.5 h-4.5" />
                  {t('profile')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="w-full h-11 sm:h-12 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800/25 text-base font-semibold rounded-xl gap-3"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/signin')}
                  className="w-full h-11 sm:h-12 bg-slate-800/35 border-slate-600/35 text-slate-200 hover:text-white text-base font-semibold rounded-xl"
                >
                  {t('signin')}
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigateToPage('/join')}
                  className="w-full h-11 sm:h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/18 text-base font-bold rounded-xl"
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