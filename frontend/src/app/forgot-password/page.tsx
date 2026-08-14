"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-(--content-pad-x) pt-12 pb-20 font-body">
      <Link href="/login" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO LOGIN
      </Link>

      <div className="text-center mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">PASSWORD RECOVERY</span>
        <h1 className="font-display text-4xl text-bone uppercase tracking-tight">RESET YOUR PASSWORD</h1>
      </div>

      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg uppercase text-emerald-900 mb-1">RECOVERY LINK SENT</h3>
            <p className="text-xs text-emerald-700 font-body">
              We sent password reset instructions to <strong>{email}</strong>. Check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">REGISTERED EMAIL ADDRESS *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer"
            >
              SEND RESET LINK
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
