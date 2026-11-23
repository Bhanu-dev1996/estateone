import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../data/properties';
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
import { Badge } from '../components/ui/badge';
import ListPropertyCTA from '../components/home/ListPropertyCTA';
import { BUY_LISTING_SORT_OPTIONS } from '../lib/listingSortOptions';
import { getPropertyResultsLayoutClass } from '../lib/listingResultsLayout';

export default function BuyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    filters, 
    updateFilters, 
    setExactFilters,
    resetFilters, 
    recentlyViewedIds 
  } = useProperty();

  // Read URL search parameters directly (URL is the single source of truth per PRD 5.2)
  const cityParam = searchParams.get('city') || 'All cities';
  const typeParam = searchParams.get('type') || 'All types';
  const budgetParam = searchParams.get('budget') || 'all';
  const bhkParam = searchParams.get('bhk') || 'Any rooms';
  const bathsParam = searchParams.get('baths') || 'Any baths';
  const statusParam = searchParams.get('status') || 'All statuses';
  const areaParam = searchParams.get('area') || 'all';
  const furnishParam = searchParams.get('furnish') || 'All furnishing';
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
  // If the user lands from Popular Locations (/buy?city=Hyderabad), only Hyderabad is scoped and other criteria reset to defaults
  useEffect(() => {
    setExactFilters({
      intent: 'buy',
      city: cityParam,
      type: typeParam,
      priceRange: budgetParam,
      bedrooms: bhkParam,
      bathrooms: bathsParam,
      possession: statusParam,
      areaRange: areaParam,
      furnishing: furnishParam,
      verifiedOnly: verifiedParam,
      query: queryParam
    });
    setSearchQuery(queryParam);
    setSortBy(sortParam);
    setLayout(layoutParam);
    setCurrentPage(pageParam);
  }, [
    cityParam,
    typeParam,
    budgetParam,
    bhkParam,
    bathsParam,
    statusParam,
    areaParam,
    furnishParam,
    verifiedParam,
    queryParam,
    sortParam,
    layoutParam,
    pageParam,
    setExactFilters
  ]);

  // Handler to synchronize URL search parameters when filters change
  const handleFilterUpdate = (patch) => {
    const next = new URLSearchParams(searchParams);
    
    if ('city' in patch) {
      if (!patch.city || patch.city === 'All cities') next.delete('city');
      else next.set('city', patch.city);
    }
    if ('type' in patch) {
      if (!patch.type || patch.type === 'All types') next.delete('type');
      else next.set('type', patch.type);
    }
    if ('priceRange' in patch) {
      if (!patch.priceRange || patch.priceRange === 'all') next.delete('budget');
      else next.set('budget', patch.priceRange);
    }
    if ('bedrooms' in patch) {
      if (!patch.bedrooms || patch.bedrooms === 'Any rooms') next.delete('bhk');
      else next.set('bhk', patch.bedrooms);
    }
    if ('bathrooms' in patch) {
      if (!patch.bathrooms || patch.bathrooms === 'Any baths') next.delete('baths');
      else next.set('baths', patch.bathrooms);
    }
    if ('possession' in patch) {
      if (!patch.possession || patch.possession === 'All statuses') next.delete('status');
      else next.set('status', patch.possession);
    }
    if ('areaRange' in patch) {
      if (!patch.areaRange || patch.areaRange === 'all') next.delete('area');
      else next.set('area', patch.areaRange);
    }
    if ('furnishing' in patch) {
      if (!patch.furnishing || patch.furnishing === 'All furnishing') next.delete('furnish');
      else next.set('furnish', patch.furnishing);
    }
    if ('verifiedOnly' in patch) {
      if (!patch.verifiedOnly) next.delete('verified');
      else next.set('verified', 'true');
    }

    next.delete('page'); // Reset to page 1 on filter modification
    setSearchParams(next);
  };

  const handleQueryChange = (val) => {
    setSearchQuery(val);
    const next = new URLSearchParams(searchParams);
    if (val.trim()) next.set('q', val.trim());
    else next.delete('q');
    next.delete('page');
    setSearchParams(next);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'relevance') next.set('sort', val);
    else next.delete('sort');
    setSearchParams(next);
  };

  const handleLayoutChange = (val) => {
    setLayout(val);
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'grid') next.set('layout', val);
    else next.delete('layout');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    resetFilters();
  };

  // Multi faceted filtering engine combining all 11 criteria (PRD 4.2.1 & 5.2)
  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => {
      // 1. Transaction intent must be buy
      if (p.intent !== 'buy') return false;

      // 2. City filter
      if (cityParam && cityParam !== 'All cities' && p.city !== cityParam) {
        return false;
      }

      // 3. Property type filter
      if (typeParam && typeParam !== 'All types') {
        const pType = (p.type || '').toLowerCase();
        const fType = typeParam.toLowerCase();
        if (!pType.includes(fType) && !fType.includes(pType)) {
          return false;
        }
      }

      // 4. Budget range filter
      if (budgetParam && budgetParam !== 'all') {
        const val = p.priceValue || 0;
        if (budgetParam === 'under-1cr' && val >= 10000000) return false;
        if (budgetParam === '1cr-3cr' && (val < 10000000 || val > 30000000)) return false;
        if (budgetParam === '3cr-7cr' && (val < 30000000 || val > 70000000)) return false;
        if (budgetParam === '7cr-15cr' && (val < 70000000 || val > 150000000)) return false;
        if (budgetParam === 'above-15cr' && val < 150000000) return false;
      }

      // 5. Bedrooms filter
      if (bhkParam && bhkParam !== 'Any rooms') {
        const bhkNum = parseInt(bhkParam, 10);
        if (bhkNum) {
          if (bhkParam.includes('+')) {
            if ((p.bedroomCount || 0) < bhkNum) return false;
          } else {
            if (p.bedroomCount !== bhkNum) return false;
          }
        }
      }

      // 6. Bathrooms filter
      if (bathsParam && bathsParam !== 'Any baths') {
        const bathNum = parseInt(bathsParam, 10);
        if (bathNum && (p.bathroomCount || 0) < bathNum) {
          return false;
        }
      }

      // 7. Possession status filter
      if (statusParam && statusParam !== 'All statuses') {
        if (p.status !== statusParam) return false;
      }

      // 8. Built up area filter
      if (areaParam && areaParam !== 'all') {
        const sqft = p.areaSqFt || 0;
        if (areaParam === 'under-1000' && sqft >= 1000) return false;
        if (areaParam === '1000-2000' && (sqft < 1000 || sqft > 2000)) return false;
        if (areaParam === '2000-3500' && (sqft < 2000 || sqft > 3500)) return false;
        if (areaParam === '3500-5000' && (sqft < 3500 || sqft > 5000)) return false;
        if (areaParam === 'above-5000' && sqft < 5000) return false;
      }

      // 9. Furnishing state filter
      if (furnishParam && furnishParam !== 'All furnishing') {
        if (p.furnishing !== furnishParam) return false;
      }

      // 10. Amenities filter (all selected amenities must match)
      if (filters.amenities && filters.amenities.length > 0) {
        const pAmenities = p.amenities || [];
        const matchesAll = filters.amenities.every((a) => pAmenities.includes(a));
        if (!matchesAll) return false;
      }

      // 11. Posted date filter
      if (filters.postedDate && filters.postedDate !== 'any') {
        const daysAgo = p.postedDaysAgo || 0;
        if (filters.postedDate === '24h' && daysAgo > 1) return false;
        if (filters.postedDate === '7d' && daysAgo > 7) return false;
        if (filters.postedDate === '30d' && daysAgo > 30) return false;
      }

      // 12. Verification filter (PRD 4.2.12)
      if (verifiedParam && !p.verified) {
        return false;
      }

      // 13. Free text query search (title, location, city, type)
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase().trim();
        const inTitle = (p.title || '').toLowerCase().includes(q);
        const inLoc = (p.location || '').toLowerCase().includes(q);
        const inCity = (p.city || '').toLowerCase().includes(q);
        const inType = (p.type || '').toLowerCase().includes(q);
        if (!inTitle && !inLoc && !inCity && !inType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.priceValue || 0) - (b.priceValue || 0);
      if (sortBy === 'price-high') return (b.priceValue || 0) - (a.priceValue || 0);
      if (sortBy === 'area-largest') return (b.areaSqFt || 0) - (a.areaSqFt || 0);
      if (sortBy === 'newest') return (a.postedDaysAgo || 0) - (b.postedDaysAgo || 0);
      return 0; // relevance
    });
  }, [
    cityParam,
    typeParam,
    budgetParam,
    bhkParam,
    bathsParam,
    statusParam,
    areaParam,
    furnishParam,
    verifiedParam,
    queryParam,
    sortBy,
    filters.amenities,
    filters.postedDate
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  // Recently viewed properties resolution (PRD 5.2)
  const recentlyViewedProperties = useMemo(() => {
    if (!recentlyViewedIds || recentlyViewedIds.length === 0) return [];
    return recentlyViewedIds
      .map((id) => SAMPLE_PROPERTIES.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 3);
  }, [recentlyViewedIds]);

  // Start index and end index for result count display
  const startIndex = filteredProperties.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProperties.length);

  return (
    <>
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto text-left">
      
      {/* 1. Breadcrumb Component (PRD 5.2) */}
      <Breadcrumbs items={[{ label: 'Buy properties' }]} className="mb-4" />

      {/* 2. Heading Section per PRD 5.2 */}
      <div className="mb-8">
        <Badge variant="default" className="mb-3">
          <ShieldCheck size={16} weight="fill" className="text-brand-blue" aria-hidden />
          <span>Verified purchase inventory</span>
        </Badge>
        <h1 className="text-h1 text-brand-navy tracking-tight text-balance">
          Properties for sale.
        </h1>
        <p className="mkt-section-desc text-slate-500 mt-2">
          Discover verified residences, luxury apartments, standalone villas, and residential plots with comprehensive title disclosures and verified owner pricing.
        </p>
      </div>

      <PropertyListingToolbar
        searchQuery={searchQuery}
        onSearchChange={handleQueryChange}
        onSearchClear={() => handleQueryChange('')}
        city={cityParam}
        onCityChange={(val) => handleFilterUpdate({ city: val })}
        layout={layout}
        onLayoutChange={handleLayoutChange}
        sortBy={sortBy}
        sortOptions={BUY_LISTING_SORT_OPTIONS}
        onSortChange={handleSortChange}
      />

      {/* 4. Active Filter Chips per PRD 5.2 */}
      <ActiveFilterChips 
        onFilterChange={handleFilterUpdate} 
        onReset={handleResetFilters} 
      />

      {/* Main Content Layout: Filters Sidebar and Results Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* 5. Filters Sidebar Component (PRD 5.2) */}
        <FilterSidebar 
          totalResults={filteredProperties.length} 
          intent="buy" 
          onFilterChange={handleFilterUpdate}
          onReset={handleResetFilters}
        />

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* 6. Result Count Indicator per PRD 5.2 */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <p className="caption-1 font-semibold text-slate-600">
              {filteredProperties.length > 0 ? (
                <span>
                  Showing <strong className="text-brand-navy">{startIndex} to {endIndex}</strong> of <strong className="text-brand-navy">{filteredProperties.length}</strong> verified properties
                </span>
              ) : (
                <span>No matching verified listings</span>
              )}
            </p>

            <span className="caption-2 font-medium text-slate-400 hidden sm:inline">
              RERA verified inventory
            </span>
          </div>

          {/* 7. Loading / Results / Empty / Error State Handling (PRD 4.3 & 5.2) */}
          {hasError ? (
            <ErrorState
              title="Unable to load property catalogue"
              description="A temporary network issue prevented retrieving listings. Please retry your request."
              onRetry={() => {
                setHasError(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 400);
              }}
            />
          ) : isLoading ? (
            <div className={getPropertyResultsLayoutClass(layout, 'catalogue')}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <PropertyCardSkeleton key={idx} />
              ))}
            </div>
          ) : paginatedProperties.length > 0 ? (
            <>
              {/* 8. Property Grid or List View (PRD 5.2) */}
              <div className={getPropertyResultsLayoutClass(layout, 'catalogue')}>
                {paginatedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    layout={layout}
                  />
                ))}
              </div>

              {/* 9. Pagination Component (PRD 5.2) */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    const next = new URLSearchParams(searchParams);
                    if (page > 1) next.set('page', page.toString());
                    else next.delete('page');
                    setSearchParams(next);
                    window.scrollTo({ top: 220, behavior: 'smooth' });
                  }}
                />
              )}
            </>
          ) : (
            /* 10. Empty State Component (PRD 4.3 & 5.2) */
            <EmptyState
              title="No verified sale residences match your filters"
              description="No properties currently match your combined search criteria. Try clearing some filters or expanding your budget range."
              actionLabel="Reset all filters"
              onAction={handleResetFilters}
            />
          )}

        </div>

      </div>

      {/* 11. Optional Recently Viewed Properties (PRD 5.2) */}
      {recentlyViewedProperties.length > 0 && (
        <section className="listing-recent-section">
          <div className="listing-recent-section__header">
            <span className="listing-recent-section__eyebrow mkt-section-eyebrow">
              Browsing history
            </span>
            <h2 className="listing-recent-section__title">
              Recently viewed properties
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewedProperties.map((prop) => (
              <PropertyCard key={`recent-${prop.id}`} property={prop} />
            ))}
          </div>
        </section>
      )}

    </div>

    <ListPropertyCTA />
    </>
  );
}
