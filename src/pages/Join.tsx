// src/pages/Join.tsx
import React, { useState } from 'react';
import { Sparkles, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Join: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    avatar_url: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://134.122.71.254:4000';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postal_code: formData.postal_code,
        avatar_url: formData.avatar_url
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert('✅ Account created!');
        navigate('/profile');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl w-full glass-card p-10 rounded-2xl shadow-lg">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">Welcome to Telemax</span>
          </div>
          <h1 className="text-3xl font-black">Create Your Account</h1>
          <p className="text-muted-foreground text-sm">
            Sign up below to access premium features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-1 block">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm mb-1 block">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
                placeholder="+38970xxxxxx"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-1 block">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Country & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-1 block">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">Postal Code</label>
              <input
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="text-sm mb-1 block">Avatar URL</label>
            <input
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              placeholder="https://i.pravatar.cc/150?u=telemax"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-1 block">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm mb-1 block">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              placeholder="Repeat password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="form-checkbox text-primary"
            />
            <label className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms}</p>}

          {/* Submit */}
          <Button type="submit" className="w-full py-3 text-lg luxury-gradient font-bold" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            <UserPlus className="w-5 h-5 ml-2" />
          </Button>

          {/* Sign in link */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Join;
