import React from 'react';
import { X } from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';

export default function ActiveFilterChips({ className = '', onFilterChange, onReset }) {
  const { filters, updateFilters, resetFilters } = useProperty();
  const applyFilter = onFilterChange || updateFilters;
  const applyReset = onReset || resetFilters;

  const chips = [];

  if (filters.city && filters.city !== 'All cities') {
    chips.push({
      key: 'city',
      label: `City: ${filters.city}`,
      onRemove: () => applyFilter({ city: 'All cities' })
    });
  }

  if (filters.type && filters.type !== 'All types') {
    chips.push({
      key: 'type',
      label: `Type: ${filters.type}`,
      onRemove: () => applyFilter({ type: 'All types' })
    });
  }

  if (filters.priceRange && filters.priceRange !== 'all') {
    const budgetLabels = {
      'under-1cr': 'Budget: Under ₹1 Cr',
      '1cr-3cr': 'Budget: ₹1 Cr to ₹3 Cr',
      '3cr-7cr': 'Budget: ₹3 Cr to ₹7 Cr',
      '7cr-15cr': 'Budget: ₹7 Cr to ₹15 Cr',
      'above-15cr': 'Budget: Above ₹15 Cr',
      'under-50k': 'Rent: Under ₹50,000 / mo',
      '50k-1.5lac': 'Rent: ₹50,000 to ₹1.5 Lac / mo',
      '1.5lac-3lac': 'Rent: ₹1.5 Lac to ₹3 Lac / mo',
      'above-3lac': 'Rent: Above ₹3 Lac / mo',
      'under-5cr': 'Price: Under ₹5 Cr',
      '5cr-15cr': 'Price: ₹5 Cr to ₹15 Cr',
      '15cr-30cr': 'Price: ₹15 Cr to ₹30 Cr',
      'above-30cr': 'Price: Above ₹30 Cr',
      'under-2lac': 'Rent: Under ₹2 Lac / mo',
      '2lac-5lac': 'Rent: ₹2 Lac to ₹5 Lac / mo',
      '5lac-15lac': 'Rent: ₹5 Lac to ₹15 Lac / mo',
      'above-15lac': 'Rent: Above ₹15 Lac / mo'
    };
    chips.push({
      key: 'priceRange',
      label: budgetLabels[filters.priceRange] || `Budget: ${filters.priceRange}`,
      onRemove: () => applyFilter({ priceRange: 'all' })
    });
  }

  if (filters.transactionType && filters.transactionType !== 'all') {
    const txLabels = {
      buy: 'Mode: Buy',
      rent: 'Mode: Rent',
      lease: 'Mode: Lease'
    };
    chips.push({
      key: 'transactionType',
      label: txLabels[filters.transactionType] || `Mode: ${filters.transactionType}`,
      onRemove: () => applyFilter({ transactionType: 'all' })
    });
  }

  if (filters.commercialCategory && filters.commercialCategory !== 'All categories') {
    chips.push({
      key: 'commercialCategory',
      label: `Category: ${filters.commercialCategory}`,
      onRemove: () => applyFilter({ commercialCategory: 'All categories' })
    });
  }

  if (filters.depositRange && filters.depositRange !== 'all') {
    const depositLabels = {
      'under-1.5lac': 'Deposit: Under ₹1.5 Lac',
      '1.5lac-4lac': 'Deposit: ₹1.5 Lac to ₹4 Lac',
      '4lac-8lac': 'Deposit: ₹4 Lac to ₹8 Lac',
      'above-8lac': 'Deposit: Above ₹8 Lac'
    };
    chips.push({
      key: 'depositRange',
      label: depositLabels[filters.depositRange] || `Deposit: ${filters.depositRange}`,
      onRemove: () => applyFilter({ depositRange: 'all' })
    });
  }

  if (filters.tenantType && filters.tenantType !== 'All tenants') {
    chips.push({
      key: 'tenantType',
      label: `Tenant: ${filters.tenantType}`,
      onRemove: () => applyFilter({ tenantType: 'All tenants' })
    });
  }

  if (filters.availableFrom && filters.availableFrom !== 'any') {
    const availLabels = {
      'immediate': 'Available: Immediate move in',
      '15days': 'Available: Within 15 days',
      '30days': 'Available: Within 30 days'
    };
    chips.push({
      key: 'availableFrom',
      label: availLabels[filters.availableFrom] || `Available: ${filters.availableFrom}`,
      onRemove: () => applyFilter({ availableFrom: 'any' })
    });
  }

  if (filters.leaseDuration && filters.leaseDuration !== 'any') {
    const leaseLabels = {
      '11-months': 'Lease: 11 months',
      '1-to-2-years': 'Lease: 1 to 2 years',
      '3-plus-years': 'Lease: 3+ years'
    };
    chips.push({
      key: 'leaseDuration',
      label: leaseLabels[filters.leaseDuration] || `Lease: ${filters.leaseDuration}`,
      onRemove: () => applyFilter({ leaseDuration: 'any' })
    });
  }

  if (filters.bedrooms && filters.bedrooms !== 'Any rooms') {
    chips.push({
      key: 'bedrooms',
      label: `Rooms: ${filters.bedrooms}`,
      onRemove: () => applyFilter({ bedrooms: 'Any rooms' })
    });
  }

  if (filters.bathrooms && filters.bathrooms !== 'Any baths') {
    chips.push({
      key: 'bathrooms',
      label: `Baths: ${filters.bathrooms}`,
      onRemove: () => applyFilter({ bathrooms: 'Any baths' })
    });
  }

  if (filters.possession && filters.possession !== 'All statuses') {
    chips.push({
      key: 'possession',
      label: `Status: ${filters.possession}`,
      onRemove: () => applyFilter({ possession: 'All statuses' })
    });
  }

  if (filters.areaRange && filters.areaRange !== 'all') {
    const areaLabels = {
      'under-1000': 'Area: Under 1,000 sq ft',
      '1000-2000': 'Area: 1,000 to 2,000 sq ft',
      '2000-3500': 'Area: 2,000 to 3,500 sq ft',
      '3500-5000': 'Area: 3,500 to 5,000 sq ft',
      'above-5000': 'Area: Above 5,000 sq ft',
      'under-2000': 'Area: Under 2,000 sq ft',
      '2000-5000': 'Area: 2,000 to 5,000 sq ft',
      '5000-15000': 'Area: 5,000 to 15,000 sq ft',
      'above-15000': 'Area: Above 15,000 sq ft'
    };
    chips.push({
      key: 'areaRange',
      label: areaLabels[filters.areaRange] || `Area: ${filters.areaRange}`,
      onRemove: () => applyFilter({ areaRange: 'all' })
    });
  }

  if (filters.parking && filters.parking !== 'Any parking') {
    chips.push({
      key: 'parking',
      label: `Parking: ${filters.parking}`,
      onRemove: () => applyFilter({ parking: 'Any parking' })
    });
  }

  if (filters.floorNumber && filters.floorNumber !== 'any') {
    const floorLabels = {
      ground: 'Floor: Ground floor',
      low: 'Floor: Low floor 1 to 5',
      mid: 'Floor: Mid floor 6 to 15',
      high: 'Floor: High floor 16+'
    };
    chips.push({
      key: 'floorNumber',
      label: floorLabels[filters.floorNumber] || `Floor: ${filters.floorNumber}`,
      onRemove: () => applyFilter({ floorNumber: 'any' })
    });
  }

  if (filters.buildingType && filters.buildingType !== 'All building types') {
    chips.push({
      key: 'buildingType',
      label: `Building: ${filters.buildingType}`,
      onRemove: () => applyFilter({ buildingType: 'All building types' })
    });
  }

  if (filters.availability && filters.availability !== 'any') {
    const availLabels = {
      immediate: 'Availability: Immediate move in',
      '30days': 'Availability: Within 30 days',
      'under-construction': 'Availability: Under construction'
    };
    chips.push({
      key: 'availability',
      label: availLabels[filters.availability] || `Availability: ${filters.availability}`,
      onRemove: () => applyFilter({ availability: 'any' })
    });
  }

  if (filters.furnishing && filters.furnishing !== 'All furnishing') {
    chips.push({
      key: 'furnishing',
      label: `Furnishing: ${filters.furnishing}`,
      onRemove: () => applyFilter({ furnishing: 'All furnishing' })
    });
  }

  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach((amenity) => {
      chips.push({
        key: `amenity-${amenity}`,
        label: amenity,
        onRemove: () => {
          applyFilter({
            amenities: filters.amenities.filter((a) => a !== amenity)
          });
        }
      });
    });
  }

  if (filters.postedDate && filters.postedDate !== 'any') {
    const dateLabels = {
      '24h': 'Posted: Last 24 hours',
      '7d': 'Posted: Last 7 days',
      '30d': 'Posted: Last 30 days'
    };
    chips.push({
      key: 'postedDate',
      label: dateLabels[filters.postedDate] || filters.postedDate,
      onRemove: () => applyFilter({ postedDate: 'any' })
    });
  }

  if (filters.verifiedOnly) {
    chips.push({
      key: 'verifiedOnly',
      label: 'RERA verified only',
      onRemove: () => applyFilter({ verifiedOnly: false })
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 flex-wrap mb-6 text-left ${className}`}>
      <span className="caption-2 font-semibold text-slate-500 mr-1">
        Active filters:
      </span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-brand-navy text-xs font-medium hover:bg-slate-200 transition-colors"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            <X size={12} weight="bold" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={applyReset}
        className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
