import React from 'react';
import { Buildings } from '@phosphor-icons/react';
import { SAMPLE_BUILDERS } from '../data/agents';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import BuilderCard from '../components/shared/BuilderCard';

export default function BuildersPage() {
  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs items={[{ label: 'Builders and developers' }]} className="mb-4" />

      {/* Header Banner */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-3">
          <Buildings size={15} weight="fill" />
          <span>RERA registered developers</span>
        </span>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          Premier real estate builders
        </h1>
        <p className="body-4 text-slate-500 mt-2 max-w-2xl">
          Discover verified real estate developers with proven track records of punctuality, structural excellence, and official RERA project registrations.
        </p>
      </div>

      {/* Builders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_BUILDERS.map((builder) => (
          <BuilderCard key={builder.id} builder={builder} />
        ))}
      </div>
    </div>
  );
}
