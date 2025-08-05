// src/pages/Orders.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Sparkles, ShoppingBag } from 'lucide-react';
import Footer from '@/components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Placeholder image for products without photos
const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x240?text=No+Image';

type Product = {
  id: number;
  name: string;
  model_id: number;
  description: string;
  price: number | string;
  photos?: string[];
};

type Model = {
  id: number;
  category_id: number;
};

const Orders: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showNav, setShowNav]   = useState(true);

  const [products, setProducts]         = useState<Product[]>([]);
  const [models,   setModels]           = useState<Model[]>([]);
  const [selectedCategory, setCategory] = useState<number|null>(null);
  const [selectedModel,    setModel]    = useState<number|null>(null);
  const [searchTerm,       setSearch]   = useState('');
  const [loading, setLoading]           = useState(true);
  const [error,   setError]             = useState<string|null>(null);
  const [currentPage, setCurrentPage]   = useState(1);

  const [showModal, setShowModal]               = useState(false);
  const [productDetails, setProductDetails]     = useState<Product|null>(null);
  const [selectedPhotoIndex, setSelectedPhoto]  = useState(0);

  const itemsPerPage = 9;

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
        const prodData: Product[] = await pRes.json();
        setProducts(prodData);
        setModels(await mRes.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedModel, searchTerm]);

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

  const openModal = (prod: Product) => {
    setProductDetails(prod);
    setSelectedPhoto(0);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const mainMargin = isMobile ? 'ml-0' : (showNav ? 'ml-64' : 'ml-16');
  const topPad     = isMobile ? 'pt-20' : (showNav ? 'pt-24' : 'pt-8');

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'number' ? price : parseFloat(price as string) || 0;
    return num.toFixed(2);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar onCategorySelect={setCategory} onModelSelect={setModel} />

      <main className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin} ${topPad} pb-12 px-4 sm:px-6 lg:px-8 text-foreground`}>
        <div className="w-full max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          {/* Header */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-slate-900/60 shadow-md backdrop-blur-sm">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {selectedModel != null
                  ? `Products in Model #${selectedModel}`
                  : selectedCategory != null
                    ? `Products in Category #${selectedCategory}`
                    : 'All Products'}
              </span>
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <p className="text-center">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : paged.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {paged.map(prod => {
                // determine photo or placeholder
                const photoUrl = Array.isArray(prod.photos) && prod.photos.length > 0
                  ? prod.photos[0]
                  : PLACEHOLDER_IMG;
                return (
                <div key={prod.id} className="border rounded-lg overflow-hidden flex flex-col">
                  <img
                    src={photoUrl}
                    alt={prod.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-1 truncate">{prod.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prod.description}</p>
                    <p className="font-semibold text-primary mb-4">${formatPrice(prod.price)}</p>
                    <button
                      onClick={() => openModal(prod)}
                      className="mt-auto px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                    >
                      add to cart
                    </button>
                  </div>
                </div>);
              })}
            </div>
          ) : (
            <p className="text-center mt-12">No products match that filter.</p>
          )}

          {/* Pagination */}
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

      {/* Modal */}
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
              {Array.isArray(productDetails.photos) && productDetails.photos.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
