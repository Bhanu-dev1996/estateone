import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Buildings, 
  MagnifyingGlass, 
  ShieldCheck, 
  SortAscending, 
  SquaresFour, 
  Rows, 
  X, 
  MapPin, 
  Clock, 
  ArrowClockwise
} from '@phosphor-icons/react';
import { 
  SAMPLE_PROPERTIES, 
  CITIES,
  COMMERCIAL_CATEGORIES,
  COMMERCIAL_TRANSACTION_TYPES
} from '../data/properties';
import { useProperty } from '../context/PropertyContext';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import FilterSidebar from '../components/shared/FilterSidebar';
import ActiveFilterChips from '../components/shared/ActiveFilterChips';
import PropertyCard from '../components/shared/PropertyCard';
import EmptyState from '../components/shared/EmptyState';
import ErrorState from '../components/shared/ErrorState';
import Pagination from '../components/shared/Pagination';
import { PropertyCardSkeleton } from '../components/shared/LoadingSkeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function CommercialPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    filters, 
    updateFilters, 
    setExactFilters, 
    resetFilters, 
    recentlyViewedIds 
  } = useProperty();

  // Read URL search parameters directly (single source of truth per PRD 5.4)
  const cityParam = searchParams.get('city') || 'All cities';
  const modeParam = searchParams.get('mode') || searchParams.get('tx') || 'all'; // 'buy' | 'rent' | 'lease' | 'all'
  const categoryParam = searchParams.get('category') || searchParams.get('type') || 'All categories';
  const priceParam = searchParams.get('price') || searchParams.get('budget') || 'all';
  const areaParam = searchParams.get('area') || 'all';
  const furnishParam = searchParams.get('furnish') || 'All furnishing';
  const parkingParam = searchParams.get('parking') || 'Any parking';
  const floorParam = searchParams.get('floor') || 'any';
  const buildingParam = searchParams.get('building') || 'All building types';
  const availParam = searchParams.get('avail') || 'any';
  const verifiedParam = searchParams.get('verified') === 'true';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'relevance';
  const layoutParam = searchParams.get('layout') || 'grid';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [layout, setLayout] = useState(layoutParam); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const itemsPerPage = 6;

  // Synchronize exact filter state from the incoming URL
  useEffect(() => {
    setExactFilters({
      intent: 'commercial',
      city: cityParam,
      transactionType: modeParam,
      commercialCategory: categoryParam,
      priceRange: priceParam,
      areaRange: areaParam,
      furnishing: furnishParam,
      parking: parkingParam,
      floorNumber: floorParam,
      buildingType: buildingParam,
      availability: availParam,
      verifiedOnly: verifiedParam,
      query: queryParam
    });
    setSearchQuery(queryParam);
    setSortBy(sortParam);
    setLayout(layoutParam);
    setCurrentPage(pageParam);
  }, [
    cityParam,
    modeParam,
    categoryParam,
    priceParam,
    areaParam,
    furnishParam,
    parkingParam,
    floorParam,
    buildingParam,
    availParam,
    verifiedParam,
    queryParam,
    sortParam,
    layoutParam,
    pageParam,
    setExactFilters
  ]);

  // Update URL Search Params helper
  const updateUrlParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (
        val === null || 
        val === undefined || 
        val === '' || 
        val === 'All cities' || 
        val === 'all' || 
        val === 'All categories' || 
        val === 'All furnishing' || 
        val === 'Any parking' || 
        val === 'any' || 
        val === 'All building types' || 
        val === false
      ) {
        next.delete(key);
      } else {
        next.set(key, String(val));
      }
    });

    if (!updates.page && updates.page !== 1) {
      next.delete('page');
      setCurrentPage(1);
    }

    setSearchParams(next, { replace: true });
  };

  const handleFilterChange = (patch) => {
    const paramMapping = {};
    if ('city' in patch) paramMapping.city = patch.city;
    if ('transactionType' in patch) paramMapping.mode = patch.transactionType;
    if ('commercialCategory' in patch) paramMapping.category = patch.commercialCategory;
    if ('priceRange' in patch) paramMapping.price = patch.priceRange;
    if ('areaRange' in patch) paramMapping.area = patch.areaRange;
    if ('furnishing' in patch) paramMapping.furnish = patch.furnishing;
    if ('parking' in patch) paramMapping.parking = patch.parking;
    if ('floorNumber' in patch) paramMapping.floor = patch.floorNumber;
    if ('buildingType' in patch) paramMapping.building = patch.buildingType;
    if ('availability' in patch) paramMapping.avail = patch.availability;
    if ('verifiedOnly' in patch) paramMapping.verified = patch.verifiedOnly;
    if ('query' in patch) paramMapping.q = patch.query;

    updateUrlParams(paramMapping);
    updateFilters(patch);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    resetFilters();
    setSearchQuery('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ q: searchQuery.trim() });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateUrlParams({ q: '' });
  };

  const handleModeChange = (mode) => {
    updateUrlParams({ mode: mode === 'all' ? null : mode, price: null });
  };

  const handleCategoryChange = (cat) => {
    updateUrlParams({ category: cat === 'All categories' ? null : cat });
  };

  const handleCitySelect = (city) => {
    updateUrlParams({ city: city === 'All cities' ? null : city });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateUrlParams({ sort: newSort === 'relevance' ? null : newSort });
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    updateUrlParams({ layout: newLayout === 'grid' ? null : newLayout });
  };

  // Multi faceted combined filtering engine for Commercial Properties (PRD 5.4)
  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => {
      // Must be commercial property
      const isComm = p.intent === 'commercial' || p.type === 'Commercial' || p.category === 'commercial';
      if (!isComm) return false;

      // 1. Transaction Type / Mode (Buy / Rent / Lease)
      if (modeParam && modeParam !== 'all') {
        const tx = (p.transactionType || p.intent || '').toLowerCase();
        if (tx !== modeParam.toLowerCase()) {
          return false;
        }
      }

      // 2. City Filter
      if (cityParam && cityParam !== 'All cities' && p.city !== cityParam) {
        return false;
      }

      // 3. Property Category Filter
      if (categoryParam && categoryParam !== 'All categories') {
        const pCat = (p.commercialCategory || p.type || '').toLowerCase();
        const fCat = categoryParam.toLowerCase();
        if (!pCat.includes(fCat) && !fCat.includes(pCat)) {
          return false;
        }
      }

      // 4. Price Range (Dynamic based on Buy vs Rent/Lease)
      if (priceParam && priceParam !== 'all') {
        const val = p.priceValue || 0;
        // Commercial Buy ranges
        if (priceParam === 'under-5cr' && val > 50000000) return false;
        if (priceParam === '5cr-15cr' && (val < 50000000 || val > 150000000)) return false;
        if (priceParam === '15cr-30cr' && (val < 150000000 || val > 300000000)) return false;
        if (priceParam === 'above-30cr' && val < 300000000) return false;

        // Commercial Rent / Lease ranges
        if (priceParam === 'under-2lac' && val > 200000) return false;
        if (priceParam === '2lac-5lac' && (val < 200000 || val > 500000)) return false;
        if (priceParam === '5lac-15lac' && (val < 500000 || val > 1500000)) return false;
        if (priceParam === 'above-15lac' && val < 1500000) return false;
      }

      // 5. Property Area Range
      if (areaParam && areaParam !== 'all') {
        const area = p.areaSqFt || 0;
        if (areaParam === 'under-2000' && area > 2000) return false;
        if (areaParam === '2000-5000' && (area < 2000 || area > 5000)) return false;
        if (areaParam === '5000-15000' && (area < 5000 || area > 15000)) return false;
        if (areaParam === 'above-15000' && area < 15000) return false;
      }

      // 6. Furnishing / Fitout Status
      if (furnishParam && furnishParam !== 'All furnishing') {
        if (p.furnishing && p.furnishing.toLowerCase() !== furnishParam.toLowerCase()) {
          return false;
        }
      }

      // 7. Parking
      if (parkingParam && parkingParam !== 'Any parking') {
        const pPark = (p.parking || p.parkingCount || '').toLowerCase();
        const fPark = parkingParam.toLowerCase();
        if (!pPark.includes(fPark)) {
          return false;
        }
      }

      // 8. Floor Number
      if (floorParam && floorParam !== 'any') {
        if (floorParam === 'ground' && (!p.floorNumber || !p.floorNumber.toLowerCase().includes('ground'))) return false;
        if (floorParam === 'low' && (!p.floorNumber || !p.floorNumber.toLowerCase().includes('low'))) return false;
        if (floorParam === 'mid' && (!p.floorNumber || !p.floorNumber.toLowerCase().includes('mid'))) return false;
        if (floorParam === 'high' && (!p.floorNumber || !p.floorNumber.toLowerCase().includes('high'))) return false;
      }

      // 9. Building Type
      if (buildingParam && buildingParam !== 'All building types') {
        if (p.buildingType && p.buildingType.toLowerCase() !== buildingParam.toLowerCase()) {
          return false;
        }
      }

      // 10. Availability
      if (availParam && availParam !== 'any') {
        if (p.availability && p.availability !== availParam) {
          return false;
        }
      }

      // 11. Verification Filter (PRD 4.2.12)
      if (verifiedParam && !p.verified) {
        return false;
      }

      // 12. Search Query (Matches title, location, city, business park, description)
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase().trim();
        const inTitle = p.title?.toLowerCase().includes(q);
        const inLoc = p.location?.toLowerCase().includes(q);
        const inCity = p.city?.toLowerCase().includes(q);
        const inCat = p.commercialCategory?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        if (!inTitle && !inLoc && !inCity && !inCat && !inDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const aPrice = a.priceValue || 0;
      const bPrice = b.priceValue || 0;
      if (sortBy === 'price-low') return aPrice - bPrice;
      if (sortBy === 'price-high') return bPrice - aPrice;
      if (sortBy === 'newest') return (a.postedDaysAgo || 999) - (b.postedDaysAgo || 999);
      if (sortBy === 'area-desc') return (b.areaSqFt || 0) - (a.areaSqFt || 0);
      return 0; // relevance
    });
  }, [
    modeParam,
    cityParam,
    categoryParam,
    priceParam,
    areaParam,
    furnishParam,
    parkingParam,
    floorParam,
    buildingParam,
    availParam,
    verifiedParam,
    queryParam,
    sortBy
  ]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  // Recently viewed commercial properties (PRD 5.4)
  const recentlyViewedCommercial = useMemo(() => {
    if (!recentlyViewedIds || recentlyViewedIds.length === 0) return [];
    return SAMPLE_PROPERTIES.filter(
      (p) => recentlyViewedIds.includes(p.id) && 
        (p.intent === 'commercial' || p.type === 'Commercial' || p.category === 'commercial')
    ).slice(0, 3);
  }, [recentlyViewedIds]);

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* 1. Breadcrumbs Component (PRD 4.1 & 5.4) */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Commercial real estate' }
        ]} 
        className="mb-4" 
      />

      {/* 2. Heading Section per PRD 5.4 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="default" className="px-3 py-1 text-xs gap-1.5 font-semibold">
            <Buildings size={15} weight="fill" className="text-brand-blue" />
            <span>Grade A corporate inventory</span>
          </Badge>
          {cityParam !== 'All cities' && (
            <Badge variant="neutral" className="px-3 py-1 text-xs font-semibold text-brand-navy">
              Scoped to {cityParam}
            </Badge>
          )}
          {modeParam !== 'all' && (
            <Badge variant="neutral" className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue">
              Mode: {modeParam}
            </Badge>
          )}
        </div>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          Commercial properties for sale and lease.
        </h1>
        <p className="body-4 text-slate-500 mt-2 max-w-2xl">
          Verified corporate headquarters, retail storefronts, warehousing hubs, and industrial manufacturing sites with clear zoning approvals, floor load specifications, and direct institutional advisory.
        </p>
      </div>

      {/* 3. Control & Search Bar */}
      <div className="mb-6 p-4 rounded-3xl bg-white shadow-xs border-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input with Instant Clear */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search business park, BKC, Cyber City, or corridor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer"
              aria-label="Clear search input"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </form>

        {/* Controls Cluster: City Selector, Sort Dropdown, Layout Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap self-end lg:self-auto">
          
          {/* Quick City Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-brand-gold shrink-0 hidden sm:inline" />
            <Select value={cityParam} onValueChange={handleCitySelect}>
              <SelectTrigger className="h-9 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-brand-navy min-w-[140px] cursor-pointer">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl bg-white p-1 max-h-64">
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c} className="rounded-xl text-xs font-medium cursor-pointer">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <SortAscending size={16} className="text-slate-400 shrink-0 hidden sm:inline" />
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-9 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-brand-navy min-w-[150px] cursor-pointer">
                <SelectValue placeholder="Sort listings" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl bg-white p-1">
                <SelectItem value="relevance" className="rounded-xl text-xs font-medium cursor-pointer">
                  Relevance
                </SelectItem>
                <SelectItem value="price-low" className="rounded-xl text-xs font-medium cursor-pointer">
                  Price: Low to high
                </SelectItem>
                <SelectItem value="price-high" className="rounded-xl text-xs font-medium cursor-pointer">
                  Price: High to low
                </SelectItem>
                <SelectItem value="newest" className="rounded-xl text-xs font-medium cursor-pointer">
                  Newest first
                </SelectItem>
                <SelectItem value="area-desc" className="rounded-xl text-xs font-medium cursor-pointer">
                  Area: Largest first
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid / List Layout Switcher */}
          <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleLayoutChange('grid')}
              aria-label="Grid layout view"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                layout === 'grid'
                  ? 'bg-white text-brand-navy shadow-xs font-bold'
                  : 'text-slate-400 hover:text-brand-navy'
              }`}
            >
              <SquaresFour size={16} weight={layout === 'grid' ? 'bold' : 'regular'} />
            </button>
            <button
              type="button"
              onClick={() => handleLayoutChange('list')}
              aria-label="List layout view"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                layout === 'list'
                  ? 'bg-white text-brand-navy shadow-xs font-bold'
                  : 'text-slate-400 hover:text-brand-navy'
              }`}
            >
              <Rows size={16} weight={layout === 'list' ? 'bold' : 'regular'} />
            </button>
          </div>

        </div>

      </div>

      {/* 6. Active Filter Chips with direct param removal */}
      <ActiveFilterChips 
        onFilterChange={handleFilterChange} 
        onReset={handleReset} 
      />

      {/* 7. Main Layout with Filter Sidebar and Property Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* Responsive Commercial Filter Sidebar */}
        <FilterSidebar 
          totalResults={filteredProperties.length} 
          intent="commercial"
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Results Area */}
        <div className="flex-1 w-full">
          
          {/* Result Count Indicator */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="caption-2 font-semibold text-slate-500">
              Showing <span className="text-brand-navy font-bold">{filteredProperties.length}</span> verified commercial {filteredProperties.length === 1 ? 'property' : 'properties'}
            </span>
            {cityParam !== 'All cities' && (
              <span className="text-xs text-brand-blue font-semibold">
                in {cityParam}
              </span>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className={`grid ${layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6 mb-8`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : hasError ? (
            /* Error State with Retry Button */
            <ErrorState
              title="Unable to load commercial properties"
              description="A network error occurred while retrieving verified commercial properties. Please retry."
              onRetry={() => {
                setHasError(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 400);
              }}
            />
          ) : paginatedProperties.length > 0 ? (
            /* Loaded Results Grid / List */
            <>
              <div className={`grid ${layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6 mb-8`}>
                {paginatedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    layout={layout}
                  />
                ))}
              </div>

              {/* 8. Pagination Control */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  updateUrlParams({ page });
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            /* No Results Empty State */
            <EmptyState
              title="No commercial properties match your search"
              description="We could not find any active commercial listings matching your exact combination of search criteria. Try expanding to another business district or clearing selected filters."
              actionLabel="Reset all filters"
              onAction={handleReset}
            />
          )}

          {/* 9. Recently Viewed Properties Section per PRD 5.4 */}
          {recentlyViewedCommercial.length > 0 && (
            <section className="mt-16 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} className="text-brand-gold" />
                <h2 className="heading-4 text-brand-navy font-bold">
                  Recently viewed commercial spaces
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentlyViewedCommercial.map((property) => (
                  <PropertyCard key={`recent-${property.id}`} property={property} />
                ))}
              </div>
            </section>
          )}

        </div>

      </div>

    </div>
  );
}
