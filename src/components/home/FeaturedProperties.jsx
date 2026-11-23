import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, ArrowRight } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import PropertyCard from '../shared/PropertyCard';

export default function FeaturedProperties() {
  const featured = SAMPLE_PROPERTIES.filter((p) => p.featured || p.guestFavorite).slice(0, 3);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="mkt-section-eyebrow flex items-center gap-1.5 mb-2">
            <Sparkle size={14} weight="fill" />
            <span>Curated residences</span>
          </div>
          <h2 className="text-h2 text-brand-navy">
            Featured properties
          </h2>
          <p className="mkt-section-desc">
            Handpicked verified residences with certified clear title deeds, state RERA approvals, and direct seller pricing.
          </p>
        </div>

        <Link
          to="/buy"
          className="self-start md:self-auto mkt-section-link text-brand-blue hover:text-brand-navy transition-colors group flex items-center gap-1.5"
        >
          <span>View all featured properties</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

    </section>
  );
}
