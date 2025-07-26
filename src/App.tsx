import React, { createContext, useContext, useState, ReactNode } from 'react';

// Language Context
interface LanguageContextType {
  lang: 'en' | 'mk' | 'al';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'en' | 'mk' | 'al'>('en');
  
  const toggleLanguage = () => {
    const languages: ('en' | 'mk' | 'al')[] = ['en', 'mk', 'al'];
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
      logout: 'Logout',
      cart: 'Cart',
      faq: 'FAQ',
      checkout: 'Checkout',
      payment: 'Payment',
      customize: 'Customize',
      orderHistory: 'Order History',
      admin: 'Admin Dashboard',
    },
    mk: {
      home: 'Дома',
      about: 'За нас',
      orders: 'Нарачки',
      contact: 'Контакт',
      profile: 'Профил',
      signin: 'Најава',
      join: 'Придружи се',
      logout: 'Одјава',
      cart: 'Кошничка',
      faq: 'ЧПП',
      checkout: 'Наплата',
      payment: 'Плаќање',
      customize: 'Прилагоди',
      orderHistory: 'Историја на нарачки',
      admin: 'Админ панел',
    },
    al: {
      home: 'Shtëpia',
      about: 'Rreth nesh',
      orders: 'Porositë',
      contact: 'Kontakti',
      profile: 'Profili',
      signin: 'Hyr',
      join: 'Bashkohu',
      logout: 'Dil',
      cart: 'Shporta',
      faq: 'Pyetje të shpeshta',
      checkout: 'Arkëtimi',
      payment: 'Pagesa',
      customize: 'Personalizoni',
      orderHistory: 'Historia e porosive',
      admin: 'Paneli i administratorit',
    }
  };
  
  const t = (key: string): string => translations[lang][key as keyof typeof translations['en']] || key;
  
  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Auth Context
interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: 'John Doe',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: name,
        email: email,
        role: 'user'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock MainLayout component (since we can't import external files in artifacts)
const MockMainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { lang, toggleLanguage, t } = useLang();
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Telemax</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('home')}
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('about')}
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('orders')}
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('contact')}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {lang === 'en' ? '🇺🇸 EN' : lang === 'mk' ? '🇲🇰 МК' : '🇦🇱 AL'}
            </button>
            
            {user ? (
              <>
                <button className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  {t('profile')}
                </button>
                <button 
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <button className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  {t('signin')}
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {t('join')}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

// Home page component
const Home = () => {
  const { t } = useLang();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Telemax
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your premier destination for custom products and services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              Get Started
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive customization solutions for all your needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Service {item}
                </h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MockMainLayout>
          <Home />
        </MockMainLayout>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;