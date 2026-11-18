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
    <section id="properties" className="py-20 px-4 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 text-left">
        <div>
          <Badge variant="default" className="mb-3">
            <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
            <span>Curated verified inventory</span>
          </Badge>
          <h2 className="heading-2 text-brand-navy tracking-tight">
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
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
              >
                <ArrowCounterClockwise size={13} weight="bold" />
                <span>Clear all</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Property Cards Grid using Previous Design (Borderless Cards) */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 text-left">
          {filteredProperties.map((prop) => {
            const displayImage = prop.image || (prop.images && prop.images[0]) || '';
            return (
              <Card 
                key={prop.id}
                className="overflow-hidden flex flex-col justify-between group hover:scale-[1.01] hover:shadow-[0_24px_50px_rgba(0,0,0,0.1)] p-0 border-0"
              >
                <div>
                  {/* Image & Floating Glass Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={displayImage} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    
                    {/* Floating Glass Verification Pill */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <Badge variant="verified">
                        <ShieldCheck size={14} weight="fill" className="text-brand-blue" />
                        <span>RERA verified</span>
                      </Badge>
                      <Badge variant="accent">
                        {prop.status}
                      </Badge>
                    </div>

                    {/* Floating Glass Price Tag */}
                    <div className="absolute bottom-3 left-3 bg-brand-navy/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border-0 shadow-md">
                      <span className="title-2 font-bold text-white block">
                        {prop.priceDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={14} className="text-brand-blue" />
                        {prop.location}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{prop.reraId}</span>
                    </div>

                    <CardTitle className="group-hover:text-brand-blue transition-brand-fast">
                      {prop.title}
                    </CardTitle>

                    <CardDescription className="line-clamp-2 pt-1">
                      {prop.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Floating Glass Specs Capsule */}
                  <CardContent className="p-5 pt-0 pb-4">
                    <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-2xl bg-white/70 backdrop-blur-md border-0 text-center shadow-xs">
                      <div>
                        <span className="caption-4 font-semibold text-brand-navy block">{prop.bedrooms}</span>
                        <span className="caption-5 text-brand-muted text-[10px]">Bedrooms</span>
                      </div>
                      <div className="border-x border-slate-200/50">
                        <span className="caption-4 font-semibold text-brand-navy block">{prop.bathrooms}</span>
                        <span className="caption-5 text-brand-muted text-[10px]">Restrooms</span>
                      </div>
                      <div>
                        <span className="caption-4 font-semibold text-brand-navy block">{prop.area}</span>
                        <span className="caption-5 text-brand-muted text-[10px]">Carpet area</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer Actions using shadcn Buttons */}
                <CardFooter className="p-5 pt-0 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectProperty(prop)}
                    className="flex-1 bg-white/75 hover:bg-white border-0 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={16} />
                    <span>View details</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => onScheduleVisit(prop)}
                    className="flex-1 shadow-[0_4px_12px_rgba(20,43,74,0.2)] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CalendarCheck size={16} className="text-brand-gold" />
                    <span>Schedule visit</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State with Working Reset Action */
        <Card className="p-12 text-center my-8 border-0 shadow-sm bg-white/80 max-w-lg mx-auto">
          <Buildings size={40} className="text-brand-muted mx-auto mb-3" />
          <h4 className="title-1 text-brand-navy mb-2">No matching properties found</h4>
          <p className="body-4 text-brand-muted max-w-md mx-auto mb-6">
            We could not find listings matching your search criteria. Try resetting city, budget, or bedroom filters to view available inventory.
          </p>
          <Button
            type="button"
            onClick={handleResetFilters}
            className="cursor-pointer"
          >
            Reset all filters
          </Button>
        </Card>
      )}

      {/* Verification Architecture Glass Console */}
      <Card id="verification" className="p-8 md:p-12 mb-16 bg-white/75 backdrop-blur-2xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-left">
        <div className="max-w-[680px] mx-auto text-center mb-12">
          <Badge variant="default" className="mb-3">
            Trust architecture
          </Badge>
          <h3 className="heading-3 text-brand-navy mb-4 tracking-tight">
            Our three tier property verification protocol
          </h3>
          <p className="body-4 text-brand-muted">
            Every property undergoes physical and legal checks before earning the EstateOne verified badge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border-0 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-brand-blue flex items-center justify-center font-bold mb-4 shadow-xs">
              1
            </div>
            <h4 className="title-2 text-brand-navy font-semibold mb-2">
              Legal and RERA registry check
            </h4>
            <p className="body-5 text-brand-muted leading-relaxed">
              We validate state RERA certificates, sanctioned building layout plans, and title deed records against official land portals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border-0 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-brand-blue flex items-center justify-center font-bold mb-4 shadow-xs">
              2
            </div>
            <h4 className="title-2 text-brand-navy font-semibold mb-2">
              Geotagged physical inspection
            </h4>
            <p className="body-5 text-brand-muted leading-relaxed">
              Field coordinators inspect the physical property, confirm actual carpet measurements, and record high resolution photographs on site.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border-0 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-brand-blue flex items-center justify-center font-bold mb-4 shadow-xs">
              3
            </div>
            <h4 className="title-2 text-brand-navy font-semibold mb-2">
              Direct owner authorization
            </h4>
            <p className="body-5 text-brand-muted leading-relaxed">
              We obtain written consent from verified title holders or licensed developer representatives, preventing unverified broker reposts.
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-black/5" />

        <div className="flex flex-wrap items-center justify-between text-xs text-brand-muted gap-3">
          <span>Official RERA registries covered: MahaRERA, Karnataka RERA, Telengana RERA, HRERA</span>
          <span className="font-semibold text-brand-navy">Sample verification methodology</span>
        </div>
      </Card>

    </section>
  );
}
