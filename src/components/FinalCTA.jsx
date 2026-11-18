import React from 'react';
import { MagnifyingGlass, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function FinalCTA({ onExploreClick }) {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="bg-brand-navy/95 backdrop-blur-3xl rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.35)] border-0">
        
        {/* Apple Ambient Golden Diffusion */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-brand-gold/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-[680px] mx-auto relative z-10">
          
          <Badge variant="default" className="bg-white/10 text-brand-gold border-white/20 mb-6 backdrop-blur-md">
            <ShieldCheck size={16} weight="fill" />
            <span>Risk free property discovery</span>
          </Badge>

          <h2 className="heading-2 tracking-tight mb-4 text-balance text-white">
            Ready to find your verified property in India?
          </h2>

          <p className="body-2 text-slate-300 mb-8 max-w-[600px] mx-auto text-pretty">
            Browse authentic apartments, villas, and commercial spaces today. No registration required, zero browsing fees, and direct contact with verified partners.
          </p>

          {/* Primary CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Button
              type="button"
              variant="accent"
              size="lg"
              onClick={onExploreClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl shadow-[0_6px_24px_rgba(197,164,109,0.35)] hover:scale-105"
            >
              <MagnifyingGlass size={18} weight="bold" />
              <span>Explore properties</span>
            </Button>
          </div>

          {/* Assurances & Risk Reversals in Floating Glass Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-8 border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <CheckCircle size={16} weight="fill" className="text-brand-gold" />
              <span>Free property discovery</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <CheckCircle size={16} weight="fill" className="text-brand-gold" />
              <span>Zero mandatory registration</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <CheckCircle size={16} weight="fill" className="text-brand-gold" />
              <span>No obligation site visits</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
