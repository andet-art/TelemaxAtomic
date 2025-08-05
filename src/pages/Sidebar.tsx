// src/pages/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onCategorySelect: (catId: number | null) => void;
  onModelSelect:    (modelId: number | null) => void;
}
interface Category { id: number; name: string; }
interface Model    { id: number; name: string; category_id: number; }
interface Product  { id: number; name: string; model_id: number; }

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const NAVBAR_HEIGHT = '2.6rem';

export default function Sidebar({ onCategorySelect, onModelSelect }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [models,     setModels]     = useState<Model[]>([]);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string|null>(null);

  const [openCat,    setOpenCat]    = useState<number|null>(null);
  const [openModel,  setOpenModel]  = useState<number|null>(null);
  const [isHovered,  setIsHovered]  = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav,    setShowNav]    = useState(true);

  // Fetch categories, models, products
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [catsRes, modsRes, prodsRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories`),
          fetch(`${API_BASE}/api/models`),
          fetch(`${API_BASE}/api/products`),
        ]);
        if (!catsRes.ok) throw new Error(`Categories fetch failed: ${catsRes.status}`);
        if (!modsRes.ok) throw new Error(`Models fetch failed: ${modsRes.status}`);
        if (!prodsRes.ok) throw new Error(`Products fetch failed: ${prodsRes.status}`);
        const [cats, mods, prods] = await Promise.all([
          catsRes.json(),
          modsRes.json(),
          prodsRes.json(),
        ]);
        setCategories(cats);
        setModels(mods);
        setProducts(prods);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Detect mobile layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide navbar on scroll (desktop)
  useEffect(() => {
    if (isMobile) return;
    let lastY = window.pageYOffset;
    const onScroll = () => {
      const currentY = window.pageYOffset;
      setShowNav(currentY < lastY || currentY < 50);
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const isExpanded = isMobile ? mobileOpen : (showNav || isHovered);
  const sidebarWidth = isMobile
    ? (mobileOpen ? 'w-64' : 'w-0')
    : (isExpanded ? 'w-64' : 'w-16');

  // Handlers
  const handleAll = () => {
    setOpenCat(null);
    setOpenModel(null);
    onCategorySelect(null);
    onModelSelect(null);
  };
  const handleCat = (catId: number, catOpen: boolean) => {
    const willOpen = !catOpen;
    setOpenCat(willOpen ? catId : null);
    setOpenModel(null);
    onCategorySelect(willOpen ? catId : null);
    onModelSelect(null);
  };
  const handleModel = (modelId: number, modelOpen: boolean) => {
    const willOpen = !modelOpen;
    setOpenModel(willOpen ? modelId : null);
    onModelSelect(willOpen ? modelId : null);
  };

  if (loading) {
    return (
      <aside style={isMobile ? { top: NAVBAR_HEIGHT } : undefined}
             className={`fixed left-0 z-30 h-full bg-white border-r border-gray-200
                         transition-all duration-300 ease-in-out overflow-hidden ${sidebarWidth}`}>
        <div className="p-4 text-gray-500">Loading…</div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside style={isMobile ? { top: NAVBAR_HEIGHT } : undefined}
             className={`fixed left-0 z-30 h-full bg-white border-r border-gray-200
                         transition-all duration-300 ease-in-out overflow-hidden ${sidebarWidth}`}>
        <div className="p-4 text-red-500 text-sm">Error: {error}</div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20"
             onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile hamburger button */}
      {isMobile && (
        <button onClick={() => setMobileOpen(prev => !prev)}
                style={{ top: NAVBAR_HEIGHT }}
                className="fixed left-4 z-50 p-2 bg-white rounded-lg shadow-lg border">
          <div className="space-y-1">
            <div className={`w-5 h-0.5 bg-gray-600 transition-transform
                              ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-gray-600 transition-opacity
                              ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-gray-600 transition-transform
                              ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      )}

      <aside onMouseEnter={() => !isMobile && setIsHovered(true)}
             onMouseLeave={() => !isMobile && setIsHovered(false)}
             style={isMobile ? { top: NAVBAR_HEIGHT } : undefined}
             className={`fixed left-0 z-30 h-full bg-white border-r border-gray-200
                         transition-all duration-300 ease-in-out overflow-hidden ${sidebarWidth}
                         ${isMobile
                           ? (mobileOpen ? 'shadow-2xl' : '')
                           : (isExpanded ? 'top-24 shadow-none' : 'top-0 shadow-lg')
                         }`}>
        {/* Compact indicator */}
        {!isMobile && !isExpanded && (
          <div className="flex justify-center py-3 border-b border-gray-100">
            <div className="w-8 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        <nav className={`${isExpanded ? 'p-4' : 'p-2'} space-y-1 overflow-y-auto h-full`}>
          {/* All button */}
          <button onClick={handleAll}
                  className={`w-full flex items-center justify-between rounded-lg
                              transition-all duration-200 hover:bg-gray-50
                              ${isExpanded ? 'px-3 py-2.5' : 'px-2 py-3 justify-center'}
                              ${openCat === null ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                             `}
                  title={!isExpanded ? 'All' : undefined}>
            {isExpanded
              ? <span className="font-medium text-sm truncate">All</span>
              : <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">A</span>
                </div>
            }
          </button>

          {/* Categories */}
          {categories.map(cat => {
            const catOpen = openCat === cat.id;
            const catModels = models.filter(m => m.category_id === cat.id);
            return (
              <div key={cat.id}>
                <button onClick={() => handleCat(cat.id, catOpen)}
                        className={`w-full flex items-center justify-between rounded-lg
                                     transition-all duration-200 hover:bg-gray-50
                                     ${isExpanded ? 'px-3 py-2.5' : 'px-2 py-3 justify-center'}
                                     ${catOpen ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'}
                                    `}
                        title={!isExpanded ? cat.name : undefined}>
                  {isExpanded
                    ? <>
                        <span className="font-medium text-sm truncate">{cat.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
                      </>
                    : <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                  }
                </button>

                {/* Models list */}
                <AnimatePresence>
                  {isExpanded && catOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="overflow-hidden ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3">
                      {catModels.map(m => {
                        const modelOpen = openModel === m.id;
                        const mProds = products.filter(p => p.model_id === m.id);
                        return (
                          <div key={m.id}>
                            <button onClick={() => handleModel(m.id, modelOpen)}
                                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded
                                                 text-sm transition-colors duration-150
                                                 ${modelOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
                                                `}>
                              <span className="truncate">{m.name}</span>
                              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${modelOpen ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Products list */}
                            <AnimatePresence>
                              {modelOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                                            className="overflow-hidden ml-4 mt-1 space-y-1">
                                  {mProds.map(p => (
                                    <button key={p.id}
                                            onClick={() => onCategorySelect === null && onModelSelect === null}
                                            className="block w-full text-left px-2 py-1 text-xs
                                                       text-gray-500 hover:text-blue-600 hover:bg-blue-50
                                                       rounded transition-colors duration-150 truncate"
                                            title={p.name}>
                                      • {p.name}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}