import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlass, 
  MapPin, 
  Buildings, 
  CurrencyInr, 
  HouseLine,
  ShieldCheck,
  X,
  CaretDown
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { MKT_ICON } from '../lib/iconScale';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

const LOCATION_SUGGESTIONS = [
  { label: 'Mumbai, Maharashtra', city: 'Mumbai', type: 'City' },
  { label: 'Bengaluru, Karnataka', city: 'Bengaluru', type: 'City' },
  { label: 'Delhi NCR (Gurugram, Noida, Delhi)', city: 'Delhi NCR', type: 'City' },
  { label: 'Hyderabad, Telangana', city: 'Hyderabad', type: 'City' },
  { label: 'Pune, Maharashtra', city: 'Pune', type: 'City' },
  { label: 'Goa', city: 'Goa', type: 'City' },
  { label: 'Chennai, Tamil Nadu', city: 'Chennai', type: 'City' },
  { label: 'Worli, Mumbai', city: 'Mumbai', locality: 'Worli', type: 'Locality' },
  { label: 'Bandra West, Mumbai', city: 'Mumbai', locality: 'Bandra West', type: 'Locality' },
  { label: 'Bandra Kurla Complex (BKC), Mumbai', city: 'Mumbai', locality: 'BKC', type: 'Locality' },
  { label: 'Juhu, Mumbai', city: 'Mumbai', locality: 'Juhu', type: 'Locality' },
  { label: 'Indiranagar, Bengaluru', city: 'Bengaluru', locality: 'Indiranagar', type: 'Locality' },
  { label: 'Whitefield, Bengaluru', city: 'Bengaluru', locality: 'Whitefield', type: 'Locality' },
  { label: 'Golf Course Road, Gurugram', city: 'Delhi NCR', locality: 'Golf Course Road', type: 'Locality' },
  { label: 'Hitec City, Hyderabad', city: 'Hyderabad', locality: 'Hitec City', type: 'Locality' },
  { label: 'Koregaon Park, Pune', city: 'Pune', locality: 'Koregaon Park', type: 'Locality' }
];

const RESIDENTIAL_TYPES = [
  'All types',
  'Apartment',
  'Villa',
  'Penthouse',
  'Independent House',
  'Residential Plot'
];

const COMMERCIAL_TYPES = [
  'All commercial',
  'Commercial Office',
  'Retail Storefront',
  'Warehouse'
];

const BUY_BUDGETS = [
  { id: 'all', label: 'Any budget' },
  { id: 'under-1cr', label: 'Under ₹1 Cr' },
  { id: '1cr-3cr', label: '₹1 Cr to ₹3 Cr' },
  { id: '3cr-7cr', label: '₹3 Cr to ₹7 Cr' },
  { id: '7cr-15cr', label: '₹7 Cr to ₹15 Cr' },
  { id: 'above-15cr', label: 'Above ₹15 Cr' }
];

const RENT_BUDGETS = [
  { id: 'all', label: 'Any budget' },
  { id: 'under-50k', label: 'Under ₹50,000 / mo' },
  { id: '50k-1.5lac', label: '₹50,000 to ₹1.5 Lac / mo' },
  { id: '1.5lac-3lac', label: '₹1.5 Lac to ₹3 Lac / mo' },
  { id: 'above-3lac', label: 'Above ₹3 Lac / mo' }
];

const COMMERCIAL_BUDGETS = [
  { id: 'all', label: 'Any budget' },
  { id: 'under-1lac', label: 'Under ₹1 Lac / mo' },
  { id: '1lac-5lac', label: '₹1 Lac to ₹5 Lac / mo' },
  { id: 'above-5lac', label: 'Above ₹5 Lac / mo' }
];

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  intent = 'buy',
  setIntent,
  budgetRange = 'all',
  setBudgetRange,
  selectedBedrooms = 'Any rooms',
  setSelectedBedrooms,
  onSearchSubmit
}) {
  const navigate = useNavigate();
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
      return;
    }
    const targetRoute = intent === 'rent' ? '/rent' : (selectedType === 'Commercial' || intent === 'commercial') ? '/commercial' : '/buy';
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== 'All cities') params.set('city', selectedCity);
    if (selectedType && selectedType !== 'All types' && selectedType !== 'All commercial') params.set('type', selectedType);
    if (budgetRange && budgetRange !== 'all') params.set('budget', budgetRange);
    if (selectedBedrooms && selectedBedrooms !== 'Any rooms') params.set('bhk', selectedBedrooms);
    if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
    const q = params.toString();
    navigate(q ? `${targetRoute}?${q}` : targetRoute);
  };

  const isCommercial = intent === 'commercial' || selectedType === 'Commercial';

  const budgetOptions = 
    intent === 'rent' 
      ? RENT_BUDGETS 
      : isCommercial 
        ? COMMERCIAL_BUDGETS 
        : BUY_BUDGETS;

  const filteredLocations = (selectedCity && selectedCity !== 'All cities')
    ? LOCATION_SUGGESTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(selectedCity.toLowerCase()) ||
          s.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
          (s.locality && s.locality.toLowerCase().includes(selectedCity.toLowerCase()))
      )
    : LOCATION_SUGGESTIONS.slice(0, 8);

  return (
    <section
      aria-labelledby="hero-headline"
      className="hero-section relative z-20 min-h-[92vh] md:min-h-[88vh] pt-32 pb-36 md:pt-40 md:pb-48 px-4 flex flex-col items-center justify-center text-center"
    >
      
      {/* Luxury Architectural Background Image with Cinematic Scrim */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85" 
          alt="Luxury architectural property in India" 
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/75 to-slate-950/90 backdrop-blur-[0.5px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">
        
        {/* Frosted Proof Signal Badge per A2 & B8 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm mb-6 transition-all hover:bg-white/15">
          <ShieldCheck size={MKT_ICON.lg} weight="fill" className="text-brand-gold" aria-hidden />
          <span className="hero-eyebrow text-white">
            RERA validated listings with direct agent and owner access
          </span>
        </div>

        {/* Hero Heading per PRD 5.1 */}
        <h1 id="hero-headline" className="text-display hero-display-on-dark max-w-[760px] mb-6">
          Find your place in the world.
        </h1>

        {/* Subheadline per PRD 5.1 — lead token, 65ch measure (typography system §9.3) */}
        <p className="hero-lead-on-dark mb-10">
          Explore exceptional properties, discover the right neighbourhood, and make your next move with confidence.
        </p>

        {/* Hero search module — intent tabs on scrim + floating capsule */}
        <div className="hero-search-module w-full flex flex-col items-center sm:items-stretch gap-3">
          <div className="w-full flex justify-center sm:justify-start">
            <div
              role="tablist"
              aria-label="Property search intent"
              className="hero-intent-tabs"
            >
              {[
                { id: 'buy', label: 'Buy' },
                { id: 'rent', label: 'Rent' },
                { id: 'commercial', label: 'Commercial' },
              ].map((tab) => {
                const isCommercial =
                  selectedType === 'Commercial' || intent === 'commercial';
                const isActive =
                  (tab.id === 'buy' && intent === 'buy' && !isCommercial) ||
                  (tab.id === 'rent' && intent === 'rent') ||
                  (tab.id === 'commercial' && isCommercial);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      if (tab.id === 'buy') {
                        setIntent('buy');
                        setSelectedType('All types');
                      } else if (tab.id === 'rent') {
                        setIntent('rent');
                        setSelectedType('All types');
                      } else if (tab.id === 'commercial') {
                        setIntent('commercial');
                        setSelectedType('Commercial');
                      }
                    }}
                    className="hero-intent-tab"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hero-search-capsule w-full text-left">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:divide-x lg:divide-slate-200/80 gap-0">
              
              {/* Field 1: Location input with autocomplete per PRD 5.1 */}
              <div ref={locationRef} className="hero-search-field flex-1 min-w-0 relative">
                <div className="flex items-center gap-1 hero-field-label mb-0.5">
                  <MapPin size={MKT_ICON.sm} weight="fill" className="text-brand-blue shrink-0" aria-hidden />
                  <span>Location</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={selectedCity === 'All cities' ? '' : selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setLocationOpen(true);
                    }}
                    onFocus={() => setLocationOpen(true)}
                    placeholder="Search city, locality, or landmark..."
                    className="hero-field-value w-full bg-transparent border-0 p-0 focus:outline-none focus:ring-0 truncate"
                  />
                  {selectedCity && selectedCity !== 'All cities' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCity('All cities');
                        setLocationOpen(false);
                      }}
                      className="text-slate-400 hover:text-brand-navy ml-1 cursor-pointer"
                    >
                      <X size={MKT_ICON.xs} weight="bold" aria-hidden />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown suggestions list per PRD 5.1 */}
                {locationOpen && (
                  <div className="absolute top-full left-0 sm:left-2 mt-2.5 w-[340px] sm:w-[380px] max-w-[calc(100vw-40px)] bg-white rounded-3xl shadow-2xl shadow-black/20 border border-slate-100 p-2 z-50 text-left animate-in fade-in slide-in-from-top-1">
                    <ScrollArea className="h-64 sm:h-72 pr-1.5" type="always">
                      <ul className="space-y-0.5">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((item, idx) => (
                            <li
                              key={`${item.label}-${idx}`}
                              onClick={() => {
                                setSelectedCity(item.locality ? `${item.locality}, ${item.city}` : item.city);
                                setLocationOpen(false);
                              }}
                              className="px-3.5 py-2.5 rounded-2xl text-small flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-brand-navy cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <MapPin size={MKT_ICON.sm} className="text-brand-gold shrink-0" aria-hidden />
                                <span className="text-small font-semibold text-brand-navy truncate">{item.label}</span>
                              </div>
                              <span className="text-label font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 shrink-0 ml-2">
                                {item.type}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-small text-slate-400 text-center">
                            No matching locations found
                          </li>
                        )}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </div>

              {/* Field 2: Property Type Selector per PRD 5.1 */}
              <div className="hero-search-field flex-1 min-w-0">
                <div className="flex items-center gap-1 hero-field-label mb-0.5">
                  <Buildings size={MKT_ICON.sm} weight="fill" className="text-brand-blue shrink-0" aria-hidden />
                  <span>Property type</span>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="hero-field-value border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:shadow-none h-auto min-h-8 p-0 cursor-pointer truncate w-full [&_svg]:size-3.5">
                    <SelectValue placeholder="All property types" />
                  </SelectTrigger>
                  <SelectContent className="shadow-xl border border-slate-100 bg-white rounded-2xl p-1.5 max-h-64">
                    {(isCommercial ? COMMERCIAL_TYPES : RESIDENTIAL_TYPES).map((t) => (
                      <SelectItem key={t} value={t} className="rounded-xl text-small font-medium cursor-pointer">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field 3: Budget Range Selector per PRD 5.1 */}
              <div className="hero-search-field flex-1 min-w-0">
                <div className="flex items-center gap-1 hero-field-label mb-0.5">
                  <CurrencyInr size={MKT_ICON.sm} weight="bold" className="text-brand-blue shrink-0" aria-hidden />
                  <span>Budget range</span>
                </div>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger className="hero-field-value border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:shadow-none h-auto min-h-8 p-0 cursor-pointer truncate w-full [&_svg]:size-3.5">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className="shadow-xl border border-slate-100 bg-white rounded-2xl p-1.5 max-h-64">
                    {budgetOptions.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="rounded-xl text-small font-medium cursor-pointer">
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button per PRD 5.1 */}
              <div className="hero-search-field hero-search-field--cta shrink-0 flex items-center justify-center lg:justify-end">
                <Button
                  type="button"
                  onClick={handleSearchClick}
                  size="sm"
                  className="hero-search-cta w-full lg:w-auto min-h-10 px-5 rounded-full bg-brand-navy hover:bg-brand-navy-hover text-white shadow-[0_6px_20px_rgba(20,43,74,0.35)] active:scale-[0.98] border-0"
                >
                  <MagnifyingGlass size={MKT_ICON.md} weight="bold" className="text-brand-gold shrink-0" aria-hidden />
                  <span>Search</span>
                </Button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
