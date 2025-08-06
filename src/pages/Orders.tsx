// src/pages/Orders.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Sparkles, ShoppingBag } from 'lucide-react';
import Footer from '@/components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x240?text=No+Image';

type Product = {
  id: number;
  name: string;
  model_id: number;
  description: string;
  price: number | string;
  photos?: string[];
};
type CartItem = Product & { quantity: number };

const Orders: React.FC = () => {
  // responsive + nav
  const [isMobile, setIsMobile] = useState(false);
  const [showNav, setShowNav]   = useState(true);

  // products & filters
  const [products, setProducts]         = useState<Product[]>([]);
  const [models,   setModels]           = useState<{id:number;category_id:number;}[]>([]);
  const [selectedCategory, setCategory] = useState<number|null>(null);
  const [selectedModel,    setModel]    = useState<number|null>(null);
  const [searchTerm,       setSearch]   = useState('');
  const [loading, setLoading]           = useState(true);
  const [error,   setError]             = useState<string|null>(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 9;

  // cart
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [showCart, setShowCart]   = useState(false);

  // modal
  const [showModal, setShowModal]               = useState(false);
  const [productDetails, setProductDetails]     = useState<Product|null>(null);
  const [selectedPhotoIndex, setSelectedPhoto]  = useState(0);

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
        setProducts(await pRes.json());
        setModels(await mRes.json());
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

  // cart handlers
  const addToCart = (prod: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === prod.id);
      if (exists) {
        return prev.map(i => i.id === prod.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
        );
      }
      return [...prev, { ...prod, quantity: 1 }];
    });
  };
  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };
  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: qty } : i
    ));
  };

  // price formatting
  const formatPrice = (price: number | string) => {
    const num = typeof price === 'number' ? price : parseFloat(price) || 0;
    return num.toFixed(2);
  };
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart
    .reduce((sum, i) => sum + parseFloat(String(i.price)) * i.quantity, 0)
    .toFixed(2);

  // layout classes
  const mainMargin = isMobile ? 'ml-0' : (showNav ? 'ml-64' : 'ml-16');
  const topPad     = isMobile ? 'pt-20' : (showNav ? 'pt-24' : 'pt-8');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* sidebar */}
      <Sidebar onCategorySelect={setCategory} onModelSelect={setModel} />

      <main className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin} ${topPad} pb-12 px-4 sm:px-6 lg:px-8 text-foreground`}>
        <div className="w-full max-w-7xl mx-auto">

          {/* header: search + cart */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button
              onClick={() => setShowCart(true)}
              className="relative ml-4 p-2 rounded hover:bg-gray-200 transition"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* products grid */}
          {loading ? (
            <p className="text-center">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : paged.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {paged.map(prod => {
                const photoUrl = (prod.photos && prod.photos.length)
                  ? prod.photos[0]!
                  : PLACEHOLDER_IMG;
                return (
                  <div key={prod.id} className="border rounded-lg overflow-hidden flex flex-col">
                    <img src={photoUrl} alt={prod.name} className="w-full h-40 object-cover" />
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-1 truncate">{prod.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prod.description}</p>
                      <p className="font-semibold text-primary mb-4">${formatPrice(prod.price)}</p>
                      <button
                        onClick={() => addToCart(prod)}
                        className="mt-auto px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-12">No products match that filter.</p>
          )}

          {/* pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCart(false)}
          />
          {/* panel */}
          <div className="relative ml-auto w-80 bg-white h-full p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            {cart.length ? (
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Your cart is empty.</p>
            )}
            {cart.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Total: ${cartTotal}</p>
                <button className="mt-2 w-full bg-primary text-white py-2 rounded">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showModal && productDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Product Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{productDetails.name}</h3>
              <p className="mb-2">{productDetails.description}</p>
              <p className="mb-4 font-semibold">Price: ${formatPrice(productDetails.price)}</p>
              {productDetails.photos?.length ? (
                <>
                  <div className="mb-4">
                    <img
                      src={productDetails.photos[selectedPhotoIndex]}
                      alt="style"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    {productDetails.photos.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhoto(idx)}
                        className={`border ${selectedPhotoIndex === idx ? 'border-primary' : 'border-gray-300'} rounded`}
                      >
                        <img
                          src={url}
                          alt={`style-${idx}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
