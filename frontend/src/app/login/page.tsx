"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { BACKEND_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"OTP" | "PASSWORD">("OTP");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;

    if (authMode === "OTP") {
      setLoading(true);
      setError(null);

      try {
        await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: phoneOrEmail.trim() })
        });
      } catch {
        // Continue to verify screen in local mode
      } finally {
        setLoading(false);
        router.push(`/verify-otp?target=${encodeURIComponent(phoneOrEmail.trim())}`);
      }
    } else {
      localStorage.setItem("flq_token", `flq_${Date.now()}`);
      router.push("/account");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-20 font-sans">
      <div className="text-center mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">
          AUTHENTICATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-zinc-900">
          ACCESS YOUR ACCOUNT
        </h1>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Manage drop orders, address book, and FLIQ loyalty points.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-xs">
        {/* Auth Mode Toggle */}
        <div className="flex border-b border-zinc-200 mb-6">
          <button
            type="button"
            onClick={() => setAuthMode("OTP")}
            className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
              authMode === "OTP" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"
            }`}
          >
            PHONE OTP (FAST)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("PASSWORD")}
            className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
              authMode === "PASSWORD" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"
            }`}
          >
            PASSWORD LOGIN
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-xs font-mono border border-red-200">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5">
              {authMode === "OTP" ? "MOBILE PHONE NUMBER *" : "EMAIL ADDRESS *"}
            </label>
            <input
              type={authMode === "OTP" ? "tel" : "email"}
              required
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder={authMode === "OTP" ? "e.g. +91 98765 43210" : "e.g. collector@fliq.in"}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {authMode === "PASSWORD" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-mono font-bold uppercase text-zinc-700">PASSWORD *</label>
                <Link href="/forgot-password" className="text-[11px] font-mono text-acid font-bold uppercase hover:underline">
                  FORGOT?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Sparkles size={14} className="text-acid" />
            {loading ? "SENDING OTP..." : authMode === "OTP" ? "REQUEST 6-DIGIT OTP" : "SIGN IN TO ACCOUNT"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-200 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            NEW TO FLIQ?{" "}
            <Link href="/register" className="font-bold text-acid uppercase hover:underline">
              CREATE AN ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
