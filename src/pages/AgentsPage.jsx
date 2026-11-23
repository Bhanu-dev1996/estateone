import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, MagnifyingGlass, X, Buildings, User } from '@phosphor-icons/react';
import { SAMPLE_AGENTS, SAMPLE_BUILDERS, getRealAgentListings, getRealBuilderListings } from '../data/agents';
import { SAMPLE_PROPERTIES, CITIES } from '../data/properties';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import AgentCard from '../components/shared/AgentCard';
import BuilderCard from '../components/shared/BuilderCard';
import EmptyState from '../components/shared/EmptyState';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
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
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full">
      <Breadcrumbs items={[{ label: 'Verified directory' }]} className="mb-2" />

      <header className="listing-page-header mb-8">
        <div className="listing-page-header__row">
          <div className="listing-page-header__copy">
            <Badge variant="default" className="gap-1.5 text-caption font-semibold">
              <ShieldCheck size={14} weight="fill" className="text-brand-blue" aria-hidden />
              <span>RERA verified professional directory</span>
            </Badge>
            <h1 className="listing-page-header__title">Verified agents and builders.</h1>
            <p className="listing-page-header__desc">
              Connect directly with verified luxury advisors, licensed consultants, and premier real estate developers with verified active listing counts and transparent RERA disclosures.
            </p>
          </div>

          <div className="directory-segment self-start" role="tablist" aria-label="Directory segment">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'agents'}
            aria-label={`Verified advisors, ${filteredAgents.length} results`}
            onClick={() => handleTabChange('agents')}
            className={`directory-segment__btn ${activeTab === 'agents' ? 'is-active' : ''}`}
          >
            <User size={16} weight={activeTab === 'agents' ? 'bold' : 'regular'} aria-hidden />
            <span className="directory-segment__label directory-segment__label-short">
              Advisors ({filteredAgents.length})
            </span>
            <span className="directory-segment__label directory-segment__label-long">
              Verified advisors ({filteredAgents.length})
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'builders'}
            aria-label={`Master developers, ${filteredBuilders.length} results`}
            onClick={() => handleTabChange('builders')}
            className={`directory-segment__btn ${activeTab === 'builders' ? 'is-active' : ''}`}
          >
            <Buildings size={16} weight={activeTab === 'builders' ? 'bold' : 'regular'} aria-hidden />
            <span className="directory-segment__label directory-segment__label-short">
              Developers ({filteredBuilders.length})
            </span>
            <span className="directory-segment__label directory-segment__label-long">
              Master developers ({filteredBuilders.length})
            </span>
          </button>
          </div>
        </div>
      </header>

      <div className="listing-toolbar">
        <div className="listing-toolbar-search-wrap min-w-0 w-full lg:flex-1">
          <div className="listing-toolbar-search relative min-w-0 w-full">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden />
            <input
              type="search"
              placeholder={
                activeTab === 'agents'
                  ? 'Search advisor by name, company, or locality...'
                  : 'Search builder or master developer by name...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="listing-toolbar-input w-full pl-9 pr-9"
              aria-label={activeTab === 'agents' ? 'Search advisors' : 'Search developers'}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer transition-colors p-0.5"
              >
                <X size={14} weight="bold" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="listing-toolbar-controls">
            <div className="w-40">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="listing-toolbar-select">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialization Dropdown (Only for Agents) */}
            {activeTab === 'agents' && (
              <div className="w-44">
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger className="listing-toolbar-select">
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
                <SelectTrigger className="listing-toolbar-select">
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
              <button type="button" onClick={resetFilters} className="directory-filter-reset">
                Reset filters
              </button>
            )}
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
