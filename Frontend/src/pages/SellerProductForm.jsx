import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ArrowLeft, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";

const inputClass =
  "w-full px-3 py-2.5 bg-white border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors";
const labelClass = "block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em] mb-1.5";

const emptyEmiPlan = () => ({ tenure: 6, interestRate: 0, monthlyPayment: 0, cashback: 0 });
const emptyVariant = () => ({
  name: "",
  storage: "",
  color: "",
  swatch: "#4a1d6e",
  image: "",
  mrp: 0,
  price: 0,
  emiPlans: [emptyEmiPlan()],
});

const authHeader = () => ({ Authorization: `Bearer ${Cookies.get("sellerToken")}` });

const SellerProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Smartphones");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([emptyVariant()]);
  const [fetching, setFetching] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    const loadProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/seller/products`, { headers: authHeader() });
        const found = (response.data.products || []).find((p) => p._id === id);
        if (!found) {
          setMessage("Product not found");
          return;
        }
        setName(found.name);
        setBrand(found.brand);
        setCategory(found.category);
        setDescription(found.description);
        setVariants(found.variants);
      } catch (error) {
        console.error("Error loading product:", error);
        setMessage("Failed to load product");
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id, isEdit]);

  const updateVariant = (index, field, value) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const updateEmiPlan = (vIndex, pIndex, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIndex ? { ...v, emiPlans: v.emiPlans.map((p, j) => (j === pIndex ? { ...p, [field]: value } : p)) } : v
      )
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariant = (index) => setVariants((prev) => prev.filter((_, i) => i !== index));
  const addEmiPlan = (vIndex) =>
    setVariants((prev) => prev.map((v, i) => (i === vIndex ? { ...v, emiPlans: [...v.emiPlans, emptyEmiPlan()] } : v)));
  const removeEmiPlan = (vIndex, pIndex) =>
    setVariants((prev) =>
      prev.map((v, i) => (i === vIndex ? { ...v, emiPlans: v.emiPlans.filter((_, j) => j !== pIndex) } : v))
    );

  const handleImageUpload = async (vIndex, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [vIndex]: true }));
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(`${API_URL}/seller/upload-image`, formData, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });
      updateVariant(vIndex, "image", response.data.url);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Image upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [vIndex]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (variants.some((v) => !v.image)) {
      setMessage("Every variant needs an image — upload one before saving.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const payload = { name, brand, category, description, variants };
      if (isEdit) {
        await axios.put(`${API_URL}/seller/products/${id}`, payload, { headers: authHeader() });
      } else {
        await axios.post(`${API_URL}/seller/products`, payload, { headers: authHeader() });
      }
      navigate("/seller/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center text-neutral-400">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-neutral-900 pb-20">
      <header className="bg-white border-b border-neutral-200 px-6 md:px-10 h-[72px] flex items-center gap-4">
        <Link to="/seller/dashboard" className="p-2 hover:bg-neutral-50 text-neutral-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl">{isEdit ? "Edit product" : "Add product"}</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 md:px-10 py-10 flex flex-col gap-6">
        {/* Basic info */}
        <section className="bg-white border border-neutral-200 p-6 flex flex-col gap-4">
          <h2 className="font-display text-lg">Basic details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product name</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="iPhone 17 Pro" required />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Apple" required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Smartphones" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this product worth an EMI..."
            />
          </div>
        </section>

        {/* Variants */}
        {variants.map((variant, vIndex) => (
          <section key={vIndex} className="bg-white border border-neutral-200 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Variant {vIndex + 1}</h2>
              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(vIndex)} className="text-neutral-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Variant name</label>
                <input
                  className={inputClass}
                  value={variant.name}
                  onChange={(e) => updateVariant(vIndex, "name", e.target.value)}
                  placeholder="256GB Cosmic Orange"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Storage</label>
                  <input className={inputClass} value={variant.storage} onChange={(e) => updateVariant(vIndex, "storage", e.target.value)} placeholder="256GB" />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input className={inputClass} value={variant.color} onChange={(e) => updateVariant(vIndex, "color", e.target.value)} placeholder="Cosmic Orange" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Swatch color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={variant.swatch}
                    onChange={(e) => updateVariant(vIndex, "swatch", e.target.value)}
                    className="w-10 h-10 border border-neutral-300 shrink-0"
                  />
                  <input className={inputClass} value={variant.swatch} onChange={(e) => updateVariant(vIndex, "swatch", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Product image</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 overflow-hidden bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                    {variant.image ? (
                      <img src={variant.image} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon size={18} className="text-neutral-300" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-sm font-medium cursor-pointer transition-colors">
                    <Upload size={14} />
                    {uploading[vIndex] ? "Uploading..." : variant.image ? "Replace" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading[vIndex]}
                      onChange={(e) => handleImageUpload(vIndex, e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>MRP (₹)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={variant.mrp}
                  onChange={(e) => updateVariant(vIndex, "mrp", Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={variant.price}
                  onChange={(e) => updateVariant(vIndex, "price", Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* EMI plans */}
            <div className="border-t border-neutral-200 pt-4 flex flex-col gap-3">
              <h3 className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.15em]">EMI plans</h3>
              {variant.emiPlans.map((plan, pIndex) => (
                <div key={pIndex} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end bg-neutral-50 border border-neutral-200 p-3">
                  <div>
                    <label className={labelClass}>Tenure (mo)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={plan.tenure}
                      onChange={(e) => updateEmiPlan(vIndex, pIndex, "tenure", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Interest %</label>
                    <input
                      type="number"
                      step="0.1"
                      className={inputClass}
                      value={plan.interestRate}
                      onChange={(e) => updateEmiPlan(vIndex, pIndex, "interestRate", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Monthly (₹)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={plan.monthlyPayment}
                      onChange={(e) => updateEmiPlan(vIndex, pIndex, "monthlyPayment", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Cashback (₹)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={plan.cashback}
                      onChange={(e) => updateEmiPlan(vIndex, pIndex, "cashback", Number(e.target.value))}
                    />
                  </div>
                  {variant.emiPlans.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmiPlan(vIndex, pIndex)}
                      className="flex items-center justify-center gap-1 py-2.5 border border-neutral-300 hover:border-red-600 hover:text-red-600 text-neutral-600 text-xs font-medium transition-colors"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addEmiPlan(vIndex)}
                className="self-start flex items-center gap-1 text-[var(--plum)] text-xs font-semibold hover:underline"
              >
                <Plus size={14} /> Add EMI plan
              </button>
            </div>
          </section>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="self-start flex items-center gap-2 px-4 py-2.5 border border-neutral-900 text-neutral-900 text-sm font-medium uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <Plus size={16} /> Add variant
        </button>

        {message && <p className="text-sm text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={loading || Object.values(uploading).some(Boolean)}
          className="self-start px-8 py-3.5 bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-medium uppercase tracking-[0.1em] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Save changes" : "List product"}
        </button>
      </form>
    </div>
  );
};

export default SellerProductForm;
