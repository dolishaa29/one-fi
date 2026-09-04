import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";

const inputClass =
  "w-full px-3 py-2.5 border border-neutral-300 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors";
const labelClass = "block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em] mb-1.5";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${API_URL}/sellerlogin`, { email, password });
      Cookies.set("sellerToken", response.data.token, { expires: 1 });
      navigate("/seller/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
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
          <p className="text-neutral-400 text-[11px] font-medium uppercase tracking-[0.2em] mt-3">Seller Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-medium uppercase tracking-[0.1em] transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-7">
          New to selling on 1Fi?{" "}
          <Link to="/seller/register" className="text-neutral-900 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
