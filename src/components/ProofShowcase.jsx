import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Eye, 
  CalendarCheck, 
  Buildings, 
  MagnifyingGlass, 
  X, 
  ArrowCounterClockwise 
} from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import PropertyCard from './shared/PropertyCard';
import EmptyState from './shared/EmptyState';

export default function ProofShowcase({
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
  searchQuery = '',
  setSearchQuery,
  onSelectProperty,
  onScheduleVisit
}) {
  const [filterTab, setFilterTab] = useState('all');

  // Filter properties across all active criteria
  const filteredProperties = SAMPLE_PROPERTIES.filter((item) => {
    // City filter
    if (selectedCity && selectedCity !== 'All cities' && item.city !== selectedCity) return false;

    // Type filter from hero
    if (selectedType && selectedType !== 'All types' && item.type !== selectedType) return false;

    // Tab filter from section tabs
    if (filterTab !== 'all' && item.type.toLowerCase() !== filterTab) return false;

    // Intent filter (buy / rent)
    if (intent && item.intent !== intent) return false;

    // Budget range filter
    if (budgetRange === 'under-2cr' && item.priceValue > 20000000) return false;
    if (budgetRange === '2cr-6cr' && (item.priceValue < 20000000 || item.priceValue > 60000000)) return false;
    if (budgetRange === 'above-6cr' && item.priceValue < 60000000) return false;

    // Bedroom count filter
    if (selectedBedrooms && selectedBedrooms !== 'Any rooms') {
      if (selectedBedrooms === '2 Bed rooms' && item.bedroomCount !== 2) return false;
      if (selectedBedrooms === '3 Bed rooms' && item.bedroomCount !== 3) return false;
      if (selectedBedrooms === '4 Bed rooms' && item.bedroomCount !== 4) return false;
      if (selectedBedrooms === '5+ Bed rooms' && item.bedroomCount < 5) return false;
    }

    // Keyword search filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  // Calculate if any filters are currently active
  const hasActiveFilters = 
    (selectedCity && selectedCity !== 'All cities') ||
    (selectedType && selectedType !== 'All types') ||
    (filterTab !== 'all') ||
    (budgetRange && budgetRange !== 'all') ||
    (selectedBedrooms && selectedBedrooms !== 'Any rooms') ||
    (searchQuery && searchQuery.trim() !== '');

  const handleResetFilters = () => {
    if (setSelectedCity) setSelectedCity('All cities');
    if (setSelectedType) setSelectedType('All types');
    if (setBudgetRange) setBudgetRange('all');
    if (setSelectedBedrooms) setSelectedBedrooms('Any rooms');
    if (setSearchQuery) setSearchQuery('');
    setFilterTab('all');
  };

  return (
    <section id="properties" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 text-left">
        <div>
          <Badge variant="default" className="mb-3">
            <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
            <span>Curated verified inventory</span>
          </Badge>
          <h2 className="text-h2 text-brand-navy tracking-tight">
            Verified properties in India
          </h2>
          <p className="body-4 text-brand-muted mt-2 max-w-xl">
            Sample active listings undergoing strict RERA legal checks, physical validation, and direct owner contract confirmations.
          </p>
        </div>

        {/* Category Pill Tabs */}
        <Tabs 
          value={filterTab} 
          onValueChange={(val) => {
            setFilterTab(val);
            if (setSelectedType && val !== 'all') {
              const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
              setSelectedType(capitalized);
            } else if (setSelectedType && val === 'all') {
              setSelectedType('All types');
            }
          }}
        >
          <TabsList className="p-1.5 shadow-sm border-0 bg-slate-100 rounded-full">
            <TabsTrigger value="all" className="rounded-full text-xs cursor-pointer">All types</TabsTrigger>
            <TabsTrigger value="apartment" className="rounded-full text-xs cursor-pointer">Apartments</TabsTrigger>
            <TabsTrigger value="villa" className="rounded-full text-xs cursor-pointer">Villas</TabsTrigger>
            <TabsTrigger value="penthouse" className="rounded-full text-xs cursor-pointer">Penthouses</TabsTrigger>
            <TabsTrigger value="commercial" className="rounded-full text-xs cursor-pointer">Commercial</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Live Search and Active Filter Control Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-xs text-left">
        
        {/* Instant Search Box */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by locality, project name, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search input"
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy p-1 cursor-pointer"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Active Filters Pill Bar & Live Counter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-brand-navy mr-1">
            Showing {filteredProperties.length} verified listings
          </span>

          {hasActiveFilters && (
            <>
              {selectedCity && selectedCity !== 'All cities' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-medium">
                  <span>{selectedCity}</span>
                  <button 
                    type="button" 
                    aria-label={`Remove ${selectedCity} filter`}
                    onClick={() => setSelectedCity && setSelectedCity('All cities')} 
                    className="cursor-pointer hover:text-brand-navy"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}

              {selectedType && selectedType !== 'All types' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-medium">
                  <span>{selectedType}</span>
                  <button 
                    type="button" 
                    aria-label={`Remove ${selectedType} filter`}
                    onClick={() => {
                      if (setSelectedType) setSelectedType('All types');
                      setFilterTab('all');
                    }} 
                    className="cursor-pointer hover:text-brand-navy"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}

              {budgetRange && budgetRange !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-medium">
                  <span>
                    {budgetRange === 'under-2cr' ? 'Under ₹2 Cr' : budgetRange === '2cr-6cr' ? '₹2 Cr to ₹6 Cr' : 'Above ₹6 Cr'}
                  </span>
                  <button 
                    type="button" 
                    aria-label="Remove budget filter"
                    onClick={() => setBudgetRange && setBudgetRange('all')} 
                    className="cursor-pointer hover:text-brand-navy"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}

              {selectedBedrooms && selectedBedrooms !== 'Any rooms' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-medium">
                  <span>{selectedBedrooms}</span>
                  <button 
                    type="button" 
                    aria-label={`Remove ${selectedBedrooms} filter`}
                    onClick={() => setSelectedBedrooms && setSelectedBedrooms('Any rooms')} 
                    className="cursor-pointer hover:text-brand-navy"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="button-sm inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
              >
                <ArrowCounterClockwise size={14} weight="bold" />
                <span>Clear all</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Property Cards Grid using Shared Component (PRD 4.1, 4.2.3, 4.2.4, 4.2.12, 4.2.13) */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 text-left">
          {filteredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        /* Empty State with Working Reset Action (PRD 4.1 & 4.3) */
        <EmptyState
          title="No matching verified properties found"
          description="We could not find listings matching your search criteria. Try resetting city, budget, or bedroom filters to view available inventory."
          actionLabel="Reset all filters"
          onAction={handleResetFilters}
          className="mb-20"
        />
      )}

    </section>
  );
}
