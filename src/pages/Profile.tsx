
// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Phone,
  MapPin,
  Pencil,
  ShoppingBag,
  Heart,
  Star,
  User,
  LogOut,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      {/* Hero Banner */}
      <div className="relative h-52 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-primary dark:to-indigo-700 shadow-lg">
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex items-center gap-6">
          <img

            src={userData.avatar || 'https://i.pravatar.cc/150'}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-white dark:border-border shadow-xl"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
            <p className="text-white/80">Joined {userData.joined || 'Unknown date'}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <button className="px-3 py-2 text-sm bg-white text-black dark:bg-zinc-800 dark:text-white rounded-md hover:bg-white/90 dark:hover:bg-zinc-700 flex items-center gap-1">

              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm text-zinc-800 dark:text-white/80">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />

                {userData.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500" />
                {userData.phone || 'No phone provided'}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-yellow-500" />
                {(userData.city || 'City not set') +
                  ', ' +
                  (userData.country || 'Country not set')}
              </div>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Account Preferences</h2>
            <ul className="text-sm text-zinc-800 dark:text-white/80 space-y-2">
              <li>🌐 Language: English</li>
              <li>🌙 Theme: Auto</li>
              <li>🔒 2FA: Enabled</li>
              <li>📦 Notifications: Subscribed</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[

              {
                icon: ShoppingBag,
                label: 'Orders',
                value: userData.orders || 0,
                bg: 'from-indigo-300 to-indigo-500 dark:from-indigo-700 dark:to-indigo-900',
              },
              {
                icon: Heart,
                label: 'Favorites',
                value: userData.favorites || 0,
                bg: 'from-pink-300 to-pink-500 dark:from-pink-600 dark:to-pink-800',
              },
              {
                icon: Star,
                label: 'Reviews',
                value: userData.reviews || 0,
                bg: 'from-yellow-300 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700',
              },
              {
                icon: User,
                label: 'Addresses',
                value: userData.addresses || 0,
                bg: 'from-cyan-300 to-cyan-500 dark:from-cyan-600 dark:to-cyan-800',
              },

            ].map(({ icon: Icon, label, value, bg }, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 text-center text-white shadow-lg bg-gradient-to-br ${bg}`}
              >
                <Icon className="mx-auto" />
                <p className="text-lg font-bold mt-2">{value}</p>
                <p className="text-xs text-white/80">{label}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-4 text-sm text-zinc-700 dark:text-white/80">
              {userData.recentActivity?.length ? (
                userData.recentActivity.map((activity: string, idx: number) => (
                  <li
                    key={idx}
                    className="border-b border-zinc-300 dark:border-zinc-700 pb-3"
                  >
                    {activity}
                  </li>
                ))
              ) : (
                <li>No recent activity</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
