"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";

export default function AccountProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </Link>

      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">MEMBER CREDENTIALS</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">PROFILE & SECURITY</h1>
      </div>

      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">FULL NAME *</label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">EMAIL ADDRESS *</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">PHONE NUMBER (OTP VERIFIED) *</label>
            <input
              type="tel"
              required
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saved ? "CHANGES SAVED!" : "UPDATE PROFILE"} {saved && <CheckCircle2 size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
