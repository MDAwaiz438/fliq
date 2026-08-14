"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">CLIENT SUPPORT & INQUIRIES</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">CONTACT FLIQ ATELIER</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
          <h2 className="font-heading font-bold text-xl uppercase text-bone mb-6">SEND A DIRECT MESSAGE</h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center">
              <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg uppercase text-emerald-900 mb-1">MESSAGE RECEIVED</h3>
              <p className="text-xs text-emerald-700">
                Our support team will respond to your inquiry within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">ORDER ID (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. FLIQ-10842"
                  className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">MESSAGE *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we can help with your order, sizing, or general inquiries..."
                  className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                SUBMIT INQUIRY <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-obsidian border border-zinc-200 p-6 rounded-sm flex items-start gap-4">
            <Mail size={24} className="text-acid shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-base uppercase text-bone mb-1">CLIENT SUPPORT EMAIL</h3>
              <p className="text-xs font-mono text-zinc-600 mb-1">support@fliqstreetwear.com</p>
              <p className="text-[11px] text-muted">Response within 24h Mon–Sat.</p>
            </div>
          </div>

          <div className="bg-obsidian border border-zinc-200 p-6 rounded-sm flex items-start gap-4">
            <Phone size={24} className="text-acid shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-base uppercase text-bone mb-1">WHATSAPP HELPLINE</h3>
              <p className="text-xs font-mono text-zinc-600 mb-1">+91 98765 43210</p>
              <p className="text-[11px] text-muted">10:00 AM – 7:00 PM IST (Mon–Fri)</p>
            </div>
          </div>

          <div className="bg-obsidian border border-zinc-200 p-6 rounded-sm flex items-start gap-4">
            <MapPin size={24} className="text-acid shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-base uppercase text-bone mb-1">ATELIER & HEADQUARTERS</h3>
              <p className="text-xs font-body text-zinc-600 leading-relaxed">
                FLIQ Atelier Studio, Building 4B, Lower Parel Industrial Estate, Mumbai, Maharashtra 400013.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
