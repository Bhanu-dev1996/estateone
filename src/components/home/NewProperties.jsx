import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import PropertyCard from '../shared/PropertyCard';

export default function NewProperties() {
  // Fresh listings released this month
  const newProperties = SAMPLE_PROPERTIES.slice(3, 6);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-2 block flex items-center gap-1.5">
            <Clock size={14} weight="fill" />
            <span>Fresh to market</span>
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            New properties
          </h2>
          <p className="body-4 text-slate-500 mt-2 max-w-xl">
            Recently inspected and certified residences added to our verified real estate marketplace this month.
          </p>
        </div>

        <Link
          to="/buy"
          className="self-start md:self-auto flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-navy transition-colors group"
        >
          <span>View all new listings</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

    </section>
  );
}
