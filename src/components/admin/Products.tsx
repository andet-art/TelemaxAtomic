import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number | string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editedPrice, setEditedPrice] = useState<{ [key: number]: number }>({});

  const API_URL = "http://134.122.71.254:4000/api/products";

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePriceChange = async (id: number) => {
    const newPrice = editedPrice[id];
    if (newPrice === undefined) return;

    const confirmUpdate = window.confirm(`Are you sure you want to change the price to $${newPrice}?`);
    if (!confirmUpdate) {
      setEditedPrice((prev) => ({ ...prev, [id]: Number(products.find((p) => p.id === id)?.price) || 0 }));
      return;
    }

    try {
      const updatedProducts = products.map((p) =>
        p.id === id ? { ...p, price: newPrice } : p
      );
      setProducts(updatedProducts);

      const productToUpdate = updatedProducts.find((p) => p.id === id);
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToUpdate),
      });

      alert("Price updated successfully!");
    } catch (err) {
      console.error("Error updating price:", err);
      alert("Failed to update price.");
    }
  };

  const updateStock = async (id: number, value: number) => {
    const confirmUpdate = window.confirm(`Are you sure you want to change the stock to ${value}?`);
    if (!confirmUpdate) return;

    try {
      const updatedProducts = products.map((p) =>
        p.id === id ? { ...p, stock: value } : p
      );
      setProducts(updatedProducts);

      const productToUpdate = updatedProducts.find((p) => p.id === id);
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToUpdate),
      });

      alert("Stock updated successfully!");
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Failed to update stock.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Products</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Price ($)</th>
            <th style={styles.th}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>{p.id}</td>
              <td style={styles.td}>{p.name}</td>
              <td style={styles.td}>{p.description}</td>
              <td style={styles.td}>
                <input
                  type="number"
                  value={(editedPrice[p.id] ?? Number(p.price)) || 0}
                  onChange={(e) =>
                    setEditedPrice((prev) => ({
                      ...prev,
                      [p.id]: Number(e.target.value),
                    }))
                  }
                  onBlur={() => savePriceChange(p.id)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  value={Number(p.stock) || 0}
                  onChange={(e) =>
                    updateStock(p.id, Number(e.target.value))
                  }
                  style={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "15px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    color: "#555",
    padding: "12px 15px",
    textAlign: "left",
  },
  td: {
    padding: "12px 15px",
    textAlign: "left",
  },
  rowEven: {
    backgroundColor: "#fafafa",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },
  input: {
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "80px",
  },
};

export default Products;
