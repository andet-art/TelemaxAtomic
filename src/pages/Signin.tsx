// src/pages/Signin.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Ensure baseURL is set
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation<{ from?: Location }>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/users/signin', { email, password });
      if (res.data?.user && res.data?.token) {
        login(res.data.user, res.data.token);
        const from = location.state?.from?.pathname || '/profile';
        navigate(from, { replace: true });
      } else {
        setError('Server did not return expected user/token');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl shadow-lg">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Secure Access</span>
            </div>
            <h1 className="text-3xl font-black">Sign In to Your Account</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3 text-muted-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox rounded border-border text-primary"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <Button
              type="submit"
              className="w-full py-3 text-lg luxury-gradient font-bold"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <LogIn className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <Link to="/join" className="text-primary hover:underline">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signin;
