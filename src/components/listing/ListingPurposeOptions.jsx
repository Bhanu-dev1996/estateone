import React from 'react';
import { Buildings, HouseLine, ShieldCheck } from '@phosphor-icons/react';
import ListingWizardOptionCard from './ListingWizardOptionCard';

const OPTIONS = [
  {
    id: 'sell',
    title: 'Sell',
    desc: 'List for outright sale with negotiable or fixed price.',
    icon: HouseLine,
  },
  {
    id: 'rent',
    title: 'Rent out',
    desc: 'Residential lease for families or corporate tenants.',
    icon: Buildings,
  },
  {
    id: 'lease',
    title: 'Commercial lease',
    desc: 'Long term lease for office, retail, or industrial use.',
    icon: ShieldCheck,
  },
];

export default function ListingPurposeOptions({ value, onChange, error }) {
  return (
    <fieldset className="listing-purpose-options border-0 p-0 m-0 min-w-0">
      <legend className="sr-only">Listing purpose</legend>
      <p className="wizard-step-assist text-caption font-normal text-slate-500 mb-3 text-pretty">
        Your choice sets pricing fields and verification rules in steps 5 and 8.
      </p>

      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3"
        role="radiogroup"
        aria-label="Transaction purpose"
      >
        {OPTIONS.map((item) => (
          <ListingWizardOptionCard
            key={item.id}
            selected={value === item.id}
            onClick={() => onChange(item.id)}
            title={item.title}
            description={item.desc}
            icon={item.icon}
            layout="stacked"
          />
        ))}
      </div>

      {error ? <p className="wizard-field-error mt-3">{error}</p> : null}
    </fieldset>
  );
}