import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Plus, Pencil, Trash2, LogOut, PackageSearch, User } from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/seller/products`, {
          headers: { Authorization: `Bearer ${Cookies.get("sellerToken")}` },
        });
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching seller products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    try {
      await axios.delete(`${API_URL}/seller/products/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("sellerToken")}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to delete product");
    }
  };

  const handleLogout = () => {
    Cookies.remove("sellerToken");
    navigate("/seller/login");
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-neutral-900">
      <header className="bg-white border-b border-neutral-200 px-6 md:px-10 h-[72px] flex items-center justify-between">
        <span className="font-display text-xl tracking-tight">
          1<span className="text-[var(--plum)] italic">Fi</span>{" "}
          <span className="text-neutral-400 text-sm font-sans uppercase tracking-wider">Seller</span>
        </span>
        <div className="flex items-center gap-2">
          <Link
            to="/seller/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-medium uppercase tracking-wider transition-colors"
          >
            <Plus size={15} /> Add product
          </Link>
          <Link
            to="/seller/profile"
            className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 hover:border-neutral-900 text-neutral-700 text-sm font-medium uppercase tracking-wider transition-colors"
          >
            <User size={15} /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-neutral-400 hover:text-neutral-900 text-sm font-medium uppercase tracking-wider transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <h1 className="font-display text-2xl mb-8">Your products</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center border border-dashed border-neutral-300">
            <div className="w-14 h-14 border border-neutral-300 flex items-center justify-center">
              <PackageSearch size={20} className="text-neutral-400" />
            </div>
            <h3 className="font-display text-xl text-neutral-500">You haven&apos;t listed anything yet</h3>
            <Link
              to="/seller/products/new"
              className="px-6 py-2.5 border border-neutral-900 text-sm font-medium uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
            >
              List your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div key={product._id} className="border border-neutral-200 flex flex-col">
                <div className="aspect-square bg-neutral-50 overflow-hidden flex items-center justify-center border-b border-neutral-200">
                  {product.variants?.[0]?.image && (
                    <img src={product.variants[0].image} alt={product.name} className="w-full h-full object-contain p-6" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em] mb-1">{product.brand}</p>
                    <h3 className="font-display text-lg leading-snug">{product.name}</h3>
                    <p className="text-sm text-neutral-400 mt-1">
                      {product.variants?.length || 0} variant{product.variants?.length === 1 ? "" : "s"} · From{" "}
                      {product.variants?.[0] ? formatCurrency(product.variants[0].price) : "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-auto pt-1">
                    <Link
                      to={`/seller/products/${product._id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-neutral-200 hover:border-neutral-900 text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-neutral-200 hover:border-red-600 hover:text-red-600 text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
