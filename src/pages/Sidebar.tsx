import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Category = { id: number; name: string };
type Model    = { id: number; name: string; category_id: number };
type Product  = { id: number; name: string; model_id: number };

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [models,     setModels]     = useState<Model[]>([]);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string|null>(null);
  const [openCat,    setOpenCat]    = useState<number|null>(null);
  const [openModel,  setOpenModel]  = useState<number|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [catsRes, modsRes, prodsRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories`),
          fetch(`${API_BASE}/api/models`),
          fetch(`${API_BASE}/api/products`),
        ]);

        if (!catsRes.ok) throw new Error(`Categories fetch failed: ${catsRes.status}`);
        if (!modsRes.ok) throw new Error(`Models fetch failed: ${modsRes.status}`);
        if (!prodsRes.ok) throw new Error(`Products fetch failed: ${prodsRes.status}`);

        const [cats, mods, prods] = await Promise.all([
          catsRes.json(),
          modsRes.json(),
          prodsRes.json(),
        ]);

        console.log('✅ Categories:', cats);
        console.log('✅ Models:', mods);
        console.log('✅ Products:', prods);

        setCategories(cats);
        setModels(mods);
        setProducts(prods);
      } catch (err: any) {
        console.error('❌ Sidebar fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading) return <aside className="w-64 p-4">Loading…</aside>;
  if (error)   return <aside className="w-64 p-4 text-red-500">Error: {error}</aside>;

  return (
    <aside className="w-64 h-screen bg-white border-r overflow-y-auto fixed top-0 left-0">
      <nav className="p-4 space-y-2">
        {categories.map(cat => (
          <div key={cat.id}>
            <button
              onClick={() => {
                setOpenCat(prev => prev === cat.id ? null : cat.id);
                setOpenModel(null);
              }}
              className="w-full text-left font-semibold hover:text-primary"
            >
              {cat.name}
            </button>

            {openCat === cat.id && (
              <div className="ml-4 mt-1 space-y-1">
                {models
                  .filter(m => m.category_id === cat.id)
                  .map(m => (
                    <div key={m.id}>
                      <button
                        onClick={() =>
                          setOpenModel(prev => prev === m.id ? null : m.id)
                        }
                        className="w-full text-left hover:text-primary"
                      >
                        {m.name}
                      </button>
                      {openModel === m.id && (
                        <ul className="ml-4 list-disc space-y-1">
                          {products
                            .filter(p => p.model_id === m.id)
                            .map(p => (
                              <li key={p.id}>
                                <button
                                  onClick={() => navigate(`/products/${p.id}`)}
                                  className="hover:underline"
                                >
                                  {p.name}
                                </button>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
