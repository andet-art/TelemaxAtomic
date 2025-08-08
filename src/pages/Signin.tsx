import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // ✅ Import context

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use context
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const base = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${base}/api/users/signin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ✅ Save token & user object to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // ✅ Properly store user
      login(res.data.user); // ✅ Pass user to context

      // ✅ Redirect to profile
      navigate('/profile');

    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials and try again.';
      setError(msg);
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
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox rounded border-border text-primary"
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 text-lg luxury-gradient font-bold"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <LogIn className="w-5 h-5 ml-2" />
            </Button>

            {/* Signup link */}
            <div className="text-center text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <a href="/signup" className="text-primary hover:underline">
                Create one
              </a>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signin;
