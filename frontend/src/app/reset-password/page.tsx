"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto px-(--content-pad-x) pt-12 pb-20 font-body">
      <div className="text-center mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">SECURITY TOKEN VERIFIED</span>
        <h1 className="font-display text-4xl text-bone uppercase tracking-tight">SET NEW PASSWORD</h1>
      </div>

      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg uppercase text-emerald-900 mb-1">PASSWORD UPDATED</h3>
            <p className="text-xs text-emerald-700 font-body mb-4">
              Your password has been reset successfully.
            </p>
            <Link
              href="/login"
              className="inline-block bg-bone text-white font-heading font-bold text-xs uppercase px-6 py-2.5 hover:bg-acid transition-colors"
            >
              SIGN IN NOW
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">NEW PASSWORD *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">CONFIRM NEW PASSWORD *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer"
            >
              UPDATE PASSWORD
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
