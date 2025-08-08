// src/pages/Orders.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sparkles, ShoppingBag, X, ShoppingCart, Eye, Plus, Minus, Check, Star, Heart, Filter, Search } from 'lucide-react';
import Footer from '@/components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const STATIC_TEST_IMG = `${API_BASE}/assets/products/test.png`;
const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x240?text=No+Image';

type Product = {
  id: number;
  name: string;
  model_id: number;
  description: string;
  price: number | string;
  photos?: string[];
  colors?: string[];
  sizes?: string[];
  available_models?: { id: number; name: string; price_modifier?: number }[];
};

export type CartItem = Product & { 
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedModel?: { id: number; name: string; price_modifier?: number };
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  
  // responsive + nav
  const [isMobile, setIsMobile] = useState(false);
  const [showNav, setShowNav] = useState(true);

  // products & filters
  const [products, setProducts] = useState<Product[]>([]);
  const [models, setModels] = useState<{id:number;category_id:number;}[]>([]);
  const [selectedCategory, setCategory] = useState<number|null>(null);
  const [selectedModel, setModel] = useState<number|null>(null);
  const [searchTerm, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [showFilters, setShowFilters] = useState(false);

  // cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCartWidget, setShowCartWidget] = useState(false);

  // modals
  const [showModal, setShowModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [productDetails, setProductDetails] = useState<Product|null>(null);
  const [selectedPhotoIndex, setSelectedPhoto] = useState(0);
  
  // add to cart modal states
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedProductModel, setSelectedProductModel] = useState<{ id: number; name: string; price_modifier?: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Wishlist state (mock)
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      setShowCartWidget(true);
    } else {
      localStorage.removeItem('cart');
      setShowCartWidget(false);
    }
  }, [cart]);

  // load products & models
  useEffect(() => {
  async function load() {
    setLoading(true);
    try {
      const [pRes, mRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/models`)
      ]);
      if (!pRes.ok) throw new Error(`Products: ${pRes.status}`);
      if (!mRes.ok) throw new Error(`Models: ${mRes.status}`);

      const productsData: Product[] = await pRes.json();
      const modelsData = await mRes.json();

      const enhancedProducts = productsData.map(product => {
        // 1. Grab whatever your API gave you (might be undefined or empty)
        const incoming = Array.isArray(product.photos) ? product.photos : [];

        // 2. If that array is empty, use your test fallback
        const rawPhotos = incoming.length
          ? incoming
          : ['assets/products/test.png'];

        // 3. Prepend API_BASE to any relative path
        const photos = rawPhotos.map(p =>
          p.startsWith('http') ? p : `${API_BASE}/${p}`
        );

        return {
          ...product,       // keep id, name, description, etc.
          photos,           // override (or inject) our new full‐URL array
          colors: ['Black', 'White', 'Silver', 'Blue', 'Red']
            .slice(0, Math.floor(Math.random() * 3) + 2),
          sizes: ['S', 'M', 'L', 'XL']
            .slice(0, Math.floor(Math.random() * 2) + 2),
          available_models: [
            { id: 1, name: 'Standard', price_modifier: 0 },
            { id: 2, name: 'Pro',      price_modifier: 50 },
            { id: 3, name: 'Premium',  price_modifier: 100 }
          ].slice(0, Math.floor(Math.random() * 2) + 1)
        };
      });

      setProducts(enhancedProducts);
      setModels(modelsData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);

  // reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedModel, searchTerm]);

  // responsive helpers
  useEffect(() => {
    const chk = () => setIsMobile(window.innerWidth < 768);
    chk(); window.addEventListener('resize', chk);
    return () => window.removeEventListener('resize', chk);
  }, []);
  useEffect(() => {
    if (isMobile) return;
    let lastY = window.pageYOffset;
    const onScroll = () => {
      const curr = window.pageYOffset;
      setShowNav(curr < lastY || curr < 50);
      lastY = curr;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // filters + pagination
  const filtered = products
    .filter(p => selectedModel != null
      ? p.model_id === selectedModel
      : selectedCategory != null
        ? models.find(m => m.id === p.model_id)?.category_id === selectedCategory
        : true
    )
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // modal handlers
  const openModal = (prod: Product) => {
    setProductDetails(prod);
    setSelectedPhoto(0);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // Add to cart modal handlers
  const openAddToCartModal = (prod: Product) => {
    setProductDetails(prod);
    setSelectedPhoto(0);
    setSelectedColor(prod.colors?.[0] || '');
    setSelectedSize(prod.sizes?.[0] || '');
    setSelectedProductModel(prod.available_models?.[0] || null);
    setQuantity(1);
    setShowAddToCartModal(true);
  };

  const closeAddToCartModal = () => {
    setShowAddToCartModal(false);
    setProductDetails(null);
    setSelectedColor('');
    setSelectedSize('');
    setSelectedProductModel(null);
    setQuantity(1);
  };

  // cart handlers
  const addToCart = async (prod: Product) => {
    setAddingToCart(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cartItem: CartItem = {
      ...prod,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
      selectedModel: selectedProductModel || undefined,
    };

    setCart(prev => {
      const exists = prev.find(i => 
        i.id === prod.id && 
        i.selectedColor === selectedColor && 
        i.selectedSize === selectedSize &&
        i.selectedModel?.id === selectedProductModel?.id
      );
      
      if (exists) {
        return prev.map(i => 
          i.id === prod.id && 
          i.selectedColor === selectedColor && 
          i.selectedSize === selectedSize &&
          i.selectedModel?.id === selectedProductModel?.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, cartItem];
    });

    setAddingToCart(false);
    closeAddToCartModal();
    
    // Show success feedback
    setTimeout(() => {
      setShowCart(true);
    }, 200);
  };
  
  const removeFromCart = (id: number, color?: string, size?: string, modelId?: number) => {
    setCart(prev => prev.filter(i => !(
      i.id === id && 
      i.selectedColor === color && 
      i.selectedSize === size &&
      i.selectedModel?.id === modelId
    )));
  };
  
  const updateQuantity = (id: number, qty: number, color?: string, size?: string, modelId?: number) => {
    if (qty < 1) return removeFromCart(id, color, size, modelId);
    setCart(prev => prev.map(i =>
      i.id === id && 
      i.selectedColor === color && 
      i.selectedSize === size &&
      i.selectedModel?.id === modelId
        ? { ...i, quantity: qty } : i
    ));
  };

  // Wishlist handlers
  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // price formatting
  const formatPrice = (price: number | string) => {
    const num = typeof price === 'number' ? price : parseFloat(price) || 0;
    return num.toFixed(2);
  };

  const getProductPrice = (product: Product, model?: { price_modifier?: number }) => {
    const basePrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
    const modifier = model?.price_modifier || 0;
    return basePrice + modifier;
  };
  
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart
    .reduce((sum, i) => {
      const price = getProductPrice(i, i.selectedModel);
      return sum + price * i.quantity;
    }, 0)
    .toFixed(2);

  // layout classes
  const mainMargin = isMobile ? 'ml-0' : (showNav ? 'ml-64' : 'ml-16');
  const topPad = isMobile ? 'pt-20' : (showNav ? 'pt-24' : 'pt-8');

  return (
    <>
      {/* Custom CSS for premium animations and gradients */}
      <style jsx>{`
        @keyframes luxury-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes luxury-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.3); }
          50% { box-shadow: 0 0 30px rgba(217, 119, 6, 0.5); }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .luxury-gradient {
          background: linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .luxury-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .luxury-card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .luxury-shimmer {
          position: relative;
          overflow: hidden;
        }

        .luxury-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          animation: luxury-shimmer 2s infinite;
        }

        .animate-float-up {
          animation: float-up 0.6s ease forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease forwards;
        }

        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass-effect {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/10 text-foreground transition-all duration-500">
        {/* Enhanced sidebar */}
        <Sidebar onCategorySelect={setCategory} onModelSelect={setModel} />

        <main className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin} ${topPad} pb-12 px-4 sm:px-6 lg:px-8`}>
          <div className="w-full max-w-7xl mx-auto">

            {/* Enhanced header with premium styling */}
            <div className="mb-8">
              {/* Hero section with gradient */}
              <div className="relative overflow-hidden rounded-2xl luxury-gradient p-8 mb-6 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                    Premium Collection
                  </h1>
                  <p className="text-orange-100 text-lg">Discover luxury products crafted for excellence</p>
                </div>
                <div className="absolute top-4 right-4 opacity-30">
                  <Sparkles className="w-12 h-12" />
                </div>
                <div className="absolute bottom-2 left-8 opacity-20">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>

              {/* Enhanced search and filters bar */}
              <div className="glass-effect rounded-xl p-4 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search premium products..."
                      value={searchTerm}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background/80 border border-border/50 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                                placeholder-muted-foreground transition-all duration-300
                                backdrop-blur-sm hover:bg-background/90"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 
                                text-primary border border-primary/30 rounded-xl
                                transition-all duration-300 hover:scale-105"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </button>
                    
                    <button
                      onClick={() => setShowCart(true)}
                      className="relative p-3 rounded-xl luxury-gradient text-white
                                hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results count */}
                {!loading && !error && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Showing {paged.length} of {filtered.length} premium products
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced products grid */}
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="luxury-gradient rounded-full p-4 mb-4 animate-spin">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Loading premium collection...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Something went wrong</h3>
                  <p className="text-muted-foreground mb-4">Error: {error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 luxury-gradient text-white rounded-xl font-medium
                              hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : paged.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {paged.map((prod, index) => {
                  const photoUrl = prod.photos?.length
                    ? prod.photos[0]
                    : PLACEHOLDER_IMG;

                  return (
                    <div key={prod.id} 
                         className="luxury-card-hover bg-card border border-border/50 rounded-2xl overflow-hidden
                                   shadow-lg hover:shadow-2xl hover:border-primary/30 group
                                   animate-float-up backdrop-blur-sm"
                         style={{ animationDelay: `${index * 100}ms` }}>
                      
                      <div className="relative overflow-hidden">
                        <div className="luxury-shimmer">
                          <img 
                            src={photoUrl} 
                            alt={prod.name} 
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        
                        {/* Overlay buttons */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                                wishlist.includes(prod.id)
                                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${wishlist.includes(prod.id) ? 'fill-current' : ''}`} />
                            </button>
                            
                            <button
                              onClick={() => openModal(prod)}
                              className="p-2 bg-white/20 text-white rounded-full backdrop-blur-md
                                        hover:bg-white/30 transition-all duration-300 hover:scale-110"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="absolute top-4 left-4">
                            {prod.colors && (
                              <div className="flex space-x-1">
                                {prod.colors.slice(0, 3).map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-lg
                                              hover:scale-110 transition-transform duration-200"
                                    style={{ 
                                      backgroundColor: color.toLowerCase() === 'black' ? '#000' : 
                                                     color.toLowerCase() === 'white' ? '#fff' : 
                                                     color.toLowerCase() 
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Premium badge */}
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 
                                          text-white text-xs font-bold rounded-full shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            Premium
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-xl text-foreground group-hover:text-primary 
                                        transition-colors duration-300 line-clamp-1">
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 
                                          bg-clip-text text-transparent">
                              ${formatPrice(prod.price)}
                            </div>
                            {prod.available_models && prod.available_models.length > 1 && (
                              <p className="text-xs text-muted-foreground">Starting from</p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                              ✓ In Stock
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Free Shipping
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => openAddToCartModal(prod)}
                          className="w-full luxury-gradient text-white py-3 px-6 rounded-xl font-semibold
                                    hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25
                                    transition-all duration-300 flex items-center justify-center gap-2
                                    group/btn"
                        >
                          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="glass-effect rounded-3xl p-12 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-full 
                                 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Products Found</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    We couldn't find any products matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setCategory(null);
                      setModel(null);
                      setSearch('');
                    }}
                    className="px-8 py-3 luxury-gradient text-white rounded-xl font-semibold
                              hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="glass-effect rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-border/50 rounded-xl bg-background/50
                                hover:bg-primary/10 hover:border-primary/50 hover:text-primary
                                disabled:opacity-50 disabled:cursor-not-allowed 
                                transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />

        {/* Enhanced Bottom Left Cart Widget */}
        {showCartWidget && cartCount > 0 && (
          <div className="fixed bottom-6 left-6 z-40 animate-scale-in">
            <div className="luxury-gradient text-white rounded-2xl shadow-2xl 
                           hover:shadow-3xl transition-all duration-300 
                           p-4 cursor-pointer hover:scale-105 hover:-translate-y-1"
                 onClick={() => navigate('/cart')}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="font-bold text-lg">{cartCount} items</div>
                  <div className="text-orange-100">${cartTotal}</div>
                </div>
              </div>
              <div className="text-xs opacity-90 mt-2 text-center">
                Click to view cart
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Cart Drawer */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCart(false)}
            />
            {/* panel */}
            <div className="relative ml-auto w-96 bg-card border-l border-border/50 h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="luxury-gradient p-6 text-white relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <p className="text-orange-100">Premium selection</p>
                  </div>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 opacity-10">
                  <ShoppingCart className="w-24 h-24" />
                </div>
              </div>

              {cart.length ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.map((item, index) => {
                      const photoUrl = (item.photos && item.photos.length > 0)
                        ? item.photos[0]
                        : PLACEHOLDER_IMG;
                      const itemPrice = getProductPrice(item, item.selectedModel);
                      return (
                        <div key={`${item.id}-${index}`} 
                             className="glass-effect rounded-2xl p-4 hover:bg-muted/20 transition-all duration-300">
                          <div className="flex items-start space-x-4">
                            <div className="luxury-shimmer rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={photoUrl}
                                alt={item.name}
                                className="w-16 h-16 object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-lg truncate">{item.name}</p>
                              {item.selectedColor && (
                                <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                              )}
                              {item.selectedSize && (
                                <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                              )}
                              {item.selectedModel && (
                                <p className="text-sm text-muted-foreground">Model: {item.selectedModel.name}</p>
                              )}
                              <p className="text-sm font-semibold text-primary">
                                ${formatPrice(itemPrice)} × {item.quantity}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize, item.selectedModel?.id)}
                                  disabled={item.quantity <= 1}
                                  className="p-1 border border-border/50 rounded-lg bg-background/50
                                            hover:bg-primary/10 hover:border-primary/50
                                            disabled:opacity-50 transition-all duration-300"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-bold min-w-[2rem] text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize, item.selectedModel?.id)}
                                  className="p-1 border border-border/50 rounded-lg bg-background/50
                                            hover:bg-primary/10 hover:border-primary/50
                                            transition-all duration-300"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize, item.selectedModel?.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
                                          transition-colors duration-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Footer */}
                  <div className="p-6 border-t border-border/50 bg-muted/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                        ${cartTotal}
                      </span>
                    </div>
                    <button 
                      onClick={() => navigate('/cart')}
                      className="w-full luxury-gradient text-white py-3 rounded-xl font-bold mb-3
                                hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      View Full Cart
                    </button>
                    <button
                      onClick={() => setShowCart(false)}
                      className="w-full border-2 border-border/50 py-3 rounded-xl bg-background/50
                                hover:bg-muted/50 hover:border-border
                                transition-all duration-300 font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full 
                                 flex items-center justify-center mb-6">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Your cart is empty</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Start exploring our premium collection
                  </p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="px-8 py-3 luxury-gradient text-white rounded-xl font-semibold
                              hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Product Details Modal (View Only) */}
        {showModal && productDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden 
                           max-w-2xl w-full mx-4 shadow-2xl animate-scale-in">
              <div className="luxury-gradient p-6 text-white relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h2 className="font-bold text-2xl">Product Details</h2>
                    <p className="text-orange-100">Premium overview</p>
                  </div>
                  <button onClick={closeModal} 
                          className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 opacity-20">
                  <Eye className="w-24 h-24" />
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {productDetails.name}
                </h3>
                <p className="mb-4 text-muted-foreground text-lg leading-relaxed">
                  {productDetails.description}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    ${formatPrice(productDetails.price)}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                
                {productDetails.photos?.length ? (
                  <>
                    <div className="mb-6">
                      <div className="luxury-shimmer rounded-2xl overflow-hidden">
                        <img
                          src={productDetails.photos[selectedPhotoIndex]}
                          alt="Product"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                    {productDetails.photos.length > 1 && (
                      <div className="flex space-x-3 overflow-x-auto pb-4 mb-6">
                        {productDetails.photos.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPhoto(idx)}
                            className={`border-2 rounded-xl flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                              selectedPhotoIndex === idx 
                                ? 'border-primary shadow-lg shadow-primary/30' 
                                : 'border-border/50 hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Product ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-6">
                    <img
                      src={PLACEHOLDER_IMG}
                      alt="No image available"
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      closeModal();
                      openAddToCartModal(productDetails);
                    }}
                    className="flex-1 luxury-gradient text-white py-3 px-6 rounded-xl font-bold
                              hover:scale-105 transition-all duration-300 shadow-lg
                              flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 border-2 border-border/50 py-3 px-6 rounded-xl bg-background/50
                              hover:bg-muted/50 hover:border-border
                              transition-all duration-300 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add to Cart Modal */}
        {showAddToCartModal && productDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden 
                           max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl
                           animate-scale-in">
              <div className="luxury-gradient p-6 text-white relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h2 className="font-bold text-2xl mb-1">Add to Cart</h2>
                    <p className="text-orange-100">Configure your premium selection</p>
                  </div>
                  <button onClick={closeAddToCartModal} 
                          className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 opacity-20">
                  <Sparkles className="w-32 h-32" />
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Enhanced Left Side - Photos */}
                  <div>
                    <div className="mb-6 relative group">
                      <div className="luxury-shimmer rounded-2xl overflow-hidden">
                        <img
                          src={productDetails.photos?.[selectedPhotoIndex] || PLACEHOLDER_IMG}
                          alt="Product"
                          className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                    
                    {/* Enhanced Thumbnail Gallery */}
                    {productDetails.photos && productDetails.photos.length > 1 && (
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {productDetails.photos.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPhoto(idx)}
                            className={`border-2 rounded-xl flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                              selectedPhotoIndex === idx 
                                ? 'border-primary shadow-lg shadow-primary/30' 
                                : 'border-border/50 hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Product ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Right Side - Product Details */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        {productDetails.name}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-4 line-clamp-2 leading-relaxed">
                        {productDetails.description}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                          ${formatPrice(getProductPrice(productDetails, selectedProductModel))}
                        </div>
                        {selectedProductModel?.price_modifier !== undefined && selectedProductModel.price_modifier > 0 && (
                          <div className="glass-effect px-3 py-1 rounded-lg">
                            <span className="text-sm text-muted-foreground">
                              Base: ${formatPrice(productDetails.price)} + ${selectedProductModel.price_modifier}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">(4.9/5)</span>
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                          ✓ In Stock - Ready to Ship
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Model Selection */}
                    {productDetails.available_models && productDetails.available_models.length > 1 && (
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-4">Select Model</label>
                        <div className="grid grid-cols-1 gap-3">
                          {productDetails.available_models.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => setSelectedProductModel(model)}
                              className={`p-4 border-2 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                                selectedProductModel?.id === model.id
                                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                  : 'border-border/50 hover:border-primary/50 bg-background/50 hover:bg-primary/5'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-lg">{model.name}</span>
                                  {selectedProductModel?.id === model.id && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Check className="w-4 h-4 text-primary" />
                                      <span className="text-sm text-primary">Selected</span>
                                    </div>
                                  )}
                                </div>
                                {model.price_modifier ? (
                                  <span className="text-lg font-semibold text-orange-600">+${model.price_modifier}</span>
                                ) : (
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
                                    Included
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Color Selection */}
                    {productDetails.colors && productDetails.colors.length > 0 && (
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-4">
                          Color: <span className="text-primary">{selectedColor}</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {productDetails.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-6 py-3 border-2 rounded-xl transition-all duration-300 hover:scale-105 font-medium ${
                                selectedColor === color
                                  ? 'border-primary luxury-gradient text-white shadow-lg'
                                  : 'border-border/50 hover:border-primary/50 bg-background/50 hover:bg-primary/5'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Size Selection */}
                    {productDetails.sizes && productDetails.sizes.length > 0 && (
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-4">
                          Size: <span className="text-primary">{selectedSize}</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {productDetails.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-6 py-3 border-2 rounded-xl transition-all duration-300 hover:scale-105 font-medium min-w-[4rem] ${
                                selectedSize === size
                                  ? 'border-primary luxury-gradient text-white shadow-lg'
                                  : 'border-border/50 hover:border-primary/50 bg-background/50 hover:bg-primary/5'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Quantity Selection */}
                    <div>
                      <label className="block text-lg font-bold text-foreground mb-4">Quantity</label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="p-3 border-2 border-border/50 rounded-xl bg-background/50
                                    hover:bg-primary/10 hover:border-primary/50 
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-300 hover:scale-105"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-2xl min-w-[4rem] text-center bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-3 border-2 border-border/50 rounded-xl bg-background/50
                                    hover:bg-primary/10 hover:border-primary/50 
                                    transition-all duration-300 hover:scale-105"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Add to Cart Button */}
                    <div className="flex space-x-4 pt-6">
                      <button
                        onClick={() => addToCart(productDetails)}
                        disabled={addingToCart}
                        className="flex-1 luxury-gradient text-white py-4 px-8 rounded-xl font-bold text-lg
                                  transition-all duration-300 hover:scale-105 hover:shadow-xl
                                  disabled:opacity-50 disabled:cursor-not-allowed 
                                  flex items-center justify-center gap-3 shadow-lg"
                      >
                        {addingToCart ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-6 h-6" />
                            Add to Cart - ${formatPrice(getProductPrice(productDetails, selectedProductModel) * quantity)}
                          </>
                        )}
                      </button>
                      <button
                        onClick={closeAddToCartModal}
                        className="px-8 py-4 border-2 border-border/50 rounded-xl bg-background/50
                                  hover:bg-muted/50 hover:border-border
                                  transition-all duration-300 hover:scale-105 font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Premium benefits */}
                    <div className="glass-effect rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Free shipping</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>30-day returns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Premium warranty</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span>24/7 support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
                           