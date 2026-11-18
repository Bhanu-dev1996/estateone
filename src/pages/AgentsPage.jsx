import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  MagnifyingGlass, 
  MapPin, 
  X, 
  Buildings, 
  User, 
  SlidersHorizontal,
  Star,
  CheckCircle,
  Phone
} from '@phosphor-icons/react';
import { SAMPLE_AGENTS, SAMPLE_BUILDERS, getRealAgentListings, getRealBuilderListings } from '../data/agents';
import { SAMPLE_PROPERTIES, CITIES } from '../data/properties';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import AgentCard from '../components/shared/AgentCard';
import BuilderCard from '../components/shared/BuilderCard';
import EmptyState from '../components/shared/EmptyState';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function AgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab: 'agents' | 'builders'
  const tabParam = searchParams.get('tab') || 'agents';
  const [activeTab, setActiveTab] = useState(tabParam);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter Agents
  const filteredAgents = useMemo(() => {
    return SAMPLE_AGENTS.filter((agent) => {
      // 1. Search Query (Name, company, areas)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = agent.name.toLowerCase().includes(q);
        const inCompany = agent.company.toLowerCase().includes(q);
        const inCity = agent.city.toLowerCase().includes(q);
        const inAreas = (agent.areasServed || '').toLowerCase().includes(q);
        if (!inName && !inCompany && !inCity && !inAreas) return false;
      }

      // 2. City Filter
      if (selectedCity !== 'All cities' && agent.city !== selectedCity) {
        return false;
      }

      // 3. Specialization Filter
      if (selectedSpecialization !== 'all') {
        const spec = agent.specialization?.toLowerCase() || '';
        if (selectedSpecialization === 'luxury' && !spec.includes('luxury') && !spec.includes('seafront') && !spec.includes('penthouse')) return false;
        if (selectedSpecialization === 'commercial' && !spec.includes('commercial') && !spec.includes('office')) return false;
        if (selectedSpecialization === 'villas' && !spec.includes('villa') && !spec.includes('heritage') && !spec.includes('plot')) return false;
      }

      // 4. Property Category Filter
      if (selectedCategory !== 'all') {
        const cats = agent.propertyCategories || [];
        if (selectedCategory === 'buy' && !cats.includes('Residential buy')) return false;
        if (selectedCategory === 'rent' && !cats.includes('Residential rent')) return false;
        if (selectedCategory === 'commercial' && !cats.includes('Commercial')) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, selectedSpecialization, selectedCategory]);

  // Filter Builders
  const filteredBuilders = useMemo(() => {
    return SAMPLE_BUILDERS.filter((builder) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = builder.name.toLowerCase().includes(q);
        const inHq = builder.headquarters.toLowerCase().includes(q);
        const inCity = builder.city?.toLowerCase().includes(q);
        if (!inName && !inHq && !inCity) return false;
      }

      if (selectedCity !== 'All cities' && builder.city !== selectedCity) {
        return false;
      }

      if (selectedCategory !== 'all') {
        const cats = builder.propertyCategories || [];
        if (selectedCategory === 'buy' && !cats.includes('Residential buy')) return false;
        if (selectedCategory === 'commercial' && !cats.includes('Commercial')) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, selectedCategory]);

  const activeFiltersCount = (selectedCity !== 'All cities' ? 1 : 0) +
                             (selectedSpecialization !== 'all' ? 1 : 0) +
                             (selectedCategory !== 'all' ? 1 : 0) +
                             (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All cities');
    setSelectedSpecialization('all');
    setSelectedCategory('all');
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Verified directory' }
        ]} 
        className="mb-4" 
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
              <ShieldCheck size={15} weight="fill" />
              <span>RERA verified professional directory</span>
            </span>
          </div>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Verified agents and builders.
          </h1>
          <p className="body-4 text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Connect directly with verified luxury advisors, licensed consultants, and premier real estate developers with verified active listing counts and transparent RERA disclosures.
          </p>
        </div>

        {/* Directory Segment Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs self-start lg:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('agents')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'agents'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
            }`}
          >
            <User size={15} weight={activeTab === 'agents' ? 'bold' : 'regular'} />
            <span>Verified advisors ({filteredAgents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('builders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'builders'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
            }`}
          >
            <Buildings size={15} weight={activeTab === 'builders' ? 'bold' : 'regular'} />
            <span>Master developers ({filteredBuilders.length})</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-3xl bg-white shadow-xs border-0 mb-8 space-y-4">
        
        {/* Top Bar: Search Input and City Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'agents' 
                  ? 'Search advisor by name, company, or locality...'
                  : 'Search builder or master developer by name...'
              }
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

          {/* Quick Filter Selectors Cluster */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* City Dropdown */}
            <div className="w-40">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-10 rounded-2xl text-xs font-medium border-slate-200">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All cities">All cities</SelectItem>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialization Dropdown (Only for Agents) */}
            {activeTab === 'agents' && (
              <div className="w-44">
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger className="h-10 rounded-2xl text-xs font-medium border-slate-200">
                    <SelectValue placeholder="All specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All specializations</SelectItem>
                    <SelectItem value="luxury">Luxury and seafront</SelectItem>
                    <SelectItem value="commercial">Commercial Grade A</SelectItem>
                    <SelectItem value="villas">Villas and estates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Property Category Dropdown */}
            <div className="w-40">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 rounded-2xl text-xs font-medium border-slate-200">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="buy">Residential buy</SelectItem>
                  {activeTab === 'agents' && <SelectItem value="rent">Residential rent</SelectItem>}
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-brand-blue font-semibold hover:underline cursor-pointer ml-1"
              >
                Reset filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Directory Results */}
      {activeTab === 'agents' ? (
        filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={User}
            title="No certified advisors found"
            description="No real estate consultants matched your search query and filter criteria. Try choosing another city or clearing your search."
            actionLabel="Reset active filters"
            onAction={resetFilters}
          />
        )
      ) : (
        filteredBuilders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuilders.map((builder) => (
              <BuilderCard key={builder.id} builder={builder} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Buildings}
            title="No master developers found"
            description="No real estate developers matched your search query. Try choosing another territory or clearing your search."
            actionLabel="Reset active filters"
            onAction={resetFilters}
          />
        )
      )}

    </div>
  );
}
