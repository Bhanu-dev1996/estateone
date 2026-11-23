import React from 'react';
import { MagnifyingGlass, MapPin, SortAscending, SquaresFour, Rows, X } from '@phosphor-icons/react';
import { CITIES } from '../../data/properties';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const selectItemClass = 'rounded-xl text-small font-medium cursor-pointer';
const selectContentClass = 'rounded-2xl border-slate-100 shadow-xl bg-white p-1 max-h-64';

export default function PropertyListingToolbar({
  searchQuery = '',
  onSearchChange,
  onSearchClear,
  onSearchSubmit,
  searchPlaceholder = 'Search by locality, project name, or property type...',
  city = 'All cities',
  onCityChange,
  cities = CITIES,
  layout = 'grid',
  onLayoutChange,
  showLayoutToggle = true,
  sortBy = 'relevance',
  sortOptions = [],
  onSortChange,
  className = '',
}) {
  const handleClear = () => {
    if (onSearchClear) onSearchClear();
    else if (onSearchChange) onSearchChange('');
  };

  const searchField = (
    <div className="listing-toolbar-search relative min-w-0 w-full">
      <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden />
      <input
        type="search"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className="listing-toolbar-input w-full pl-9 pr-9"
        aria-label="Search listings"
      />
      {searchQuery ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer transition-colors p-0.5"
        >
          <X size={14} weight="bold" />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className={`listing-toolbar ${className}`.trim()}>
      {onSearchSubmit ? (
        <form
          className="listing-toolbar-search-wrap min-w-0 w-full lg:flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(e);
          }}
        >
          {searchField}
        </form>
      ) : (
        <div className="listing-toolbar-search-wrap min-w-0 w-full lg:flex-1">{searchField}</div>
      )}

      <div className="listing-toolbar-controls">
        {onCityChange ? (
          <div className="listing-toolbar-control flex items-center gap-1 shrink-0">
            <MapPin size={16} className="text-brand-gold shrink-0" aria-hidden />
            <Select value={city} onValueChange={onCityChange}>
              <SelectTrigger className="listing-toolbar-select">
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {cities.map((c) => (
                  <SelectItem key={c} value={c} className={selectItemClass}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {showLayoutToggle && onLayoutChange ? (
          <div className="listing-toolbar-layout" role="group" aria-label="Results layout">
            <button
              type="button"
              onClick={() => onLayoutChange('grid')}
              aria-label="Grid view"
              aria-pressed={layout === 'grid'}
              className={`listing-toolbar-layout-btn ${layout === 'grid' ? 'is-active' : ''}`}
            >
              <SquaresFour size={16} weight={layout === 'grid' ? 'bold' : 'regular'} />
            </button>
            <button
              type="button"
              onClick={() => onLayoutChange('list')}
              aria-label="List view"
              aria-pressed={layout === 'list'}
              className={`listing-toolbar-layout-btn ${layout === 'list' ? 'is-active' : ''}`}
            >
              <Rows size={16} weight={layout === 'list' ? 'bold' : 'regular'} />
            </button>
          </div>
        ) : null}

        {onSortChange && sortOptions.length > 0 ? (
          <div className="listing-toolbar-control flex items-center gap-1 shrink-0">
            <SortAscending size={16} className="text-slate-500 shrink-0" aria-hidden />
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="listing-toolbar-select listing-toolbar-select--sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className={selectItemClass}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
    </div>
  );
}