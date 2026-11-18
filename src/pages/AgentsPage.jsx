import React, { useState } from 'react';
import { ShieldCheck, MagnifyingGlass } from '@phosphor-icons/react';
import { SAMPLE_AGENTS } from '../data/agents';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import AgentCard from '../components/shared/AgentCard';
import EmptyState from '../components/shared/EmptyState';

export default function AgentsPage() {
  const [search, setSearch] = useState('');

  const filteredAgents = SAMPLE_AGENTS.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      a.name.toLowerCase().includes(q) || 
      a.city.toLowerCase().includes(q) || 
      (a.specialization && a.specialization.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs items={[{ label: 'Verified advisors' }]} className="mb-4" />

      {/* Header Banner */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-3">
          <ShieldCheck size={15} weight="fill" />
          <span>Professional directory</span>
        </span>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          Verified real estate advisors
        </h1>
        <p className="body-4 text-slate-500 mt-2 max-w-2xl">
          Connect directly with licensed property consultants and RERA certified luxury advisors across premier metropolitan markets.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 p-4 rounded-3xl bg-white shadow-xs border-0 max-w-md">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search advisors by name, city, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No advisors match your search"
          description="We couldn't find any certified advisors matching that name or city. Try searching a major metropolitan hub."
          actionLabel="Clear search"
          onAction={() => setSearch('')}
        />
      )}
    </div>
  );
}
