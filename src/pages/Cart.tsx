// src/pages/Cart.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from '@/components/Footer';
import { ShoppingBag, Trash2 } from 'lucide-react';

type CartItem = {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  photo?: string;
};

const PLACEHOLDER = 'https://via.placeholder.com/100?text=No+Image';

const formatPrice = (price: number | string) => {
  const num = typeof price === 'number' ? price : parseFloat(price) || 0;
  return num.toFixed(2);
};

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateQty = (id: number, qty: number) => {
    setCart(items =>
      items
        .map(i => i.id === id ? { ...i, quantity: qty } : i)
        .filter(i => i.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(items => items.filter(i => i.id !== id));
  };

  const total = cart
    .reduce((sum, i) => sum + parseFloat(String(i.price)) * i.quantity, 0)
    .toFixed(2);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 ml-64 pt-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <ShoppingBag /> Your Cart
          </h1>

          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center border rounded-lg overflow-hidden">
                    <img
                      src={item.photo || PLACEHOLDER}
                      alt={item.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <h2 className="font-medium">{item.name}</h2>
                      <p className="text-sm text-gray-600">
                        ${formatPrice(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 px-4">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="px-2 py-1 border rounded"
                      >+</button>
                    </div>
                    <div className="px-4 flex flex-col items-end">
                      <p className="font-semibold">
                        ${(parseFloat(String(item.price)) * item.quantity).toFixed(2)}
                      </p>
                      <button onClick={() => removeItem(item.id)} className="mt-2 text-red-500">
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-xl font-semibold">Total: ${total}</p>
                <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
