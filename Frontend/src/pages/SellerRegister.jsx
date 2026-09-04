import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useNavigate, Link } from "react-router-dom";

const inputClass =
  "w-full px-3 py-2.5 border border-neutral-300 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors";
const labelClass = "block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em] mb-1.5";

const SellerRegister = () => {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_URL}/sellerregister`, {
        name,
        businessName,
        email,
        contact,
        password,
      });
      setMessage("success: Account created! You can log in now.");
      setTimeout(() => navigate("/seller/login"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--paper)] py-10">
      <div className="w-full max-w-sm p-10 border border-neutral-200 bg-white mx-4">
        <div className="text-center mb-9">
          <Link to="/" className="font-display text-3xl tracking-tight text-neutral-900">
            1<span className="text-[var(--plum)] italic">Fi</span>
          </Link>
          <p className="text-neutral-400 text-[11px] font-medium uppercase tracking-[0.2em] mt-3">Seller Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Business Name</label>
            <input type="text" placeholder="Acme Mobiles" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Number</label>
            <input type="tel" placeholder="9876543210" value={contact} onChange={(e) => setContact(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
            />
          </div>

          {message && (
            <p className={`text-sm ${message.startsWith("success") ? "text-emerald-700" : "text-red-600"}`}>
              {message.replace("success: ", "")}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-medium uppercase tracking-[0.1em] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create seller account"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-7">
          Already selling on 1Fi?{" "}
          <Link to="/seller/login" className="text-neutral-900 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerRegister;
