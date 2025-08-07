// src/pages/Checkout.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, CreditCard, User, MapPin, Receipt, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type PaymentMethod = 'cod' | 'card';

export type CartItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  photos?: string[];
  quantity: number;
};

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: '' | PaymentMethod;
}

type Step = 1 | 2 | 3 | 4;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load cart data
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (!saved) return;

    const savedCart: { id: number; quantity: number }[] = JSON.parse(saved);
    const ids = savedCart.map(i => i.id);
    console.log('Cart product IDs:', ids);

    fetch(`${API_BASE}/api/products`)
      .then(res => res.json())
      .then((allProducts: Omit<CartItem, 'quantity'>[]) => {
        const enriched: CartItem[] = savedCart
          .map(({ id, quantity }) => {
            const p = allProducts.find(prod => prod.id === id);
            return p
              ? { ...p, price: Number(p.price), quantity }
              : null;
          })
          .filter((x): x is CartItem => x !== null);
        setCart(enriched);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    } else {
      navigate('/cart');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        summary: { subtotal, tax, shipping, total },
        timestamp: new Date().toISOString()
      };

      await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      setSuccess(true);
      localStorage.removeItem('cart');
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Validation functions for each step
  const isStep1Valid = () => {
    return formData.fullName && formData.email && formData.phone;
  };

  const isStep2Valid = () => {
    return formData.address1 && formData.city && formData.postalCode && formData.country;
  };

  const isStep3Valid = () => {
    return formData.paymentMethod !== '';
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <Check className="w-5 h-5" />;
    if (step === 1) return <User className="w-5 h-5" />;
    if (step === 2) return <MapPin className="w-5 h-5" />;
    if (step === 3) return <CreditCard className="w-5 h-5" />;
    return <Receipt className="w-5 h-5" />;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Shipping Address';
      case 3: return 'Payment Method';
      case 4: return 'Order Review';
      default: return '';
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed!</h1>
          <p className="text-gray-600">Thank you! Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={handleBack} className="mr-4 p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${step <= currentStep 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-400 border-gray-300'
                    }
                  `}>
                    {getStepIcon(step)}
                  </div>
                  <span className={`
                    text-sm mt-2 transition-colors
                    ${step <= currentStep ? 'text-primary font-medium' : 'text-gray-400'}
                  `}>
                    Step {step}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-colors
                    ${step < currentStep ? 'bg-primary' : 'bg-gray-300'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Always visible */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul className="divide-y">
              {cart.map(item => (
                <li key={item.id} className="py-3 flex justify-between">
                  <span className="text-sm">{item.name} × {item.quantity}</span>
                  <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">{getStepTitle()}</h2>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      name="address1"
                      placeholder="Street address, P.O. box, company name"
                      required
                      value={formData.address1}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 2</label>
                    <input
                      type="text"
                      name="address2"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      value={formData.address2}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium mb-4">Choose Payment Method *</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="form-radio text-primary focus:ring-primary mr-4"
                        required
                      />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Pay when your order arrives at your doorstep</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="form-radio text-primary focus:ring-primary mr-4"
                        required
                      />
                      <div>
                        <span className="font-medium">Pay by Card</span>
                        <p className="text-sm text-gray-600">Secure payment with credit or debit card</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Order Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Personal Info Review */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Personal Information
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{formData.fullName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  {/* Address Review */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{formData.address1}</p>
                      {formData.address2 && <p>{formData.address2}</p>}
                      <p>{formData.city}, {formData.postalCode}</p>
                      <p>{formData.country}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Method
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pay by Card'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid()) ||
                    (currentStep === 3 && !isStep3Valid())
                  }
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || cart.length === 0}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    'Processing...'
                  ) : (
                    <>
                      <Receipt className="w-5 h-5 mr-2" />
                      Complete Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;