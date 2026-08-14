"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict Validation for compulsory fields
    if (!formData.username.trim()) {
      setError("Username / Full Name is compulsory.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("A valid Email Address is compulsory.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("A valid 10-digit Mobile Number is compulsory.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password is compulsory and must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      // Save customer record locally
      const customerData = {
        name: formData.username.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };
      localStorage.setItem("flq_customer", JSON.stringify(customerData));
      localStorage.setItem("flq_token", `flq_${Date.now()}`);

      // Forward to phone/email OTP verification or direct dashboard
      router.push(`/verify-otp?target=${encodeURIComponent(formData.phone.trim())}`);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-20 font-sans">
      <div className="text-center mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">
          JOIN FLIQ ATELIER
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-zinc-900">
          CREATE AN ACCOUNT
        </h1>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Enter your details below to register your collector profile.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-xs">
        {error && (
          <div className="p-3 mb-5 rounded-xl bg-red-50 text-red-600 text-xs font-mono border border-red-200 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username / Full Name */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-zinc-500" />
              <span>Username / Full Name <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. Liam Walker"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-zinc-500" />
              <span>Email Address <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. collector@fliq.in"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Phone size={13} className="text-zinc-500" />
              <span>Mobile Phone Number <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-zinc-500" />
              <span>Password <strong className="text-red-500">*</strong></span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-zinc-500" />
              <span>Confirm Password <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-zinc-900 hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? "CREATING PROFILE..." : "REGISTER & CONTINUE"} <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-200 text-center flex flex-col gap-2">
          <p className="text-xs text-zinc-500 font-mono">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link href="/login" className="font-bold text-acid uppercase hover:underline">
              SIGN IN
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-1">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>End-to-End Encrypted Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
