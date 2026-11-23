import React from 'react';
import { Link } from 'react-router-dom';
import { HouseLine, ShieldCheck, CheckCircle, ArrowRight } from '@phosphor-icons/react';

export default function ListPropertyCTA() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      <div className="relative rounded-3xl overflow-hidden bg-[#142B4A] text-white p-8 md:p-14 border-0 shadow-2xl">
        
        {/* Subtle Architectural Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A46D]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl">
          
          <span className="text-label text-[#C5A46D] mb-3 block flex items-center gap-2">
            <HouseLine size={20} weight="fill" />
            <span>For property owners and builders</span>
          </span>

          <h2 className="text-h2 text-white mb-4">
            List your verified property on EstateOne
          </h2>

          <p className="text-body-lg text-slate-300 mb-8 max-w-[65ch] text-pretty">
            Reach genuine, pre-qualified buyers and corporate tenants. Get dedicated RERA title screening, complimentary architectural photography, and direct coordinator management with zero ghost enquiries.
          </p>

          {/* Three Key Value Pillars */}
          <div className="flex flex-col lg:flex-row lg:flex-nowrap lg:items-center gap-3 lg:gap-5 mb-8 mkt-inline-stat text-slate-200">
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <CheckCircle size={14} weight="fill" className="text-[#C5A46D] shrink-0" aria-hidden />
              <span className="whitespace-nowrap">Zero upfront listing fee</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <CheckCircle size={14} weight="fill" className="text-[#C5A46D] shrink-0" aria-hidden />
              <span className="whitespace-nowrap">Verified buyers and tenants only</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <CheckCircle size={14} weight="fill" className="text-[#C5A46D] shrink-0" aria-hidden />
              <span className="whitespace-nowrap">Complimentary site visit manager</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row flex-wrap items-center gap-2.5">
            <Link
              to="/list-property"
              className="mkt-btn-primary mkt-btn-compact rounded-2xl bg-brand-gold hover:bg-amber-400 text-brand-navy inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>List your property now</span>
              <ArrowRight size={14} weight="bold" aria-hidden />
            </Link>

            <Link
              to="/agents"
              className="mkt-btn-secondary mkt-btn-compact rounded-2xl bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Find an accredited advisor</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
