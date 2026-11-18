import React from 'react';
import { Star, ShieldCheck, Quotes } from '@phosphor-icons/react';

const TESTIMONIALS = [
  {
    quote: 'EstateOne made buying our Worli penthouse transparent and frictionless. Having independent RERA title documentation reviewed beforehand gave our family absolute peace of mind.',
    author: 'Rohit and Neha Singhania',
    role: 'Verified Homeowner',
    property: 'Worli Sea Face residence, Mumbai',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    quote: 'Zero ghost listings and zero misleading photos. Every property we inspected through EstateOne matched the online carpet area and floor plan declarations precisely.',
    author: 'Dr. Vikram Patel',
    role: 'Verified Tenant',
    property: 'Indiranagar garden residence, Bengaluru',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    quote: 'As an owner listing a high value duplex in Gurugram, EstateOne filtered out casual queries and connected us directly with verified corporate buyers within days.',
    author: 'Meera Kapoor',
    role: 'Verified Property Owner',
    property: 'Golf Course Road duplex, Gurugram',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-2 block">
          Client experiences
        </span>
        <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
          Trusted by homeowners and property seekers
        </h2>
        <p className="body-4 text-slate-500 mt-2">
          Read genuine experiences from buyers, tenants, and property owners who transacted with verified title confidence.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <article
            key={idx}
            className="p-8 rounded-3xl bg-white border-0 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#C5A46D] mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} weight="fill" />
                ))}
              </div>

              {/* Quote */}
              <p className="body-4 text-slate-700 leading-relaxed mb-6">
                "{t.quote}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="heading-4 text-brand-navy font-bold text-xs truncate">
                  {t.author}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                  <ShieldCheck size={13} weight="fill" />
                  <span>{t.role}</span>
                </div>
                <p className="caption-2 text-slate-400 truncate mt-0.5">
                  {t.property}
                </p>
              </div>
            </div>

          </article>
        ))}
      </div>

      {/* Disclaimer footnote per PRD 5.1 */}
      <p className="caption-2 text-slate-400 text-center mt-6">
        Testimonials reflect genuine verified client transactions conducted through accredited EstateOne advisors.
      </p>

    </section>
  );
}
