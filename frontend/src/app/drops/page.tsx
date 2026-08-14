"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Calendar, KeyRound, Sparkles, Check, X, Bell } from "lucide-react";
import WaitlistModal from "@/components/product/WaitlistModal";

export default function DropsPage() {
  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 17,
    hours: 14,
    minutes: 32,
    seconds: 48
  });

  // VIP Pass modal
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipCodeInput, setVipCodeInput] = useState("");
  const [vipUnlocked, setVipUnlocked] = useState(false);
  const [vipError, setVipError] = useState<string | null>(null);

  // Waitlist modal
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-09-01T18:00:00Z").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnlockVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (vipCodeInput.trim().toUpperCase() === "FLIQVIP" || vipCodeInput.trim().toUpperCase() === "DROP04") {
      setVipUnlocked(true);
      setVipError(null);
      setTimeout(() => {
        setIsVipModalOpen(false);
      }, 1500);
    } else {
      setVipError("Invalid VIP Atelier Pass Key. Try 'FLIQVIP' or 'DROP04'");
    }
  };

  const drops = [
    {
      id: "drop-04",
      slug: "drop-04-cyber-monolith",
      number: "DROP 04",
      title: "CYBER MONOLITH",
      releaseDate: "2026-09-01T18:00:00Z",
      status: "UPCOMING",
      description: "Heavyweight 450GSM loopback cotton, metallic hardware accents, and reflective high-density prints.",
      itemCount: 8,
      image: "/images/product_distortion.png",
      tag: "NEXT DROP",
    },
    {
      id: "drop-03",
      slug: "drop-03-distortion",
      number: "DROP 03",
      title: "DISTORTION",
      releaseDate: "2026-08-10T12:00:00Z",
      status: "LIVE NOW",
      description: "Acid-washed silhouettes, asymmetrical zip hoodies, oversized box-fit graphic tees.",
      itemCount: 12,
      image: "/images/polo_knit.png",
      tag: "SELLING FAST",
    },
    {
      id: "drop-02",
      slug: "drop-02-raw-edge",
      number: "DROP 02",
      title: "RAW EDGE ATELIER",
      releaseDate: "2026-05-15T00:00:00Z",
      status: "ARCHIVE",
      description: "Unfinished hems, distressed ribbing, double-layer visors, micro-embroidered badges.",
      itemCount: 10,
      image: "/images/shirt_viscose.png",
      tag: "SOLD OUT",
    },
    {
      id: "drop-01",
      slug: "drop-01-genesis",
      number: "DROP 01",
      title: "GENESIS ZERO",
      releaseDate: "2026-02-01T00:00:00Z",
      status: "ARCHIVE",
      description: "The founding batch. Heavy box-cut garments with industrial rubberized patches.",
      itemCount: 6,
      image: "/images/shirt_brown.png",
      tag: "ARCHIVED",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-20 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">
          RELEASE CALENDAR &amp; ARCHIVE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-zinc-900">
          LIMITED DROP SCHEDULE
        </h1>
        <p className="text-zinc-600 text-xs sm:text-sm max-w-2xl mt-2 font-mono leading-relaxed">
          FLIQ operates on strict limited batch drops. Once a drop sells out, it transitions to the permanent archive and is never re-produced.
        </p>
      </div>

      {/* Featured Upcoming Hero Drop with Real-Time Countdown */}
      <div className="bg-zinc-950 text-white p-6 sm:p-10 rounded-2xl mb-14 relative overflow-hidden shadow-2xl border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-acid/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-acid text-white font-mono text-[11px] font-bold px-3 py-1 uppercase rounded-md flex items-center gap-1.5 shadow-xs">
                <Clock size={14} className="animate-pulse" /> UPCOMING RELEASE
              </span>
              <span className="font-mono text-xs text-zinc-400">SEPT 01, 2026 • 18:00 IST</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-3">
              DROP 04: CYBER MONOLITH
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-mono">
              An exploration of architectural silhouettes and industrial techwear fabrics. Featuring 450GSM loopback hoodie chassis, laser-etched hardware, and water-repellent ripstop trousers.
            </p>

            {/* Live Ticking Countdown Box */}
            <div className="grid grid-cols-4 gap-2.5 bg-zinc-900/90 p-4 border border-zinc-800 rounded-xl text-center mb-6 max-w-md shadow-inner">
              <div className="bg-black/50 p-2 rounded-lg border border-zinc-800/80">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">DAYS</span>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-zinc-800/80">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">HOURS</span>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-zinc-800/80">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">MINS</span>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-zinc-800/80">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-acid tabular-nums">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">SECS</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="bg-white text-zinc-900 font-mono font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Bell size={14} className="text-acid" /> NOTIFY ME AT LAUNCH
              </button>

              <button
                onClick={() => setIsVipModalOpen(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg border border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <KeyRound size={14} className="text-amber-400" />
                {vipUnlocked ? "VIP PASS UNLOCKED ✓" : "ENTER VIP PASS"}
              </button>
            </div>
          </div>

          <div className="relative aspect-4/3 sm:aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
            <Image
              src="/images/product_distortion.png"
              alt="Drop 04 Teaser"
              fill
              className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            />
            {vipUnlocked && (
              <div className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-lg uppercase">
                VIP ALLOCATION ACTIVE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drops Grid */}
      <h2 className="font-bold text-xl uppercase tracking-wider text-zinc-900 mb-6 flex items-center gap-2 font-mono">
        <Calendar size={18} className="text-acid" /> ALL DROPS ARCHIVE &amp; CATALOG
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col sm:flex-row group hover:border-zinc-900 transition-all shadow-xs"
          >
            <div className="sm:w-2/5 relative aspect-square bg-zinc-100 shrink-0">
              <Image
                src={drop.image}
                alt={drop.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span
                className={`absolute top-3 left-3 text-[10px] font-mono font-bold px-2 py-0.5 uppercase rounded ${
                  drop.status === 'LIVE NOW'
                    ? 'bg-acid text-white'
                    : drop.status === 'UPCOMING'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {drop.tag}
              </span>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <span className="font-mono text-xs font-bold text-acid block mb-1">{drop.number}</span>
                <h3 className="text-lg font-bold uppercase text-zinc-900 mb-1.5">{drop.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4 font-mono">{drop.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-2">
                <span className="text-xs font-mono text-zinc-500 font-bold">{drop.itemCount} PIECES</span>
                <Link
                  href={`/drops/${drop.slug}`}
                  className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-900 hover:text-acid flex items-center gap-1"
                >
                  EXPLORE DROP &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= VIP PASS MODAL ================= */}
      {isVipModalOpen && (
        <div
          className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsVipModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-zinc-200">
            <button
              onClick={() => setIsVipModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {vipUnlocked ? (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">VIP Access Unlocked</h3>
                <p className="text-xs text-zinc-500 font-mono">
                  Welcome back! You have 30 minutes early guaranteed reservation pass for Drop 04.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUnlockVip} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <KeyRound size={18} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                    VIP EARLY ACCESS PASS
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-zinc-900 leading-snug">
                    Enter Atelier Access Key
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">
                    VIP passholders unlock garments 30 minutes before public drop.
                  </p>
                </div>

                {vipError && (
                  <p className="text-xs text-red-600 font-mono bg-red-50 p-2.5 rounded-lg border border-red-200">
                    ✕ {vipError}
                  </p>
                )}

                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1.5 uppercase">
                    Passcode / Invite Key
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter pass e.g. FLIQVIP"
                    value={vipCodeInput}
                    onChange={(e) => setVipCodeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs font-mono uppercase text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  Unlock Guaranteed Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= WAITLIST MODAL ================= */}
      {isWaitlistOpen && (
        <WaitlistModal
          productSlug="drop-04-cyber-monolith"
          productTitle="Drop 04: Cyber Monolith Collection"
          onClose={() => setIsWaitlistOpen(false)}
        />
      )}
    </div>
  );
}
