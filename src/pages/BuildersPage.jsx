import React, { useState, useMemo } from 'react';
import { Buildings, MagnifyingGlass, X, ShieldCheck } from '@phosphor-icons/react';
import { SAMPLE_BUILDERS } from '../data/agents';
import { CITIES } from '../data/properties';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import BuilderCard from '../components/shared/BuilderCard';
import EmptyState from '../components/shared/EmptyState';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

export default function BuildersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All cities');

  const filteredBuilders = useMemo(() => {
    return SAMPLE_BUILDERS.filter((builder) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = builder.name.toLowerCase().includes(q);
        const inHq = builder.headquarters.toLowerCase().includes(q);
        const inTag = (builder.tagline || '').toLowerCase().includes(q);
        if (!inName && !inHq && !inTag) return false;
      }

      if (selectedCity !== 'All cities' && builder.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All cities');
  };

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Builders and developers' }
        ]} 
        className="mb-4" 
      />

      {/* Header Banner */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-3">
          <Buildings size={15} weight="fill" />
          <span>RERA registered developers</span>
        </span>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          Premier real estate builders.
        </h1>
        <p className="body-4 text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Discover verified real estate developers with proven track records of punctuality, structural excellence, and official RERA project registrations.
        </p>
      </div>

      {/* Search and City Filter Bar */}
      <div className="p-4 rounded-3xl bg-white shadow-xs border-0 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search builder by name or headquarters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer transition-colors"
            >
              <X size={13} weight="bold" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-44">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-10 rounded-2xl text-xs font-medium border-slate-200">
                <SelectValue placeholder="All territories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All cities">All territories</SelectItem>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || selectedCity !== 'All cities') && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-brand-blue font-semibold hover:underline cursor-pointer ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Builders Grid */}
      {filteredBuilders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilders.map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Buildings}
          title="No master developers found"
          description="We couldn't find any certified developers matching that name or territory. Try clearing your filters."
          actionLabel="Clear active filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
