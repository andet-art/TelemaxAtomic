// src/pages/Orders.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sparkles, ShoppingBag, X, ShoppingCart, Eye, Plus, Minus, Check } from 'lucide-react';
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
        
        // Mock additional product data for demonstration
        const productsData = await pRes.json();
        const enhancedProducts = productsData.map((product: Product) => ({
          ...product,
          colors: ['Black', 'White', 'Silver', 'Blue', 'Red'].slice(0, Math.floor(Math.random() * 3) + 2),
          sizes: ['S', 'M', 'L', 'XL'].slice(0, Math.floor(Math.random() * 2) + 2),
          available_models: [
            { id: 1, name: 'Standard', price_modifier: 0 },
            { id: 2, name: 'Pro', price_modifier: 50 },
            { id: 3, name: 'Premium', price_modifier: 100 }
          ].slice(0, Math.floor(Math.random() * 2) + 1)
        }));
        
        setProducts(enhancedProducts);
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
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : paged.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {paged.map(prod => {
                const photoUrl = (prod.photos && prod.photos.length)
                  ? prod.photos[0]!
                  : PLACEHOLDER_IMG;
                return (
                  <div key={prod.id} className="border rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative group">
                      <img src={photoUrl} alt={prod.name} className="w-full h-40 object-cover" />
                      <button
                        onClick={() => openModal(prod)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {prod.colors && (
                          <div className="flex space-x-1">
                            {prod.colors.slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-1 truncate">{prod.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prod.description}</p>
                      <div className="mb-4">
                        <p className="font-semibold text-primary">${formatPrice(prod.price)}</p>
                        {prod.available_models && prod.available_models.length > 1 && (
                          <p className="text-xs text-gray-500">Starting from</p>
                        )}
                      </div>
                      <button
                        onClick={() => openAddToCartModal(prod)}
                        className="mt-auto px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center mt-12 py-16">
              <div className="mb-4">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No products match that filter.</p>
              <button
                onClick={() => {
                  setCategory(null);
                  setModel(null);
                  setSearch('');
                }}
                className="mt-4 px-4 py-2 text-primary border border-primary rounded hover:bg-primary/5"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded transition-colors ${
                    page === currentPage 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-primary border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Bottom Left Cart Widget */}
      {showCartWidget && cartCount > 0 && (
        <div className="fixed bottom-4 left-4 z-40 bg-primary text-primary-foreground rounded-lg shadow-lg p-3 cursor-pointer hover:shadow-xl transition-shadow"
             onClick={() => navigate('/cart')}>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{cartCount} items</span>
            <span className="font-semibold">${cartTotal}</span>
          </div>
          <div className="text-xs opacity-90 mt-1">Click to view cart</div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {showAddToCartModal && productDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Add to Cart</h2>
              <button onClick={closeAddToCartModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Photos */}
                <div>
                  <div className="mb-4">
                    <img
                      src={productDetails.photos?.[selectedPhotoIndex] || PLACEHOLDER_IMG}
                      alt="Product"
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {productDetails.photos && productDetails.photos.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {productDetails.photos.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhoto(idx)}
                          className={`border-2 rounded flex-shrink-0 ${
                            selectedPhotoIndex === idx ? 'border-primary' : 'border-gray-300'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Product ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side - Product Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{productDetails.name}</h3>
                    <p className="text-gray-600 mb-4">{productDetails.description}</p>
                    <div className="text-2xl font-bold text-primary">
                      ${formatPrice(getProductPrice(productDetails, selectedProductModel))}
                      {selectedProductModel?.price_modifier !== undefined && selectedProductModel.price_modifier > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Base: ${formatPrice(productDetails.price)} + ${selectedProductModel.price_modifier})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Model Selection */}
                  {productDetails.available_models && productDetails.available_models.length > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                      <div className="grid grid-cols-1 gap-2">
                        {productDetails.available_models.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => setSelectedProductModel(model)}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              selectedProductModel?.id === model.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{model.name}</span>
                              {model.price_modifier ? (
                                <span className="text-sm text-gray-600">+${model.price_modifier}</span>
                              ) : (
                                <span className="text-sm text-green-600">Included</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {productDetails.colors && productDetails.colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color: {selectedColor}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {productDetails.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              selectedColor === color
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {productDetails.sizes && productDetails.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size: {selectedSize}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {productDetails.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              selectedSize === size
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-lg min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 border rounded-lg hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => addToCart(productDetails)}
                      disabled={addingToCart}
                      className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {addingToCart ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart - ${formatPrice(getProductPrice(productDetails, selectedProductModel) * quantity)}
                        </>
                      )}
                    </button>
                    <button
                      onClick={closeAddToCartModal}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {cart.length ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {cart.map((item, index) => {
                    const photoUrl = (item.photos && item.photos.length > 0)
                      ? item.photos[0]
                      : PLACEHOLDER_IMG;
                    const itemPrice = getProductPrice(item, item.selectedModel);
                    return (
                      <div key={`${item.id}-${index}`} className="border rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <img
                            src={photoUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            {item.selectedColor && (
                              <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                            )}
                            {item.selectedSize && (
                              <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                            )}
                            {item.selectedModel && (
                              <p className="text-xs text-gray-500">Model: {item.selectedModel.name}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              ${formatPrice(itemPrice)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize, item.selectedModel?.id)}
                                disabled={item.quantity <= 1}
                                className="px-1 py-1 border rounded text-xs disabled:opacity-50"
                              >
                                −
                              </button>
                              <span className="text-xs w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize, item.selectedModel?.id)}
                                className="px-1 py-1 border rounded text-xs"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize, item.selectedModel?.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">${cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/cart')}
                    className="w-full bg-primary text-white py-2 rounded mb-2 hover:bg-primary/90"
                  >
                    View Full Cart
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Your cart is empty.</p>
                <button
                  onClick={() => setShowCart(false)}
                  className="mt-3 px-4 py-2 text-primary border border-primary rounded hover:bg-primary/5"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal (View Only) */}
      {showModal && productDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-md w-full mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Product Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{productDetails.name}</h3>
              <p className="mb-2 text-gray-600">{productDetails.description}</p>
              <p className="mb-4 font-semibold text-lg text-primary">Price: ${formatPrice(productDetails.price)}</p>
              {productDetails.photos?.length ? (
                <>
                  <div className="mb-4">
                    <img
                      src={productDetails.photos[selectedPhotoIndex]}
                      alt="Product"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  {productDetails.photos.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {productDetails.photos.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhoto(idx)}
                          className={`border-2 rounded flex-shrink-0 ${
                            selectedPhotoIndex === idx ? 'border-primary' : 'border-gray-300'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Product ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4">
                  <img
                    src={PLACEHOLDER_IMG}
                    alt="No image available"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    closeModal();
                    openAddToCartModal(productDetails);
                  }}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;