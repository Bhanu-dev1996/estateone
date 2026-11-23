import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Buildings, ShieldCheck } from '@phosphor-icons/react';
import { 
  SAMPLE_PROPERTIES, 
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
import PropertyListingToolbar from '../components/shared/PropertyListingToolbar';
import { PropertyCardSkeleton } from '../components/shared/LoadingSkeleton';
import { COMMERCIAL_LISTING_SORT_OPTIONS } from '../lib/listingSortOptions';
import { getPropertyResultsLayoutClass } from '../lib/listingResultsLayout';
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
    return recentlyViewedIds
      .map((id) => SAMPLE_PROPERTIES.find((p) => p.id === id))
      .filter(
        (p) =>
          p &&
          (p.intent === 'commercial' || p.type === 'Commercial' || p.category === 'commercial')
      )
      .slice(0, 3);
  }, [recentlyViewedIds]);

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto text-left">
      
      {/* 1. Breadcrumbs Component (PRD 4.1 & 5.4) */}
      <Breadcrumbs 
        items={[{ label: 'Commercial real estate' }]} 
        className="mb-4" 
      />

      {/* 2. Heading Section per PRD 5.4 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="default" className="px-3 py-1 text-xs gap-1.5 font-semibold">
            <Buildings size={16} weight="fill" className="text-brand-blue" />
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

      <PropertyListingToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={handleClearSearch}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Search business park, BKC, Cyber City, or corridor..."
        city={cityParam}
        onCityChange={handleCitySelect}
        layout={layout}
        onLayoutChange={handleLayoutChange}
        sortBy={sortBy}
        sortOptions={COMMERCIAL_LISTING_SORT_OPTIONS}
        onSortChange={handleSortChange}
      />

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
        <div className="flex-1 w-full min-w-0">
          
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
            <div className={getPropertyResultsLayoutClass(layout, 'catalogue')}>
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
              <div className={getPropertyResultsLayoutClass(layout, 'catalogue')}>
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

        </div>

      </div>

      {/* Recently viewed — full width (same as Buy page) */}
      {recentlyViewedCommercial.length > 0 && (
        <section className="listing-recent-section">
          <div className="listing-recent-section__header">
            <span className="listing-recent-section__eyebrow mkt-section-eyebrow">
              Browsing history
            </span>
            <h2 className="listing-recent-section__title">
              Recently viewed commercial spaces
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewedCommercial.map((property) => (
              <PropertyCard key={`recent-${property.id}`} property={property} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
