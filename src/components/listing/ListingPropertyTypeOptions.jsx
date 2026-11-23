import React from 'react';
import {
  Buildings,
  DotsThreeOutline,
  House,
  HouseLine,
  MapTrifold,
  Storefront,
} from '@phosphor-icons/react';
import ListingWizardOptionCard from './ListingWizardOptionCard';

export const LISTING_PROPERTY_TYPES = [
  {
    id: 'Apartment',
    title: 'Apartment',
    desc: 'High rise flat, duplex, or penthouse in a society.',
    icon: Buildings,
  },
  {
    id: 'Villa',
    title: 'Villa',
    desc: 'Gated community or standalone villa with plot.',
    icon: HouseLine,
  },
  {
    id: 'Independent house',
    title: 'Independent house',
    desc: 'Row house, bungalow, or freehold built unit.',
    icon: House,
  },
  {
    id: 'Plot',
    title: 'Plot',
    desc: 'Residential or commercial land parcel.',
    icon: MapTrifold,
  },
  {
    id: 'Commercial property',
    title: 'Commercial',
    desc: 'Office, retail, warehouse, or industrial asset.',
    icon: Storefront,
  },
  {
    id: 'Other',
    title: 'Other',
    desc: 'Mixed use or specialty property type.',
    icon: DotsThreeOutline,
  },
];

export default function ListingPropertyTypeOptions({ value, onChange, error }) {
  return (
    <fieldset className="listing-property-type-options border-0 p-0 m-0 min-w-0">
      <legend className="sr-only">Property category</legend>
      <p className="wizard-step-assist text-caption font-normal text-slate-500 mb-3 text-pretty">
        Match the category on your sale deed, society NOC, or RERA registration.
      </p>

      <div
        className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3"
        role="radiogroup"
        aria-label="Property category"
      >
        {LISTING_PROPERTY_TYPES.map((item) => (
          <ListingWizardOptionCard
            key={item.id}
            selected={value === item.id}
            onClick={() => onChange(item.id)}
            title={item.title}
            description={item.desc}
            icon={item.icon}
            layout="inline"
          />
        ))}
      </div>

      {error ? <p className="wizard-field-error mt-3">{error}</p> : null}
    </fieldset>
  );
}