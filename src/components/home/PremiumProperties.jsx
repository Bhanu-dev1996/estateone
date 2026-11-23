import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import PropertyCard from '../shared/PropertyCard';

export default function PremiumProperties() {
  // Ultra luxury properties exceeding ₹10 Cr
  const premiumProperties = SAMPLE_PROPERTIES.filter(
    (p) => (p.priceValue && p.priceValue >= 100000000) || p.type === 'Penthouse' || p.type === 'Villa'
  ).slice(0, 3);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-label text-[#C5A46D] mb-2 block flex items-center gap-1.5">
            <Crown size={16} weight="fill" />
            <span>Ultra luxury collection</span>
          </span>
          <h2 className="text-h2 text-brand-navy">
            Premium properties
          </h2>
          <p className="mkt-section-desc">
            Signature estates, sea facing sky penthouses, and private architectural masterpieces curated for high net worth buyers.
          </p>
        </div>

        <Link
          to="/buy?budget=above-15cr"
          className="self-start md:self-auto mkt-section-link text-brand-blue hover:text-brand-navy transition-colors group flex items-center gap-1.5"
        >
          <span>Explore luxury portfolio</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

    </section>
  );
}
