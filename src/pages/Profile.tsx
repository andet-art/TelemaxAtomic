import React from 'react';
import { Mail, Phone, MapPin, Pencil, ShoppingBag, Heart, Star, User } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'Gerti Rexhepi',
    email: 'gerti@example.com',
    phone: '+389 70 123 456',
    location: 'Skopje, North Macedonia',
    avatar: 'https://i.pravatar.cc/150?img=5',
    joined: 'Joined March 2024',
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      {/* Hero Banner */}
      <div className="relative h-52 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-primary dark:to-indigo-700 shadow-lg">
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex items-center gap-6">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-white dark:border-border shadow-xl"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-white/80">{user.joined}</p>
            <button className="mt-3 px-4 py-2 text-sm bg-white text-black dark:bg-zinc-800 dark:text-white rounded-md hover:bg-white/90 dark:hover:bg-zinc-700 flex items-center gap-2">
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
                {user.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500" />
                {user.phone}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-yellow-500" />
                {user.location}
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
              { icon: ShoppingBag, label: 'Orders', value: 18, bg: 'from-indigo-300 to-indigo-500 dark:from-indigo-700 dark:to-indigo-900' },
              { icon: Heart, label: 'Favorites', value: 35, bg: 'from-pink-300 to-pink-500 dark:from-pink-600 dark:to-pink-800' },
              { icon: Star, label: 'Reviews', value: 12, bg: 'from-yellow-300 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700' },
              { icon: User, label: 'Addresses', value: 5, bg: 'from-cyan-300 to-cyan-500 dark:from-cyan-600 dark:to-cyan-800' },
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
              <li className="border-b border-zinc-300 dark:border-zinc-700 pb-3">
                Ordered <span className="font-medium text-black dark:text-white">Atomic Jet Lighter</span> – 2 days ago
              </li>
              <li className="border-b border-zinc-300 dark:border-zinc-700 pb-3">
                Reviewed <span className="font-medium text-black dark:text-white">Wooden Pipe Deluxe</span> – 5 stars
              </li>
              <li>
                Updated profile – 1 week ago
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
