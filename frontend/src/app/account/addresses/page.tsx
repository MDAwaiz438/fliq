"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Trash2, Edit3, Check } from "lucide-react";

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: "addr_1",
      isDefault: true,
      name: "Rahul Sharma",
      line1: "Apartment 402, Sea Crest Towers",
      line2: "Worli Sea Face",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400018",
      phone: "+91 98765 43210",
    },
    {
      id: "addr_2",
      isDefault: false,
      name: "Rahul Sharma (Office)",
      line1: "Atelier Studio, Building 4B",
      line2: "Lower Parel Industrial Estate",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013",
      phone: "+91 98765 43210",
    },
  ]);

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </Link>

      <div className="border-b border-bone pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">ADDRESS BOOK</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">SAVED ADDRESSES</h1>
        </div>

        <button className="bg-bone text-white font-heading font-bold text-xs uppercase px-5 py-2.5 hover:bg-acid transition-colors flex items-center gap-2 cursor-pointer">
          <Plus size={16} /> ADD NEW ADDRESS
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white border border-zinc-200 p-6 rounded-sm relative hover:border-acid transition-colors shadow-xs">
            {addr.isDefault && (
              <span className="bg-acid text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase rounded-xs absolute top-4 right-4">
                DEFAULT ADDRESS
              </span>
            )}
            <h3 className="font-heading font-bold text-base uppercase text-bone mb-2">{addr.name}</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-body mb-4">
              {addr.line1}, {addr.line2}<br />
              {addr.city}, {addr.state} – {addr.pincode}<br />
              <span className="font-mono text-zinc-500">PHONE: {addr.phone}</span>
            </p>

            <div className="flex gap-3 border-t border-zinc-100 pt-4">
              <button className="font-heading font-bold text-xs uppercase text-zinc-600 hover:text-acid flex items-center gap-1 cursor-pointer">
                <Edit3 size={14} /> EDIT
              </button>
              <button className="font-heading font-bold text-xs uppercase text-zinc-600 hover:text-danger flex items-center gap-1 cursor-pointer">
                <Trash2 size={14} /> DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
