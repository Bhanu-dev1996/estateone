import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Buildings, 
  House, 
  Sparkle, 
  TreeEvergreen, 
  MapTrifold, 
  Storefront, 
  Warehouse, 
  ArrowRight 
} from '@phosphor-icons/react';

const PROPERTY_TYPES = [
  {
    title: 'Luxury apartments',
    type: 'Apartment',
    count: '320+ listings',
    route: '/buy?type=Apartments',
    icon: Buildings,
    description: 'High rise condominiums and sea facing multi bedroom residences'
  },
  {
    title: 'Private villas',
    type: 'Villa',
    count: '110+ listings',
    route: '/buy?type=Villas',
    icon: House,
    description: 'Gated enclave villas with private gardens and personal pools'
  },
  {
    title: 'Sky penthouses',
    type: 'Penthouse',
    count: '45+ listings',
    route: '/buy?type=Penthouses',
    icon: Sparkle,
    description: 'Panoramic rooftop residences with private elevator access'
  },
  {
    title: 'Independent houses',
    type: 'House',
    count: '80+ listings',
    route: '/buy?type=Independent Houses',
    icon: TreeEvergreen,
    description: 'Standalone family bungalows and heritage freehold houses'
  },
  {
    title: 'Residential plots',
    type: 'Plot',
    count: '65+ listings',
    route: '/buy?type=Residential Plots',
    icon: MapTrifold,
    description: 'Verified demarcated land plots with clear legal title records'
  },
  {
    title: 'Commercial offices',
    type: 'Office',
    count: '90+ listings',
    route: '/commercial?type=Office Spaces',
    icon: Buildings,
    description: 'Grade A corporate headquarters and furnished executive office suites'
  },
  {
    title: 'Retail storefronts',
    type: 'Retail',
    count: '55+ listings',
    route: '/commercial?type=Retail Shops',
    icon: Storefront,
    description: 'High footfall retail showrooms and flagship retail spaces'
  },
  {
    title: 'Warehouses and logistics',
    type: 'Warehouse',
    count: '35+ listings',
    route: '/commercial?type=Warehouses',
    icon: Warehouse,
    description: 'Industrial logistics parks with multi dock loading facilities'
  }
];

export default function BrowseByType() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-label text-[#C5A46D] mb-2 block">
            Asset categories
          </span>
          <h2 className="text-h2 text-brand-navy">
            Browse by property type
          </h2>
          <p className="mkt-section-desc">
            Find the exact architectural category tailored to your family residence or corporate expansion.
          </p>
        </div>

        <Link
          to="/buy"
          className="self-start md:self-auto mkt-section-link text-brand-blue hover:text-brand-navy transition-colors group flex items-center gap-1.5"
        >
          <span>View all categories</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PROPERTY_TYPES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              to={cat.route}
              className="group p-6 rounded-3xl bg-white border-0 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-[#142B4A] text-brand-navy group-hover:text-[#C5A46D] flex items-center justify-center transition-colors mb-4">
                  <Icon size={24} weight="duotone" />
                </div>
                <h3 className="text-h4 text-brand-navy font-bold group-hover:text-brand-blue transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="caption-2 text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-small font-bold text-slate-400">
                  {cat.count}
                </span>
                <span className="text-brand-blue group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={14} weight="bold" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
