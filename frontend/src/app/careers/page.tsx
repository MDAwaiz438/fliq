"use client";

import { Briefcase, ArrowRight, MapPin } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    { title: "SENIOR GARMENT PATTERNMAKER", department: "ATELIER DESIGN", location: "MUMBAI STUDIO", type: "FULL-TIME" },
    { title: "TEXTILE RESEARCH & DEVELOPMENT LEAD", department: "MATERIALS", location: "MUMBAI STUDIO", type: "FULL-TIME" },
    { title: "DIGITAL CAMPAIGN & ECOMMERCE MANAGER", department: "MARKETING", location: "HYBRID / MUMBAI", type: "FULL-TIME" },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">ATELIER CAREERS</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">JOIN THE FLIQ CREATIVE TEAM</h1>
      </div>

      <div className="space-y-4 max-w-3xl mb-12">
        {jobs.map((job, idx) => (
          <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-acid transition-colors shadow-xs">
            <div>
              <span className="font-mono text-xs text-acid font-bold uppercase">{job.department}</span>
              <h2 className="font-heading font-bold text-lg uppercase text-bone">{job.title}</h2>
              <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500 mt-1">
                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                <span>• {job.type}</span>
              </div>
            </div>

            <a
              href="mailto:careers@fliqstreetwear.com"
              className="bg-bone text-white font-heading font-bold text-xs uppercase px-5 py-2.5 hover:bg-acid transition-colors shrink-0 text-center"
            >
              APPLY NOW &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
