import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MagnifyingGlass, 
  MapPin, 
  Scales, 
  CalendarPlus, 
  ChatCircleText, 
  Trash, 
  ArrowRight, 
  ShieldCheck, 
  GridFour, 
  Rows,
  ShareNetwork,
  X
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useProperty } from '../../context/PropertyContext';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { useToast } from '../../context/ToastContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';
import PropertyCard from '../../components/shared/PropertyCard';
import { getPropertyResultsLayoutClass } from '../../lib/listingResultsLayout';

export default function SavedProperties() {
  const { savedPropertyIds, toggleSave, isSaved, comparePropertyIds, toggleCompare, isCompared } = useProperty();
  const { toastSuccess, toastInfo } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterIntent, setFilterIntent] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('dateSaved');
  const [viewMode, setViewMode] = useState('grid');

  // Match saved properties against catalog
  const savedList = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));
  }, [savedPropertyIds]);

  // Filtered and sorted saved list
  const filteredList = useMemo(() => {
    return savedList.filter((p) => {
      if (filterIntent !== 'all' && p.intent !== filterIntent) return false;
      if (filterType !== 'all' && p.type !== filterType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCity) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return (a.priceValue || 0) - (b.priceValue || 0);
      if (sortBy === 'priceHigh') return (b.priceValue || 0) - (a.priceValue || 0);
      if (sortBy === 'newest') return (a.postedDaysAgo || 0) - (b.postedDaysAgo || 0);
      return 0; // date saved
    });
  }, [savedList, filterIntent, filterType, searchQuery, sortBy]);

  const handleShare = (property) => {
    const url = `${window.location.origin}/property/${property.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toastSuccess('Link copied', `Share link for ${property.title} copied.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 10.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Saved property collection"
        description="Review your shortlisted residences, compare specifications, and request priority walkthroughs."
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => navigate('/dashboard/discover')}
            className="rounded-2xl min-h-10 px-4"
          >
            Explore more properties
          </Button>
        }
      />

      {/* =========================================================================
          2. FILTERS & SEARCH (PRD Section 10.2)
         ========================================================================= */}
      {savedList.length > 0 && (
        <Card className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search within your saved shortlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-small text-brand-navy focus:outline-none focus:border-brand-blue"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter by Intent */}
            <select
              value={filterIntent}
              onChange={(e) => setFilterIntent(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-brand-navy focus:outline-none shrink-0"
            >
              <option value="all">All intents</option>
              <option value="buy">For sale (Buy)</option>
              <option value="rent">For rent</option>
            </select>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-brand-navy focus:outline-none shrink-0"
            >
              <option value="all">All property types</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-brand-navy focus:outline-none shrink-0 font-semibold"
            >
              <option value="dateSaved">Recently saved</option>
              <option value="newest">Newest listings</option>
              <option value="priceLow">Price low to high</option>
              <option value="priceHigh">Price high to low</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500'
                }`}
              >
                <GridFour size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500'
                }`}
              >
                <Rows size={16} />
              </button>
            </div>

          </div>
        </Card>
      )}

      {/* =========================================================================
          3. SAVED PROPERTIES GRID / LIST (PRD Section 10.2)
         ========================================================================= */}
      {filteredList.length > 0 ? (
        <div className={getPropertyResultsLayoutClass(viewMode, 'three', '')}>
          {filteredList.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              layout={viewMode === 'list' ? 'list' : 'grid'}
            />
          ))}
        </div>
      ) : (
        /* Empty State (PRD Section 10.4) */
        <Card className="p-12 rounded-3xl bg-white border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart size={32} weight="fill" />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-brand-navy">No saved properties yet</h3>
            <p className="caption-2 text-slate-500 max-w-md mx-auto mt-1">
              Select the heart icon on any property listing to add it to your personal shortlist for quick access and comparison.
            </p>
          </div>
          <Button size="sm"
            onClick={() => navigate('/dashboard/discover')}
            className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white cursor-pointer"
          >
            Explore properties
          </Button>
        </Card>
      )}

    </div>
  );
}
