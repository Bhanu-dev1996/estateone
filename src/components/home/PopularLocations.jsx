import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Buildings } from '@phosphor-icons/react';

const POPULAR_LOCATIONS = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Sea view residences and BKC executive office suites',
    count: '180+ verified residences',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Worli', 'Bandra West', 'BKC', 'Juhu']
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Modern tech corridor villas and garden apartments',
    count: '140+ verified residences',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Indiranagar', 'Whitefield', 'Koramangala', 'Sadashivnagar']
  },
  {
    city: 'Delhi NCR',
    state: 'National Capital Region',
    tagline: 'Golf course residences and corporate towers',
    count: '120+ verified residences',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Golf Course Road', 'Cyber City', 'Greater Kailash', 'Noida Expressway']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Gated luxury villas and financial district penthouses',
    count: '95+ verified residences',
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Jubilee Hills', 'Hitec City', 'Gachibowli', 'Madhapur']
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    tagline: 'Verdant township homes and lifestyle condominiums',
    count: '85+ verified residences',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Koregaon Park', 'Kalyani Nagar', 'Baner', 'Boat Club Road']
  },
  {
    city: 'Goa',
    state: 'Goa',
    tagline: 'Portuguese heritage estates and coastal retreat villas',
    count: '45+ holiday estates',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Assagao', 'Anjuna', 'Candolim', 'Aldona']
  }
];

export default function PopularLocations() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-2 block">
            Territory discovery
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            Popular locations
          </h2>
          <p className="body-4 text-slate-500 mt-2 max-w-xl">
            Explore exceptional residences and commercial developments across premier Indian metropolitan centres.
          </p>
        </div>

        <Link
          to="/buy"
          className="self-start md:self-auto flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-navy transition-colors group"
        >
          <span>View all locations</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_LOCATIONS.map((loc) => (
          <Link
            key={loc.city}
            to={`/buy?city=${encodeURIComponent(loc.city)}`}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border-0 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 text-white"
          >
            {/* Background Image with Cinematic Scrim */}
            <img
              src={loc.image}
              alt={`${loc.city} real estate`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Top Pill */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white shadow-xs">
                <Buildings size={13} />
                <span>{loc.count}</span>
              </span>
            </div>

            {/* Content Details */}
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-[#C5A46D] font-semibold mb-1">
                <MapPin size={13} weight="fill" />
                <span>{loc.state}</span>
              </div>
              
              <h3 className="heading-3 text-white font-bold tracking-tight mb-1.5">
                {loc.city}
              </h3>

              <p className="caption-2 text-slate-300 line-clamp-1 mb-3">
                {loc.tagline}
              </p>

              {/* Localities Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {loc.popularLocalities.slice(0, 3).map((locality) => (
                  <span
                    key={locality}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-slate-200"
                  >
                    {locality}
                  </span>
                ))}
              </div>
            </div>

          </Link>
        ))}
      </div>

    </section>
  );
}
