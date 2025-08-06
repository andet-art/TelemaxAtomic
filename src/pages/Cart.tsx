// src/pages/Cart.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Product = {
  id: number;
  name: string;
  model_id: number;
  description: string;
  price: number | string;
  photos?: string[];
};

export type CartItem = Product & { quantity: number };

interface CartProps {
  cart?: CartItem[];
  onUpdateCart?: (cart: CartItem[]) => void;
}

const Cart: React.FC<CartProps> = ({ cart: initialCart = [], onUpdateCart }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Load cart from localStorage on mount if no initial cart provided
  useEffect(() => {
    if (initialCart.length === 0) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          localStorage.removeItem('cart');
        }
      }
    }
  }, [initialCart]);

  // Save cart to localStorage and notify parent component
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
    onUpdateCart?.(cart);
  }, [cart, onUpdateCart]);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'number' ? price : parseFloat(price) || 0;
    return num.toFixed(2);
  };

  const cartSubtotal = cart.reduce((sum, item) => 
    sum + parseFloat(String(item.price)) * item.quantity, 0
  );
  const taxRate = 0.1; // 10% tax
  const tax = cartSubtotal * taxRate;
  const shipping = cartSubtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = cartSubtotal + tax + shipping;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      // Simulate API call to process order
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: cartSubtotal,
        tax: tax,
        shipping: shipping,
        total: total,
        timestamp: new Date().toISOString()
      };

      // In a real app, you'd send this to your backend
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          setOrderSuccess(false);
          navigate('/orders');
        }, 3000);
      } else {
        throw new Error('Order processing failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <ShoppingCart className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          <p className="text-sm text-gray-500">Redirecting to orders page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/orders')}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          </div>
          <div className="flex items-center text-gray-600">
            <ShoppingCart className="w-6 h-6 mr-2" />
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Cart Items</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                <div className="divide-y">
                  {cart.map(item => {
                    const photoUrl = (item.photos && item.photos.length > 0) 
                      ? item.photos[0] 
                      : 'https://via.placeholder.com/100x100?text=No+Image';
                    
                    return (
                      <div key={item.id} className="p-6 flex items-start space-x-4">
                        <img
                          src={photoUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex items-center mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="mx-3 font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${formatPrice(parseFloat(String(item.price)) * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {cartSubtotal > 0 && cartSubtotal < 100 && (
                    <p className="text-sm text-gray-500">
                      Add ${(100 - cartSubtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cart.length === 0}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {checkoutLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/orders')}
                  className="w-full mt-3 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;