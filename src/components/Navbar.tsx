import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const useLang = () => {
  const [lang, setLang] = useState<'en' | 'mk' | 'al'>('en');
  const toggleLanguage = () => {
    const languages = ['en', 'mk', 'al'];
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    // navigate('/signin');
  };

  const scrollToTopAndNavigate = (to: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
    // navigate(to);
  };

  const flags = { en: '🇺🇸', mk: '🇲🇰', al: '🇦🇱' };
  const labels = { en: 'EN', mk: 'МК', al: 'AL' };

  const links = [
    { to: '/home', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/orders', label: t('orders') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm transition-all duration-300',
      showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
      shrink ? 'py-2' : 'py-4'
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Telemax</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <button
              key={to}
              onClick={() => scrollToTopAndNavigate(to)}
              className="relative group text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={toggleLanguage} className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-sm">{flags[lang]} {labels[lang]}</span>
          </Button>

          {user ? (
            <>
              <Button variant="outline" onClick={() => scrollToTopAndNavigate('/profile')} className="gap-2">
                <User className="w-4 h-4" />
                {t('profile')}
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline">{t('signin')}</Button>
              <Button variant="default">{t('join')}</Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          {open ? (
            <X className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => setOpen(false)} />
          ) : (
            <Menu className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 pt-4 pb-6 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="space-y-3 mb-6">
            {links.map(({ to, label }) => (
              <button
                key={to}
                onClick={() => scrollToTopAndNavigate(to)}
                className="block w-full text-left py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <Button variant="ghost" onClick={toggleLanguage} className="w-full flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{flags[lang]} {labels[lang]}</span>
            </Button>

            {user ? (
              <>
                <Button variant="outline" onClick={() => scrollToTopAndNavigate('/profile')} className="w-full gap-2">
                  <User className="w-4 h-4" />
                  {t('profile')}
                </Button>
                <Button variant="ghost" onClick={() => { handleLogout(); setOpen(false); }} className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full">{t('signin')}</Button>
                <Button variant="default" className="w-full">{t('join')}</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;