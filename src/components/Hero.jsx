import React from 'react';
import { 
  MagnifyingGlass, 
  MapPin, 
  Buildings, 
  CurrencyInr, 
  HouseLine,
  ShieldCheck 
} from '@phosphor-icons/react';
import { CITIES, PROPERTY_TYPES, BEDROOM_OPTIONS } from '../data/properties';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  intent,
  setIntent,
  budgetRange,
  setBudgetRange,
  selectedBedrooms,
  setSelectedBedrooms,
  onSearchSubmit
}) {
  const budgetOptions = [
    { id: 'all', label: 'Any budget' },
    { id: 'under-2cr', label: 'Under ₹2 Cr' },
    { id: '2cr-6cr', label: '₹2 Cr to ₹6 Cr' },
    { id: 'above-6cr', label: 'Above ₹6 Cr' },
  ];

  const quickFilterChips = [
    { label: 'All cities', action: () => setSelectedCity('All cities'), active: selectedCity === 'All cities' },
    { label: 'Apartments', action: () => setSelectedType('Apartment'), active: selectedType === 'Apartment' },
    { label: 'Luxury villas', action: () => { setSelectedType('Villa'); setIntent('buy'); }, active: selectedType === 'Villa' },
    { label: 'Penthouses', action: () => { setSelectedType('Penthouse'); setIntent('buy'); }, active: selectedType === 'Penthouse' },
    { label: 'Commercial', action: () => { setSelectedType('Commercial'); setIntent(''); }, active: selectedType === 'Commercial' },
  ];

  return (
    <section className="relative min-h-[92vh] md:min-h-[88vh] pt-32 pb-20 md:pt-40 md:pb-28 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      
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
          <ShieldCheck size={18} weight="fill" className="text-brand-gold" />
          <span className="caption-1 font-semibold text-white">
            RERA validated listings with direct agent and owner access
          </span>
        </div>

        {/* Hero Heading per B5: Max width 680px, gradient text */}
        <h1 className="heading-1 max-w-[680px] mb-6 text-balance tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          Find a verified property <br className="hidden sm:inline" />
          that feels like home
        </h1>

        {/* Subheadline per B5 */}
        <p className="body-2 text-slate-200 max-w-[680px] mb-10 text-pretty leading-relaxed">
          Discover verified apartments, modern villas, and commercial spaces across premier Indian cities with transparent pricing and zero duplicate listings.
        </p>

        {/* =========================================================================
            Airbnb Style Search Capsule for Hero Fields (Per User Request)
           ========================================================================= */}
        <div className="w-full max-w-5xl flex flex-col items-center">
          
          {/* Top Switcher Tabs + Live Status Pill */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 mb-3">
            
            {/* Category Switcher Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-xl p-1 rounded-full border border-white/20">
              {[
                { id: 'buy', label: 'Buy property' },
                { id: 'rent', label: 'Rent property' },
                { id: 'commercial', label: 'Commercial' },
                { id: 'villa', label: 'Luxury villas' },
              ].map((tab) => {
                const isActive = (tab.id === 'buy' && intent === 'buy' && selectedType !== 'Commercial' && selectedType !== 'Villa') ||
                                 (tab.id === 'rent' && intent === 'rent') ||
                                 (tab.id === 'commercial' && selectedType === 'Commercial') ||
                                 (tab.id === 'villa' && selectedType === 'Villa');

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (tab.id === 'buy') {
                        setIntent('buy');
                        setSelectedType('All types');
                      } else if (tab.id === 'rent') {
                        setIntent('rent');
                        setSelectedType('All types');
                      } else if (tab.id === 'commercial') {
                        setSelectedType('Commercial');
                        setIntent('');
                      } else if (tab.id === 'villa') {
                        setSelectedType('Villa');
                        setIntent('buy');
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-brand-navy shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Live Inventory Verification Signal */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live inventory verified</span>
            </div>

          </div>

          {/* The Iconic Airbnb Search Capsule Bar (Unified Pill Container) */}
          <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl lg:rounded-full p-2.5 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/60 transition-all text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:divide-x lg:divide-slate-200/90 gap-2 lg:gap-0">
              
              {/* Field 1: Where / Location */}
              <div className="flex-1 px-4 py-2 bg-transparent shadow-none border-0 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  <MapPin size={14} weight="fill" className="text-brand-blue" />
                  <span>Where</span>
                </div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:shadow-none h-6 p-0 font-medium text-brand-navy text-sm cursor-pointer">
                    <SelectValue placeholder="Search destinations" />
                  </SelectTrigger>
                  <SelectContent className="shadow-none border border-slate-200 bg-white">
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field 2: Property Type */}
              <div className="flex-1 px-4 py-2 bg-transparent shadow-none border-0 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  <Buildings size={14} weight="fill" className="text-brand-blue" />
                  <span>Type</span>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:shadow-none h-6 p-0 font-medium text-brand-navy text-sm cursor-pointer">
                    <SelectValue placeholder="All property types" />
                  </SelectTrigger>
                  <SelectContent className="shadow-none border border-slate-200 bg-white">
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field 3: Budget / Price */}
              <div className="flex-1 px-4 py-2 bg-transparent shadow-none border-0 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  <CurrencyInr size={14} weight="bold" className="text-brand-blue" />
                  <span>Price</span>
                </div>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:shadow-none h-6 p-0 font-medium text-brand-navy text-sm cursor-pointer">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className="shadow-none border border-slate-200 bg-white">
                    {budgetOptions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field 4: Rooms / BHK */}
              <div className="flex-1 px-4 py-2 bg-transparent shadow-none border-0 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  <HouseLine size={14} weight="fill" className="text-brand-blue" />
                  <span>Rooms</span>
                </div>
                <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:shadow-none h-6 p-0 font-medium text-brand-navy text-sm cursor-pointer">
                    <SelectValue placeholder="Add rooms" />
                  </SelectTrigger>
                  <SelectContent className="shadow-none border border-slate-200 bg-white">
                    {BEDROOM_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Search CTA Pill Button (Airbnb Iconic Circular/Pill Style) */}
              <div className="p-1 pl-2 shrink-0">
                <Button
                  type="button"
                  onClick={onSearchSubmit}
                  size="lg"
                  className="w-full lg:w-auto rounded-full px-6 py-3.5 bg-brand-navy hover:bg-slate-900 text-white font-heading font-semibold shadow-[0_6px_20px_rgba(20,43,74,0.35)] active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <MagnifyingGlass size={18} weight="bold" className="text-brand-gold shrink-0" />
                  <span className="text-sm font-semibold">Explore properties</span>
                </Button>
              </div>

            </div>
          </div>

          {/* Bottom Row: Quick Filter Chips + Free Search Trust Note */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 pt-4 text-xs text-slate-200">
            
            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white mr-1">
                Filter:
              </span>
              {quickFilterChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.action}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-all border-0 ${
                    chip.active
                      ? 'bg-white text-brand-navy font-semibold shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Popular Searches & Zero Fee Note */}
            <div className="flex items-center gap-3 text-slate-300 text-[11px]">
              <span className="hidden md:inline">
                Popular: 3 BHK Mumbai, Whitefield Villas
              </span>
              <span className="font-medium text-white">
                Free search without registration
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
