import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Bed, SlidersHorizontal } from '@phosphor-icons/react';
import LocationAutocomplete from './LocationAutocomplete';
import PropertyTypeSelector from './PropertyTypeSelector';
import PriceRangeSelector from './PriceRangeSelector';
import { useProperty } from '../../context/PropertyContext';
import { Button } from '../ui/button';

export default function SearchWidget({ 
  initialIntent = 'buy',
  onSearch,
  compact = false,
  className = '' 
}) {
  const navigate = useNavigate();
  const { filters, updateFilters } = useProperty();

  const [activeIntent, setActiveIntent] = useState(filters.intent || initialIntent);
  const [locationValue, setLocationValue] = useState(filters.city !== 'All cities' ? filters.city : '');
  const [selectedType, setSelectedType] = useState(filters.type || 'All types');
  const [selectedBudget, setSelectedBudget] = useState(filters.priceRange || 'all');
  const [selectedBedrooms, setSelectedBedrooms] = useState(filters.bedrooms || 'Any rooms');

  const handleIntentChange = (newIntent) => {
    setActiveIntent(newIntent);
    // Reset type and budget contextually
    setSelectedType('All types');
    setSelectedBudget('all');
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();

    const searchState = {
      intent: activeIntent,
      city: locationValue || 'All cities',
      type: selectedType,
      priceRange: selectedBudget,
      bedrooms: selectedBedrooms
    };

    // Update context for persistence across navigation (PRD 4.2.2)
    updateFilters(searchState);

    if (onSearch) {
      onSearch(searchState);
      return;
    }

    // Direct route navigation based on transaction intent
    const targetRoute = 
      activeIntent === 'rent' 
        ? '/rent' 
        : activeIntent === 'commercial' 
          ? '/commercial' 
          : '/buy';

    const params = new URLSearchParams();
    if (locationValue && locationValue !== 'All cities') params.set('city', locationValue);
    if (selectedType && selectedType !== 'All types') params.set('type', selectedType);
    if (selectedBudget && selectedBudget !== 'all') params.set('budget', selectedBudget);
    if (selectedBedrooms && selectedBedrooms !== 'Any rooms') params.set('bhk', selectedBedrooms);

    const queryString = params.toString();
    navigate(queryString ? `${targetRoute}?${queryString}` : targetRoute);
  };

  return (
    <div className={`w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-xl border-0 text-left ${className}`}>
      
      {/* Intent Tabs (Buy / Rent / Commercial) */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        {[
          { id: 'buy', label: 'Buy residential' },
          { id: 'rent', label: 'Rent home' },
          { id: 'commercial', label: 'Commercial' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleIntentChange(tab.id)}
            className={`min-h-10 button-sm px-4 py-2 rounded-full transition-all cursor-pointer ${ activeIntent === tab.id ? 'bg-brand-navy text-white shadow-xs' : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100' }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inputs Grid */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        
        {/* 1. Location Autocomplete */}
        <div>
          <label className="caption-2 font-semibold text-slate-500 mb-1.5 block">
            Location
          </label>
          <LocationAutocomplete
            value={locationValue}
            onChange={(val) => setLocationValue(val)}
            onSelect={(item) => setLocationValue(item.locality ? `${item.locality}, ${item.city}` : item.city)}
            placeholder="City, locality, or landmark"
          />
        </div>

        {/* 2. Property Type */}
        <div>
          <label className="caption-2 font-semibold text-slate-500 mb-1.5 block">
            Property type
          </label>
          <PropertyTypeSelector
            value={selectedType}
            onChange={(type) => setSelectedType(type)}
            intent={activeIntent}
          />
        </div>

        {/* 3. Budget Range */}
        <div>
          <label className="caption-2 font-semibold text-slate-500 mb-1.5 block">
            Budget
          </label>
          <PriceRangeSelector
            value={selectedBudget}
            onChange={(opt) => setSelectedBudget(opt.value)}
            intent={activeIntent}
          />
        </div>

        {/* 4. Bedrooms or Search Button */}
        <div className="flex items-end gap-2">
          {activeIntent !== 'commercial' ? (
            <div className="flex-1">
              <label className="caption-2 font-semibold text-slate-500 mb-1.5 block">
                Bedrooms
              </label>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
              >
                <option value="Any rooms">Any rooms</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>
            </div>
          ) : null}

          {/* Search CTA */}
          <Button type="submit" size="sm" className="flex-1 shrink-0 rounded-2xl shadow-xs">
            <MagnifyingGlass size={16} weight="bold" />
            Search
          </Button>
        </div>

      </form>
    </div>
  );
}
