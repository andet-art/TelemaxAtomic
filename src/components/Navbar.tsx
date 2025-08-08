import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Globe, Zap, Home, ShoppingBag, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const useLang = () => {
  // Initialize with stored language or default to 'en'
  const [lang, setLang] = useState<'en' | 'mk' | 'al'>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('telemax-language');
      return (stored as 'en' | 'mk' | 'al') || 'en';
    }
    return 'en';
  });

  const toggleLanguage = () => {
    const languages: ('en' | 'mk' | 'al')[] = ['en', 'mk', 'al'];
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLang = languages[nextIndex];
    setLang(newLang);
    
    // Persist language selection
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('telemax-language', newLang);
    }
  };

  const setLanguage = (newLang: 'en' | 'mk' | 'al') => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('telemax-language', newLang);
    }
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      home: 'Home', orders: 'Orders', contact: 'Contact',
      profile: 'Profile', signin: 'Sign In', join: 'Join', logout: 'Logout'
    },
    mk: {
      home: 'Дома', orders: 'Нарачки', contact: 'Контакт',
      profile: 'Профил', signin: 'Најава', join: 'Придружи се', logout: 'Одјава'
    },
    al: {
      home: 'Shtëpia', orders: 'Porositë', contact: 'Kontakti',
      profile: 'Profili', signin: 'Hyr', join: 'Bashkohu', logout: 'Dil'
    },
  };

  const t = (key: string) => translations[lang][key] || key;
  return { lang, toggleLanguage, setLanguage, t };
};

// Enhanced useAuth hook with proper authentication state management
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    // Note: Using memory storage instead of localStorage for Claude artifacts
    // In a real app, replace with your actual auth logic
    const userData = null; // Mock user data
    const authToken = null; // Mock auth token
    
    if (userData && authToken) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    // In real app: localStorage.setItem('user', JSON.stringify(userData));
    // In real app: localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // In real app: localStorage.removeItem('user');
    // In real app: localStorage.removeItem('authToken');
  };

  return { user, isAuthenticated, login, logout };
};

// Professional floating orb with sophisticated colors - theme compatible
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

// Professional floating indicator with sophisticated styling - theme compatible
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
      {/* Professional gradient background - theme compatible */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 dark:from-slate-700/80 dark:via-slate-600/90 dark:to-slate-700/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-700/10 via-orange-700/15 to-red-800/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-white/3" />
      
      {/* Enhanced border with professional colors */}
      <div className="absolute inset-0 rounded-xl border border-amber-600/20 shadow-lg shadow-amber-800/8" />
      <div className="absolute inset-0.5 rounded-lg border border-white/6" />
      
      {/* Refined shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shimmer rounded-xl" />
      
      {/* Inner glow layers */}
      <div className="absolute inset-1 rounded-lg bg-gradient-to-r from-amber-600/2 via-orange-600/4 to-red-700/2" />
    </div>
  );
};

const Navbar = () => {
  const { lang, toggleLanguage, setLanguage, t } = useLang();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Shrink navbar after 50px scroll
      setShrink(scrollTop > 50);
      
      // Calculate opacity: fade out gradually starting from 100px scroll
      const fadeStart = 100;
      const fadeEnd = 300;
      
      if (scrollTop <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollTop >= fadeEnd) {
        setScrollOpacity(0.85); // Minimum opacity of 0.85 (slight fade)
      } else {
        // Gradual fade between fadeStart and fadeEnd
        const fadeProgress = (scrollTop - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(1 - (fadeProgress * 0.15)); // Fade by max 15%
      }
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
  }, [showLangDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navigateToPage = (to: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
    setShowLangDropdown(false);
    navigate(to);
  };

  const flags = { en: '🇺🇸', mk: '🇲🇰', al: '🇦🇱' };
  const labels = { en: 'EN', mk: 'МК', al: 'AL' };

  // Updated links without about section
  const links = [
    { to: '/', label: t('home'), icon: Home },
    { to: '/orders', label: t('orders'), icon: ShoppingBag },
    { to: '/contact', label: t('contact'), icon: MessageCircle },
    ...(isAuthenticated ? [{ to: '/profile', label: t('profile'), icon: User }] : [])
  ];

  const activeIndex = links.findIndex(link => link.to === location.pathname);

  return (
    <>
      {/* Mobile backdrop */}
      <div className={cn(
        "fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40 transition-all duration-500 xl:hidden",
        open ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setOpen(false)} />

      <header 
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out',
          // Professional navbar heights with scroll effects
          shrink ? 'py-1 sm:py-1.5' : 'py-2 sm:py-3 lg:py-4'
        )}
        style={{
          opacity: scrollOpacity,
          transform: shrink ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {/* Professional glassmorphism background - theme compatible */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced glass layers with professional colors - theme compatible */}
          <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/96 via-slate-900/94 to-slate-950/96 dark:from-slate-950/98 dark:via-slate-900/96 dark:to-slate-950/98" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/4 via-transparent to-slate-800/4" />
          
          {/* Mouse-following gradient orb */}
          <FloatingOrb mousePosition={mousePosition} />
          
          {/* Professional animated mesh gradient - theme compatible */}
          <div className="absolute inset-0 opacity-4">
            <div className="absolute top-0 left-1/5 w-48 h-48 bg-gradient-to-r from-amber-700 via-orange-700 to-red-800 rounded-full blur-3xl animate-float" />
            <div className="absolute top-0 right-1/5 w-48 h-48 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 rounded-full blur-3xl animate-float-delayed" />
          </div>
          
          {/* Enhanced border gradients - theme compatible */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/20 to-transparent" />
        </div>

        {/* Container with enhanced spacing */}
        <div className="relative max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex justify-between items-center">
          {/* Professional logo */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 group cursor-pointer z-10" 
            onClick={() => navigateToPage('/')}
          >
            <div className="relative">
              <div className={cn(
                "bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-amber-700/15 group-hover:shadow-amber-700/25 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
                shrink ? "w-6 h-6 sm:w-7 sm:h-7" : "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9"
              )}>
                <span className={cn(
                  "text-white font-black",
                  shrink ? "text-xs sm:text-sm" : "text-sm sm:text-base lg:text-lg"
                )}>T</span>
                {/* Inner glow */}
                <div className="absolute inset-0.5 bg-gradient-to-br from-white/15 to-transparent rounded-md sm:rounded-lg" />
              </div>
              <Zap className={cn(
                "absolute -top-0.5 -right-0.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 drop-shadow-lg",
                shrink ? "w-2.5 h-2.5" : "w-3 h-3 lg:w-3.5 lg:h-3.5"
              )} />
              <Sparkles className={cn(
                "absolute -bottom-0.5 -left-0.5 text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-rotate-12 drop-shadow-lg",
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
                Premium Collection
              </span>
            </div>
          </div>

          {/* Professional Desktop Navigation */}
          <nav className="hidden lg:flex">
            <div className="relative bg-slate-900/50 dark:bg-slate-800/50 backdrop-blur-2xl rounded-2xl p-1 border border-slate-700/40 dark:border-slate-600/40 shadow-2xl shadow-slate-900/25">
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
                        : "text-slate-300 hover:text-white dark:text-slate-200 dark:hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4 lg:w-4.5 lg:h-4.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    <span className="text-sm lg:text-sm xl:text-base font-semibold tracking-wide">{label}</span>
                    
                    {/* Professional hover glow effect */}
                    {hoverIndex === index && location.pathname !== to && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-700/4 via-orange-700/8 to-red-800/4 rounded-xl backdrop-blur-sm border border-white/3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Professional Desktop Actions */}
          <div className="hidden xl:flex items-center gap-1.5 lg:gap-2 xl:gap-3 transition-all duration-300 ease-out">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Professional Language dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                onMouseEnter={() => setShowLangDropdown(true)}
                className={cn(
                  "gap-2 bg-slate-800/40 hover:bg-slate-700/50 border border-slate-600/40 hover:border-slate-500/50 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-3 lg:px-5 xl:px-6 py-1.5 lg:py-2 rounded-xl relative overflow-hidden group dark:bg-slate-700/40 dark:hover:bg-slate-600/50 dark:border-slate-500/40 dark:hover:border-slate-400/50 dark:text-slate-100",
                  showLangDropdown && "bg-slate-700/50 border-slate-500/50 text-white dark:bg-slate-600/50 dark:border-slate-400/50"
                )}
              >
                {/* Button background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700/3 via-orange-700/6 to-red-800/3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                <Globe className="w-4 h-4 lg:w-4.5 lg:h-4.5 relative z-10 transition-all duration-300 group-hover:rotate-12" />
                <span className="text-sm font-semibold hidden lg:inline relative z-10">{flags[lang]} {labels[lang]}</span>
                <span className="text-sm font-semibold lg:hidden relative z-10">{flags[lang]}</span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-all duration-300 relative z-10", 
                  showLangDropdown ? "rotate-180 text-amber-400" : "rotate-0"
                )} />
              </Button>
              
              {/* Professional language dropdown menu */}
              <div 
                className={cn(
                  "absolute top-full right-0 mt-1 min-w-[220px] z-50 transition-all duration-300 ease-out origin-top-right",
                  showLangDropdown 
                    ? "opacity-100 visible scale-100 translate-y-0" 
                    : "opacity-0 invisible scale-95 -translate-y-2 pointer-events-none"
                )}
                onMouseLeave={() => setShowLangDropdown(false)}
              >
                {/* Dropdown container with professional styling - theme compatible */}
                <div className="bg-slate-900/98 dark:bg-slate-800/98 backdrop-blur-3xl rounded-2xl border border-slate-700/60 dark:border-slate-600/60 shadow-2xl shadow-slate-900/50 overflow-hidden">
                  {/* Professional header */}
                  <div className="px-4 py-2 border-b border-slate-700/40 dark:border-slate-600/40 bg-slate-800/25 dark:bg-slate-700/25">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Language</span>
                  </div>
                  
                  {/* Language options */}
                  <div className="py-1">
                    {Object.entries(flags).map(([langCode, flag], index) => (
                      <button
                        key={langCode}
                        onClick={() => {
                          setLanguage(langCode as 'en' | 'mk' | 'al');
                          setShowLangDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-4 font-medium text-sm relative group",
                          langCode === lang 
                            ? "bg-gradient-to-r from-amber-700/10 via-orange-700/10 to-red-800/10 text-white border-l-2 border-amber-600/60" 
                            : "text-slate-200 hover:text-white hover:bg-slate-800/50 dark:text-slate-100 dark:hover:text-white dark:hover:bg-slate-700/50"
                        )}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                          transform: showLangDropdown ? 'translateX(0)' : 'translateX(-10px)',
                          transition: `all 0.3s ease-out ${index * 50}ms`
                        }}
                      >
                        {/* Professional hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-700/3 via-orange-700/5 to-red-800/3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        
                        <span className="text-xl relative z-10">{flag}</span>
                        <div className="flex flex-col relative z-10">
                          <span className="font-semibold">{labels[langCode as keyof typeof labels]}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-300 font-normal">
                            {langCode === 'en' ? 'English' : langCode === 'mk' ? 'Македонски' : 'Shqip'}
                          </span>
                        </div>
                        
                        {/* Active indicator */}
                        {langCode === lang && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
                          </div>
                        )}
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Professional footer gradient */}
                  <div className="h-1 bg-gradient-to-r from-amber-700/20 via-orange-700/25 to-red-800/20" />
                </div>
              </div>
            </div>

            {/* Conditional rendering based on authentication */}
            {isAuthenticated ? (
              // Authenticated user actions - Show user profile dropdown
              <div className="relative">
                <Button 
                  variant="ghost"
                  onClick={() => navigateToPage('/profile')}
                  className="gap-2 bg-slate-800/40 hover:bg-slate-700/50 border border-slate-600/40 hover:border-slate-500/50 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-3 lg:px-5 xl:px-6 py-1.5 lg:py-2 rounded-xl text-sm font-semibold group relative overflow-hidden dark:bg-slate-700/40 dark:hover:bg-slate-600/50 dark:border-slate-500/40 dark:hover:border-slate-400/50 dark:text-slate-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700/3 via-orange-700/5 to-red-800/3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <User className="w-4 h-4 lg:w-4.5 lg:h-4.5 relative z-10 transition-all duration-300 group-hover:scale-110" />
                  <span className="hidden lg:inline relative z-10">{t('profile')}</span>
                  {user?.name && (
                    <span className="hidden xl:inline text-xs text-slate-400 dark:text-slate-300 ml-1">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              // Unauthenticated user actions (Sign In & Join)
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigateToPage('/signin')}
                  className="bg-slate-800/40 hover:bg-slate-700/50 border-slate-600/40 hover:border-slate-500/50 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-4 lg:px-6 xl:px-8 py-1.5 lg:py-2 rounded-xl text-sm font-semibold min-w-[80px] lg:min-w-[100px] group relative overflow-hidden dark:bg-slate-700/40 dark:hover:bg-slate-600/50 dark:border-slate-500/40 dark:hover:border-slate-400/50 dark:text-slate-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/8 via-slate-500/12 to-slate-600/8 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative z-10">{t('signin')}</span>
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigateToPage('/join')}
                  className="bg-gradient-to-r from-amber-700 via-orange-700 to-red-800 hover:from-amber-600 hover:via-orange-600 hover:to-red-700 shadow-xl shadow-amber-700/20 hover:shadow-amber-700/30 transition-all duration-300 hover:scale-105 px-4 lg:px-6 xl:px-8 py-1.5 lg:py-2 rounded-xl text-sm font-bold min-w-[80px] lg:min-w-[100px] group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/8 via-white/12 to-white/8 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative z-10">{t('join')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                </Button>
              </>
            )}
          </div>

          {/* Compact Mobile menu button */}
          <div className="xl:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-1.5 sm:p-2 rounded-lg bg-slate-800/40 border border-slate-600/40 hover:bg-slate-700/50 transition-all duration-500 backdrop-blur-2xl dark:bg-slate-700/40 dark:border-slate-500/40 dark:hover:bg-slate-600/50"
            >
              <div className="relative w-5 h-5 sm:w-5.5 sm:h-5.5">
                <Menu className={cn(
                  "absolute inset-0 text-slate-200 dark:text-slate-100 transition-all duration-500",
                  open ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                )} />
                <X className={cn(
                  "absolute inset-0 text-slate-200 dark:text-slate-100 transition-all duration-500",
                  open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Professional Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-50 xl:hidden transition-all duration-700 ease-out",
        open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        {/* Professional background - theme compatible */}
        <div className="absolute inset-0 bg-slate-950/98 dark:bg-slate-900/98 backdrop-blur-3xl">
          {/* Professional animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-slate-900 to-red-950/20 dark:from-amber-950/15 dark:via-slate-800 dark:to-red-950/15" />
          <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-gradient-to-r from-amber-700/8 via-orange-700/8 to-red-800/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-r from-slate-600/8 via-slate-700/8 to-slate-800/8 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div className="relative h-full flex flex-col">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-700/40 dark:border-slate-600/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Telemax</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800/40 dark:hover:bg-slate-700/40 transition-colors duration-300"
            >
              <X className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-200 dark:text-slate-100" />
            </button>
          </div>

          {/* Mobile navigation */}
          <div className="flex-1 flex flex-col justify-center px-3 sm:px-4 space-y-2.5 sm:space-y-3">
            {links.map(({ to, label, icon: Icon }, index) => (
              <button
                key={to}
                onClick={() => navigateToPage(to)}
                className={cn(
                  "flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl font-semibold transition-all duration-700 group text-left border",
                  location.pathname === to
                    ? "bg-gradient-to-r from-amber-700/8 via-orange-700/8 to-red-800/8 text-white border-amber-600/25 shadow-lg shadow-amber-700/6"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/25 border-slate-700/25 hover:border-slate-600/40 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-700/25 dark:border-slate-600/25 dark:hover:border-slate-500/40"
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

          {/* Mobile actions */}
          <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 border-t border-slate-700/40 dark:border-slate-600/40">
            {/* Theme Toggle for Mobile */}
            <div className="flex items-center justify-center py-2">
              <ThemeToggle />
            </div>

            {/* Language Toggle for Mobile */}
            <Button 
              variant="ghost" 
              onClick={toggleLanguage} 
              className="w-full h-11 sm:h-12 bg-slate-800/40 hover:bg-slate-700/50 border border-slate-600/40 text-slate-200 hover:text-white text-base font-semibold rounded-xl gap-3 dark:bg-slate-700/40 dark:hover:bg-slate-600/50 dark:border-slate-500/40 dark:text-slate-100 dark:hover:text-white"
            >
              <Globe className="w-4.5 h-4.5" />
              <span>{flags[lang]} {labels[lang]}</span>
            </Button>

            {/* Conditional mobile actions based on authentication */}
            {isAuthenticated ? (
              // Authenticated mobile actions - Show Profile button
              <Button 
                variant="outline" 
                onClick={() => navigateToPage('/profile')} 
                className="w-full h-11 sm:h-12 bg-slate-800/40 border-slate-600/40 text-slate-200 hover:text-white text-base font-semibold rounded-xl gap-3 dark:bg-slate-700/40 dark:border-slate-500/40 dark:text-slate-100 dark:hover:text-white"
              >
                <User className="w-4.5 h-4.5" />
                {t('profile')}
                {user?.name && (
                  <span className="text-sm text-slate-400 dark:text-slate-300 ml-auto">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Button>
            ) : (
              // Unauthenticated mobile actions
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigateToPage('/signin')}
                  className="w-full h-11 sm:h-12 bg-slate-800/40 border-slate-600/40 text-slate-200 hover:text-white text-base font-semibold rounded-xl dark:bg-slate-700/40 dark:border-slate-500/40 dark:text-slate-100 dark:hover:text-white"
                >
                  {t('signin')}
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigateToPage('/join')}
                  className="w-full h-11 sm:h-12 bg-gradient-to-r from-amber-700 via-orange-700 to-red-800 hover:from-amber-600 hover:via-orange-600 hover:to-red-700 shadow-lg shadow-amber-700/15 text-base font-bold rounded-xl"
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