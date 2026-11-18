import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Buildings, ArrowRight } from '@phosphor-icons/react';
import { SAMPLE_AGENTS, SAMPLE_BUILDERS } from '../../data/agents';
import AgentCard from '../shared/AgentCard';
import BuilderCard from '../shared/BuilderCard';

export default function FeaturedPartners() {
  const [activeTab, setActiveTab] = useState('agents'); // 'agents' | 'builders'

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-2 block">
            Accredited network
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            Featured agents and builders
          </h2>
          <p className="body-4 text-slate-500 mt-2 max-w-xl">
            Collaborate directly with state RERA accredited luxury advisors and India premier corporate real estate developers.
          </p>
        </div>

        {/* Tab Switcher & View All Link */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('agents')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'agents'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              Advisors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('builders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'builders'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              Developers
            </button>
          </div>

          <Link
            to={activeTab === 'agents' ? '/agents' : '/builders'}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-navy transition-colors group"
          >
            <span>{activeTab === 'agents' ? 'View all advisors' : 'View all developers'}</span>
            <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Grid Content */}
      {activeTab === 'agents' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_AGENTS.slice(0, 3).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_BUILDERS.slice(0, 3).map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      )}

    </section>
  );
}
