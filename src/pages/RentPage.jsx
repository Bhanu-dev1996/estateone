import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  MagnifyingGlass, 
  SlidersHorizontal, 
  Buildings, 
  SortAscending,
  SquaresFour,
  Rows,
  X,
  MapPin,
  Clock,
  ArrowClockwise
} from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES, CITIES } from '../data/properties';
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
    return SAMPLE_PROPERTIES.filter(
      (p) => recentlyViewedIds.includes(p.id) && p.intent === 'rent'
    ).slice(0, 3);
  }, [recentlyViewedIds]);

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* 1. Breadcrumbs Component (PRD 4.1 & 5.3) */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Properties for rent' }
        ]} 
        className="mb-4" 
      />

      {/* 2. Heading Section per PRD 5.3 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="default" className="px-3 py-1 text-xs gap-1.5 font-semibold">
            <ShieldCheck size={15} weight="fill" className="text-brand-blue" />
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

      {/* 3. Search Bar, City Selector, Sort, Layout Bar */}
      <div className="mb-6 p-4 rounded-3xl bg-white shadow-xs border-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input with Instant Clear */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search locality, building, or landmark..."
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
                  Rent: Low to high
                </SelectItem>
                <SelectItem value="price-high" className="rounded-xl text-xs font-medium cursor-pointer">
                  Rent: High to low
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
        <div className="flex-1 w-full">
          
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
            <div className={`grid ${layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6 mb-8`}>
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
              <div className={`grid ${layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6 mb-8`}>
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

          {/* 7. Recently Viewed Properties Section per PRD 5.3 */}
          {recentlyViewedRentals.length > 0 && (
            <section className="mt-16 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} className="text-brand-gold" />
                <h2 className="heading-4 text-brand-navy font-bold">
                  Recently viewed rental properties
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentlyViewedRentals.map((property) => (
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
