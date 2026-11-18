import React from 'react';
import { Link } from 'react-router-dom';
import { HouseLine, ShieldCheck, CheckCircle, ArrowRight } from '@phosphor-icons/react';

export default function ListPropertyCTA() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      <div className="relative rounded-3xl overflow-hidden bg-[#142B4A] text-white p-8 md:p-14 border-0 shadow-2xl">
        
        {/* Subtle Architectural Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A46D]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          
          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-3 block flex items-center gap-2">
            <HouseLine size={18} weight="fill" />
            <span>For property owners and builders</span>
          </span>

          <h2 className="heading-2 text-white font-bold tracking-tight mb-4">
            List your verified property on EstateOne
          </h2>

          <p className="body-3 text-slate-300 leading-relaxed mb-8 max-w-2xl">
            Reach genuine, pre-qualified buyers and corporate tenants. Get dedicated RERA title screening, complimentary architectural photography, and direct coordinator management with zero ghost enquiries.
          </p>

          {/* Three Key Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-[#C5A46D] shrink-0" />
              <span>Zero upfront listing fee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-[#C5A46D] shrink-0" />
              <span>Verified buyers and tenants only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-[#C5A46D] shrink-0" />
              <span>Complimentary site visit manager</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/list-property"
              className="py-3.5 px-6 rounded-2xl bg-[#C5A46D] hover:bg-[#b0915d] text-brand-navy font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>List your property now</span>
              <ArrowRight size={14} weight="bold" />
            </Link>

            <Link
              to="/agents"
              className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Find an accredited advisor</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
