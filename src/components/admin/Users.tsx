import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Search,
  Eye,
  X,
} from 'lucide-react';

type UserType = {
  id: number;
  name: string;
  email: string;
  orderCount?: number;
  totalSpent?: number;
};
type Activity = {
  action: string;
  details?: string;
  ip?: string;
  created_at: string;
};

interface Props {
  exportToCSV: (data: any[], filename: string) => void;
}

const API_BASE = import.meta.env.VITE_API_URL;

const Users: React.FC<Props> = ({ exportToCSV }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'highSpenders' | 'frequentBuyers'>('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showActFor, setShowActFor] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  async function loadActivities(userId: number) {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/activities`);
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  }

  const filtered = useMemo(() => {
    let result = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (filterBy === 'highSpenders') {
      result = result.filter((u) => (u.totalSpent || 0) > 500);
    } else if (filterBy === 'frequentBuyers') {
      result = result.filter((u) => (u.orderCount || 0) > 10);
    }

    return result;
  }, [users, search, filterBy]);

  const allSel = filtered.length && filtered.every((u) => selected.has(u.id));

  function toggleSelectAll() {
    if (allSel) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((u) => u.id)));
    }
  }

  function toggleSelect(id: number) {
    const newSel = new Set(selected);
    if (newSel.has(id)) {
      newSel.delete(id);
    } else {
      newSel.add(id);
    }
    setSelected(newSel);
  }

  if (loading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => exportToCSV(filtered, 'users')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} /> Export Users
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-8 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg p-2"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as any)}
        >
          <option value="all">All Users</option>
          <option value="highSpenders">High Spenders</option>
          <option value="frequentBuyers">Frequent Buyers</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">
                <input type="checkbox" checked={!!allSel} onChange={toggleSelectAll} />
              </th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-right">Orders</th>
              <th className="p-2 text-right">Total Spent</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(u.id)}
                    onChange={() => toggleSelect(u.id)}
                  />
                </td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 text-right">{u.orderCount || 0}</td>
                <td className="p-2 text-right">${u.totalSpent?.toFixed(2) || '0.00'}</td>
                <td className="p-2 text-center">
                  <button
                    className="text-purple-600"
                    onClick={() => {
                      setShowActFor(u.name);
                      loadActivities(u.id);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showActFor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Activity for {showActFor}</h3>
              <button onClick={() => setShowActFor('')} className="text-gray-600">
                <X size={18} />
              </button>
            </div>
            {activities.length > 0 ? (
              <ul className="space-y-2">
                {activities.map((a, i) => (
                  <li key={i} className="border-b pb-1">
                    <strong>{a.action}</strong> — {a.details} <br />
                    <span className="text-xs text-gray-500">
                      {a.ip} | {new Date(a.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No activity found.</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Users;
