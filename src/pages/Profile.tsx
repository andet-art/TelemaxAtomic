import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Phone, MapPin, User, Shield } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Profile: React.FC = () => {
  const { user } = useAuth();
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
  }, [user]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
        <h1 className="text-3xl font-bold mb-6">Welcome, {userData.name}</h1>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Mail className="text-primary" />
            <span>{userData.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-green-500" />
            <span>{userData.phone || 'No phone provided'}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-yellow-500" />
            <span>
              {userData.city || 'City not set'}, {userData.country || 'Country not set'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="text-blue-500" />
            <span className="capitalize">Role: {userData.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-muted-foreground" />
            <span>User ID: {userData.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
