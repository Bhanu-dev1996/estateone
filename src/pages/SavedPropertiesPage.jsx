import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { useProperty } from '../context/PropertyContext';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import PropertyCard from '../components/shared/PropertyCard';
import EmptyState from '../components/shared/EmptyState';

export default function SavedPropertiesPage() {
  const { savedPropertyIds, openConfirm } = useProperty();

  const savedProperties = SAMPLE_PROPERTIES.filter((p) =>
    savedPropertyIds.includes(p.id)
  );

  const handleClearAll = () => {
    openConfirm({
      title: 'Clear all saved properties?',
      message: 'This will remove all shortlisted residences from your saved collection. You can add them again anytime.',
      confirmText: 'Clear wishlist',
      isDestructive: true,
      onConfirm: () => {
        try {
          localStorage.removeItem('estateone_saved_properties');
          window.location.reload();
        } catch {
          // fallback
        }
      }
    });
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs items={[{ label: 'Saved properties' }]} className="mb-4" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-3">
            <Heart size={15} weight="fill" />
            <span>Shortlisted collection</span>
          </span>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Your saved properties
          </h1>
          <p className="body-4 text-slate-500 mt-2 max-w-2xl">
            Track, review, and schedule inspections for your favorite verified residences.
          </p>
        </div>

        {savedProperties.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="self-start sm:self-auto py-2.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold border-0 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash size={15} />
            <span>Clear saved collection</span>
          </button>
        )}
      </div>

      {/* Saved Properties Grid */}
      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your saved collection is empty"
          description="You haven't saved any properties yet. Tap the heart icon on any residence to shortlist it for easy comparison and booking."
          actionLabel="Explore verified properties"
          onAction={() => {
            window.location.href = '/buy';
          }}
        />
      )}
    </div>
  );
}
