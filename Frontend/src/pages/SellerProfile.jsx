import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ArrowLeft, Store, Mail, Phone, LogOut } from "lucide-react";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-neutral-200 last:border-0">
    <span className="w-9 h-9 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-400">
      <Icon size={16} />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em]">{label}</p>
      <p className="text-neutral-900 truncate">{value || "—"}</p>
    </div>
  </div>
);

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/sellerprofile`, {
          headers: { Authorization: `Bearer ${Cookies.get("sellerToken")}` },
        });
        setProfile(response.data.profile);
      } catch (err) {
        console.error("Error fetching seller profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove("sellerToken");
    navigate("/seller/login");
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-neutral-900">
      <header className="bg-white border-b border-neutral-200 px-6 md:px-10 h-[72px] flex items-center gap-4">
        <Link to="/seller/dashboard" className="p-2 hover:bg-neutral-50 text-neutral-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl">Your profile</h1>
      </header>

      <main className="max-w-xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => <div key={n} className="h-16 bg-neutral-100 animate-pulse" />)}
          </div>
        ) : error || !profile ? (
          <p className="text-sm text-neutral-400">Couldn&apos;t load your profile. Try logging in again.</p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-16 h-16 rounded-full bg-neutral-900 text-white font-display text-2xl flex items-center justify-center shrink-0">
                {profile.businessName?.[0]?.toUpperCase() || profile.name?.[0]?.toUpperCase() || "S"}
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">{profile.businessName}</h2>
                <p className="text-neutral-400 text-sm">{profile.name}</p>
              </div>
            </div>

            <div className="border border-neutral-200 px-5">
              <Row icon={Store} label="Business name" value={profile.businessName} />
              <Row icon={Mail} label="Email" value={profile.email} />
              <Row icon={Phone} label="Contact number" value={profile.contact} />
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Link
                to="/seller/dashboard"
                className="px-6 py-2.5 border border-neutral-900 text-sm font-medium uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Back to dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 text-neutral-400 hover:text-red-600 text-sm font-medium uppercase tracking-wider transition-colors"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SellerProfile;
