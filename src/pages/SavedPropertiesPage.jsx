import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Trash, 
  Scales, 
  MagnifyingGlass, 
  SlidersHorizontal, 
  SquaresFour, 
  Rows, 
  MapPin, 
  Bed, 
  Bathtub, 
  ArrowsOut, 
  CalendarCheck, 
  ChatCircleText, 
  ShieldCheck, 
  X, 
  Eye, 
  User, 
  ArrowRight,
  Info,
  WarningCircle,
  Buildings,
  HouseLine,
  ArrowClockwise
} from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES, CITIES } from '../data/properties';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import EmptyState from '../components/shared/EmptyState';
import ErrorState from '../components/shared/ErrorState';
import { PropertyCardSkeleton } from '../components/shared/LoadingSkeleton';
import PropertyCard from '../components/shared/PropertyCard';
import { getPropertyResultsLayoutClass } from '../lib/listingResultsLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

export default function SavedPropertiesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toastSuccess, toastInfo } = useToast();
  const { 
    savedPropertyIds, 
    toggleSave, 
    clearSaved, 
    comparePropertyIds, 
    addCompare, 
    isCompared, 
    openConfirm, 
    openSiteVisit, 
    openEnquiry 
  } = useProperty();

  // State Management for Filters & Views per PRD 5.7
  const [segment, setSegment] = useState('all'); // 'all' | 'buy' | 'rent' | 'commercial'
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'off-market'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'price-asc' | 'price-desc' | 'area-desc'
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'

  // Wishlist States per PRD 5.7
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Initial simulated loading transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Fetch full property records for all saved IDs
  const allSavedProperties = useMemo(() => {
    return savedPropertyIds
      .map((id) => SAMPLE_PROPERTIES.find((p) => p.id === id))
      .filter(Boolean);
  }, [savedPropertyIds]);

  // Filter & Search Logic
  const filteredProperties = useMemo(() => {
    return allSavedProperties.filter((p) => {
      // 1. Segment filter
      if (segment === 'buy' && (p.intent !== 'buy' || p.isCommercial)) return false;
      if (segment === 'rent' && p.intent !== 'rent') return false;
      if (segment === 'commercial' && !p.isCommercial && p.intent !== 'commercial' && p.type !== 'Commercial') return false;

      // 2. City filter
      if (selectedCity !== 'All cities' && p.city !== selectedCity) return false;

      // 3. Availability filter
      const isOffMarket = p.availabilityStatus === 'leased' || p.status === 'Sold out';
      if (availabilityFilter === 'available' && isOffMarket) return false;
      if (availabilityFilter === 'off-market' && !isOffMarket) return false;

      // 4. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = p.title?.toLowerCase().includes(q);
        const inLoc = p.location?.toLowerCase().includes(q);
        const inCity = p.city?.toLowerCase().includes(q);
        const inType = p.type?.toLowerCase().includes(q);
        if (!inTitle && !inLoc && !inCity && !inType) return false;
      }

      return true;
    }).sort((a, b) => {
      const aPrice = a.priceValue || a.monthlyRentValue || 0;
      const bPrice = b.priceValue || b.monthlyRentValue || 0;
      if (sortBy === 'price-asc') return aPrice - bPrice;
      if (sortBy === 'price-desc') return bPrice - aPrice;
      if (sortBy === 'area-desc') return (b.areaSqFt || 0) - (a.areaSqFt || 0);
      return 0; // 'recent' maintains shortlisted order
    });
  }, [allSavedProperties, segment, selectedCity, availabilityFilter, searchQuery, sortBy]);

  // Counts for Segment Filter Tabs
  const counts = useMemo(() => {
    const buyCount = allSavedProperties.filter((p) => p.intent === 'buy' && !p.isCommercial).length;
    const rentCount = allSavedProperties.filter((p) => p.intent === 'rent').length;
    const commercialCount = allSavedProperties.filter((p) => p.isCommercial || p.intent === 'commercial' || p.type === 'Commercial').length;
    return {
      all: allSavedProperties.length,
      buy: buyCount,
      rent: rentCount,
      commercial: commercialCount
    };
  }, [allSavedProperties]);

  // Batch action: Compare all filtered saved properties (up to 4)
  const handleCompareAll = () => {
    const toCompare = filteredProperties.slice(0, 4);
    toCompare.forEach((p) => {
      if (!comparePropertyIds.includes(p.id)) {
        addCompare(p);
      }
    });
    navigate('/compare');
  };

  // Clear all saved confirmation
  const handleClearAll = () => {
    openConfirm({
      title: 'Clear all saved properties?',
      message: 'This will remove all shortlisted listings from your saved collection. You can shortlist them again anytime while browsing.',
      confirmText: 'Clear wishlist',
      isDestructive: true,
      onConfirm: clearSaved
    });
  };

  const activeFiltersCount = (selectedCity !== 'All cities' ? 1 : 0) + 
                             (availabilityFilter !== 'all' ? 1 : 0) + 
                             (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setSegment('all');
    setSelectedCity('All cities');
    setAvailabilityFilter('all');
    setSearchQuery('');
  };

  if (hasError) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
        <Breadcrumbs items={[{ label: 'Saved properties' }]} className="mb-4" />
        <ErrorState
          title="Unable to load saved collection"
          message="A network interruption occurred while synchronizing your wishlist. Please retry."
          onRetry={() => {
            setHasError(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 300);
          }}
        />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs items={[{ label: 'Saved properties' }]} className="mb-4" />

      {/* Guest vs Authenticated Status Banner per PRD 5.7 */}
      {!isAuthenticated ? (
        <div className="mb-6 p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
              <Info size={20} weight="bold" />
            </span>
            <div>
              <p className="caption-1 font-semibold text-amber-900">
                You are viewing a temporary guest wishlist
              </p>
              <p className="caption-3 text-amber-800/80 mt-0.5">
                Sign in to synchronize these shortlisted listings across all your devices and receive instant price change updates.
              </p>
            </div>
          </div>
          <Link to="/login" className="shrink-0 self-start sm:self-auto">
            <Button size="sm" type="button" className="min-h-10 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white shadow-xs cursor-pointer flex items-center gap-1.5" >
              <User size={14} weight="bold" />
              <span>Sign in to sync</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mb-6 p-3.5 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} weight="fill" className="text-emerald-600" />
            <span className="caption-1 font-semibold text-brand-navy">
              Signed in as {user.name} • Cloud synchronized wishlist
            </span>
          </div>
          <Badge variant="neutral" className="text-small font-semibold text-slate-500">
            Account ID: {user.id}
          </Badge>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
              <Heart size={14} weight="fill" />
              <span>Personal collection</span>
            </span>
            <Badge variant="neutral" className="px-3 py-1 text-xs font-semibold text-slate-700">
              {allSavedProperties.length} properties saved
            </Badge>
          </div>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Saved properties.
          </h1>
          <p className="body-4 text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Track pricing developments, review architectural floor layouts, schedule physical site inspections, or compare your shortlisted listings side by side.
          </p>
        </div>

        {/* Global Action Cluster */}
        {allSavedProperties.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
            {/* Compare All Button */}
            {filteredProperties.length >= 2 && (
              <Button size="sm" type="button" onClick={handleCompareAll} className="min-h-10 px-4 py-2.5 rounded-2xl bg-brand-navy hover:bg-brand-navy-hover text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors" title="Compare up to 4 saved listings side by side" >
                <Scales size={16} weight="bold" />
                <span>Compare saved ({Math.min(4, filteredProperties.length)})</span>
              </Button>
            )}

            {/* Clear All Wishlist Button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="min-h-10 button-sm py-2.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear all properties from saved collection"
            >
              <Trash size={16} />
              <span>Clear collection</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        /* Loading Skeleton State */
        <div className={getPropertyResultsLayoutClass(layout, 'three', '')}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      ) : allSavedProperties.length === 0 ? (
        /* Empty State when zero properties are shortlisted */
        <div className="space-y-12">
          <EmptyState
            icon={Heart}
            title="Your saved collection is empty"
            description="You have not saved any properties yet. Tap the heart icon on any residence or commercial space to shortlist it for easy comparison, inspection booking, and price tracking."
            actionLabel="Explore properties for sale"
            onAction={() => {
              navigate('/buy');
            }}
          />

          {/* Recommended Starter Properties */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-0 shadow-xs text-left">
            <h3 className="heading-4 text-brand-navy font-bold mb-2">
              Popular verified residences to shortlist
            </h3>
            <p className="body-4 text-slate-500 mb-6 max-w-xl">
              Tap the heart icon on any card to immediately begin building your shortlist.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_PROPERTIES.slice(0, 3).map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-brand-blue transition-all"
                >
                  <img
                    src={prop.images?.[0]}
                    alt={prop.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="title-4 text-brand-navy font-semibold truncate">
                      {prop.title}
                    </h5>
                    <p className="caption-3 text-slate-500 truncate">{prop.location}</p>
                    <p className="caption-3 font-bold text-brand-navy mt-0.5">{prop.priceDisplay}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSave(prop)}
                    aria-label={`Save ${prop.title}`}
                    className="w-9 h-9 rounded-full bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Saved Properties Active View */
        <div className="space-y-6">
          
          {/* Filter & Control Bar */}
          <div className="p-4 rounded-3xl bg-white shadow-xs border-0 space-y-4">
            
            {/* Top Row: Segment Filter Tabs and Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              
              {/* Segment Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All saved', count: counts.all },
                  { id: 'buy', label: 'For sale', count: counts.buy },
                  { id: 'rent', label: 'For rent', count: counts.rent },
                  { id: 'commercial', label: 'Commercial', count: counts.commercial }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSegment(tab.id)}
                    className={`button-sm px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${ segment === tab.id ? 'bg-brand-navy text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-brand-navy' }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-small px-1.5 py-0.2 rounded-full ${
                      segment === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Keyword Search Input */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search saved properties by title, locality, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer transition-colors"
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>

            </div>

            {/* Bottom Row: City Selector, Availability, Sort, View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
              
              {/* Secondary Selectors: City & Availability */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* City Dropdown */}
                <div className="w-40">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-9 rounded-xl text-xs font-medium border-slate-200">
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Dropdown */}
                <div className="w-44">
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="h-9 rounded-xl text-xs font-medium border-slate-200">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="available">Available only</SelectItem>
                      <SelectItem value="off-market">Off market / Leased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs text-brand-blue font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Right: Sort and Layout Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <span className="caption-4 text-slate-400 hidden md:inline">Sort:</span>
                <div className="w-44">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 rounded-xl text-xs font-medium border-slate-200">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently saved</SelectItem>
                      <SelectItem value="price-asc">Price: low to high</SelectItem>
                      <SelectItem value="price-desc">Price: high to low</SelectItem>
                      <SelectItem value="area-desc">Area: largest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Grid / List Layout Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setLayout('grid')}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      layout === 'grid' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-400 hover:text-brand-navy'
                    }`}
                  >
                    <SquaresFour size={16} weight={layout === 'grid' ? 'fill' : 'regular'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('list')}
                    aria-label="List view"
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      layout === 'list' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-400 hover:text-brand-navy'
                    }`}
                  >
                    <Rows size={16} weight={layout === 'list' ? 'fill' : 'regular'} />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-1">
            <span className="caption-2 text-slate-500 font-medium">
              Showing {filteredProperties.length} of {allSavedProperties.length} saved properties
            </span>
          </div>

          {/* Properties Grid or List View */}
          {filteredProperties.length > 0 ? (
            <div className={getPropertyResultsLayoutClass(layout, 'three', '')}>
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  layout={layout === 'list' ? 'list' : 'grid'}
                />
              ))}
            </div>
          ) : (
            /* No Results for Current Filter */
            <div className="p-12 text-center bg-white rounded-3xl border-0 shadow-xs space-y-3">
              <p className="title-3 text-brand-navy font-bold">
                No saved properties match your active filters
              </p>
              <p className="caption-2 text-slate-500 max-w-md mx-auto">
                Try clearing your search query or selecting another category to view your shortlisted listings.
              </p>
              <Button size="sm" type="button" onClick={resetAllFilters} className="mt-2 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white cursor-pointer" >
                Reset active filters
              </Button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
