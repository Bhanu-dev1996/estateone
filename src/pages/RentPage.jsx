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
import { Button } from '../components/ui/button';
import { RENT_LISTING_SORT_OPTIONS } from '../lib/listingSortOptions';
import { getPropertyResultsLayoutClass } from '../lib/listingResultsLayout';

export default function RentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    filters, 
    updateFilters, 
    setExactFilters,
    resetFilters, 
    recentlyViewedIds 
  } = useProperty();

  // Read URL search parameters directly (single source of truth per PRD 5.3)
  const cityParam = searchParams.get('city') || 'All cities';
  const typeParam = searchParams.get('type') || 'All types';
  const rentParam = searchParams.get('rent') || searchParams.get('budget') || 'all';
  const depositParam = searchParams.get('deposit') || 'all';
  const bhkParam = searchParams.get('bhk') || 'Any rooms';
  const bathsParam = searchParams.get('baths') || 'Any baths';
  const furnishParam = searchParams.get('furnish') || 'All furnishing';
  const tenantParam = searchParams.get('tenant') || 'All tenants';
  const availParam = searchParams.get('avail') || 'any';
  const leaseParam = searchParams.get('lease') || 'any';
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
  // If the user lands from Popular Locations (/rent?city=Hyderabad), only Hyderabad is scoped and others reset
  useEffect(() => {
    setExactFilters({
      intent: 'rent',
      city: cityParam,
      type: typeParam,
      priceRange: rentParam,
      depositRange: depositParam,
      bedrooms: bhkParam,
      bathrooms: bathsParam,
      furnishing: furnishParam,
      tenantType: tenantParam,
      availableFrom: availParam,
      leaseDuration: leaseParam,
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
    rentParam,
    depositParam,
    bhkParam,
    bathsParam,
    furnishParam,
    tenantParam,
    availParam,
    leaseParam,
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
      if (val === null || val === undefined || val === '' || val === 'All cities' || val === 'All types' || val === 'all' || val === 'Any rooms' || val === 'Any baths' || val === 'All furnishing' || val === 'All tenants' || val === 'any' || val === false) {
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
    if ('type' in patch) paramMapping.type = patch.type;
    if ('priceRange' in patch) paramMapping.rent = patch.priceRange;
    if ('depositRange' in patch) paramMapping.deposit = patch.depositRange;
    if ('bedrooms' in patch) paramMapping.bhk = patch.bedrooms;
    if ('bathrooms' in patch) paramMapping.baths = patch.bathrooms;
    if ('furnishing' in patch) paramMapping.furnish = patch.furnishing;
    if ('tenantType' in patch) paramMapping.tenant = patch.tenantType;
    if ('availableFrom' in patch) paramMapping.avail = patch.availableFrom;
    if ('leaseDuration' in patch) paramMapping.lease = patch.leaseDuration;
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

  // Multi faceted combined filtering engine for Rent (PRD 4.2.1, 4.2.13, 5.3)
  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => {
      // Must be rental property
      if (p.intent !== 'rent') return false;

      // 1. City Filter
      if (cityParam && cityParam !== 'All cities' && p.city !== cityParam) {
        return false;
      }

      // 2. Property Type Filter
      if (typeParam && typeParam !== 'All types') {
        const pType = (p.type || '').toLowerCase();
        const fType = typeParam.toLowerCase();
        if (!pType.includes(fType) && !fType.includes(pType)) {
          return false;
        }
      }

      // 3. Monthly Rent Range Filter
      if (rentParam && rentParam !== 'all') {
        const rent = p.monthlyRentValue || p.priceValue || 0;
        if (rentParam === 'under-50k' && rent > 50000) return false;
        if (rentParam === '50k-1.5lac' && (rent < 50000 || rent > 150000)) return false;
        if (rentParam === '1.5lac-3lac' && (rent < 150000 || rent > 300000)) return false;
        if (rentParam === 'above-3lac' && rent < 300000) return false;
      }

      // 4. Security Deposit Range Filter (PRD 5.3)
      if (depositParam && depositParam !== 'all') {
        const deposit = p.depositValue || 0;
        if (depositParam === 'under-1.5lac' && deposit > 150000) return false;
        if (depositParam === '1.5lac-4lac' && (deposit < 150000 || deposit > 400000)) return false;
        if (depositParam === '4lac-8lac' && (deposit < 400000 || deposit > 800000)) return false;
        if (depositParam === 'above-8lac' && deposit < 800000) return false;
      }

      // 5. Bedrooms Filter
      if (bhkParam && bhkParam !== 'Any rooms') {
        const targetBhk = parseInt(bhkParam, 10);
        if (bhkParam.includes('+')) {
          if ((p.bedroomCount || 0) < targetBhk) return false;
        } else if (p.bedroomCount !== targetBhk) {
          return false;
        }
      }

      // 6. Bathrooms Filter
      if (bathsParam && bathsParam !== 'Any baths') {
        const targetBaths = parseInt(bathsParam, 10);
        if (bathsParam.includes('+')) {
          if ((p.bathroomCount || 0) < targetBaths) return false;
        } else if (p.bathroomCount !== targetBaths) {
          return false;
        }
      }

      // 7. Furnishing Status Filter
      if (furnishParam && furnishParam !== 'All furnishing') {
        if (p.furnishing && p.furnishing.toLowerCase() !== furnishParam.toLowerCase()) {
          return false;
        }
      }

      // 8. Preferred Tenant Type Filter (PRD 5.3)
      if (tenantParam && tenantParam !== 'All tenants') {
        const pTenant = (p.preferredTenant || p.tenantCategory || '').toLowerCase();
        const fTenant = tenantParam.toLowerCase();
        if (!pTenant.includes(fTenant)) {
          return false;
        }
      }

      // 9. Available From Timeline (PRD 5.3)
      if (availParam && availParam !== 'any') {
        if (p.availableFrom && p.availableFrom !== availParam) {
          return false;
        }
      }

      // 10. Lease Duration (PRD 5.3)
      if (leaseParam && leaseParam !== 'any') {
        if (leaseParam === '11-months' && p.leaseDuration !== '11 months') return false;
        if (leaseParam === '1-to-2-years' && p.leaseDuration !== '1 to 2 years') return false;
        if (leaseParam === '3-plus-years' && p.leaseDuration !== '3+ years') return false;
      }

      // 11. Verification Filter (PRD 4.2.12)
      if (verifiedParam && !p.verified) {
        return false;
      }

      // 12. Search Query (Matches title, location, city, landmark)
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase().trim();
        const inTitle = p.title?.toLowerCase().includes(q);
        const inLoc = p.location?.toLowerCase().includes(q);
        const inCity = p.city?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        if (!inTitle && !inLoc && !inCity && !inDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const aRent = a.monthlyRentValue || a.priceValue || 0;
      const bRent = b.monthlyRentValue || b.priceValue || 0;
      if (sortBy === 'price-low') return aRent - bRent;
      if (sortBy === 'price-high') return bRent - aRent;
      if (sortBy === 'newest') return (a.postedDaysAgo || 999) - (b.postedDaysAgo || 999);
      if (sortBy === 'area-desc') return (b.areaSqFt || 0) - (a.areaSqFt || 0);
      return 0; // relevance
    });
  }, [
    cityParam,
    typeParam,
    rentParam,
    depositParam,
    bhkParam,
    bathsParam,
    furnishParam,
    tenantParam,
    availParam,
    leaseParam,
    verifiedParam,
    queryParam,
    sortBy
  ]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  // Recently viewed rental properties (PRD 5.3)
  const recentlyViewedRentals = useMemo(() => {
    if (!recentlyViewedIds || recentlyViewedIds.length === 0) return [];
    return recentlyViewedIds
      .map((id) => SAMPLE_PROPERTIES.find((p) => p.id === id))
      .filter((p) => p && p.intent === 'rent')
      .slice(0, 3);
  }, [recentlyViewedIds]);

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto text-left">
      
      {/* 1. Breadcrumbs Component (PRD 4.1 & 5.3) */}
      <Breadcrumbs 
        items={[{ label: 'Properties for rent' }]} 
        className="mb-4" 
      />

      {/* 2. Heading Section per PRD 5.3 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="default" className="px-3 py-1 text-xs gap-1.5 font-semibold">
            <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
            <span>Verified rental inventory</span>
          </Badge>
          {cityParam !== 'All cities' && (
            <Badge variant="neutral" className="px-3 py-1 text-xs font-semibold text-brand-navy">
              Scoped to {cityParam}
            </Badge>
          )}
        </div>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          Properties for rent.
        </h1>
        <p className="body-4 text-slate-500 mt-2 max-w-2xl">
          Discover verified rental apartments, penthouses, and residences with separate monthly rent and security deposit disclosures, direct landlord coordination, and zero duplicate listings.
        </p>
      </div>

      <PropertyListingToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={handleClearSearch}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Search locality, building, or landmark..."
        city={cityParam}
        onCityChange={handleCitySelect}
        layout={layout}
        onLayoutChange={handleLayoutChange}
        sortBy={sortBy}
        sortOptions={RENT_LISTING_SORT_OPTIONS}
        onSortChange={handleSortChange}
      />

      {/* 4. Active Filter Chips with direct param removal */}
      <ActiveFilterChips 
        onFilterChange={handleFilterChange} 
        onReset={handleReset} 
      />

      {/* 5. Main Layout with Filter Sidebar and Property Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* Responsive Filter Sidebar with Mobile Drawer */}
        <FilterSidebar 
          totalResults={filteredProperties.length} 
          intent="rent"
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Result Count Indicator */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="caption-2 font-semibold text-slate-500">
              Showing <span className="text-brand-navy font-bold">{filteredProperties.length}</span> verified rental {filteredProperties.length === 1 ? 'property' : 'properties'}
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
              title="Unable to load rental listings"
              description="A network error occurred while retrieving verified rental properties. Please retry."
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

              {/* 6. Pagination Control */}
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
              title="No rental properties match your search"
              description="We could not find any active rental listings matching your exact combination of filters. Try clearing specific filters or adjusting your budget."
              actionLabel="Reset all filters"
              onAction={handleReset}
            />
          )}

        </div>

      </div>

      {/* Recently viewed — full width (same as Buy page) */}
      {recentlyViewedRentals.length > 0 && (
        <section className="listing-recent-section">
          <div className="listing-recent-section__header">
            <span className="listing-recent-section__eyebrow mkt-section-eyebrow">
              Browsing history
            </span>
            <h2 className="listing-recent-section__title">
              Recently viewed rental properties
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewedRentals.map((property) => (
              <PropertyCard key={`recent-${property.id}`} property={property} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
