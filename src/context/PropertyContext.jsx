import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const PropertyContext = createContext(null);

const DEFAULT_FILTERS = {
  intent: 'buy',
  city: 'All cities',
  locality: '',
  type: 'All types',
  priceRange: 'all',
  minPrice: null,
  maxPrice: null,
  bedrooms: 'Any rooms',
  bathrooms: 'Any baths',
  furnishing: 'All furnishing',
  possession: 'All statuses',
  areaRange: 'all',
  amenities: [],
  postedDate: 'any',
  verifiedOnly: false,
  query: ''
};

export function PropertyProvider({ children }) {
  const { toastSuccess, toastInfo, toastError } = useToast();

  // 1. Saved Properties (Wishlist) with localStorage persistence
  const [savedPropertyIds, setSavedPropertyIds] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_saved_properties');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-7'];
    } catch {
      return ['prop-1', 'prop-7'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('estateone_saved_properties', JSON.stringify(savedPropertyIds));
    } catch {
      // storage unavailable
    }
  }, [savedPropertyIds]);

  const isSaved = useCallback((id) => savedPropertyIds.includes(id), [savedPropertyIds]);

  const toggleSave = useCallback((property) => {
    const id = typeof property === 'string' ? property : property.id;
    const title = typeof property === 'string' ? 'Property' : property.title;

    setSavedPropertyIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toastInfo('Removed from saved properties', `${title} was removed from your collection.`);
        return prev.filter((item) => item !== id);
      } else {
        toastSuccess('Saved to your collection', `${title} is now in your saved properties.`);
        return [...prev, id];
      }
    });
  }, [toastInfo, toastSuccess]);

  // 2. Compare Properties (Max 4) with localStorage persistence
  const [comparePropertyIds, setComparePropertyIds] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_compare_properties');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('estateone_compare_properties', JSON.stringify(comparePropertyIds));
    } catch {
      // storage unavailable
    }
  }, [comparePropertyIds]);

  const isCompared = useCallback((id) => comparePropertyIds.includes(id), [comparePropertyIds]);

  const toggleCompare = useCallback((property) => {
    const id = typeof property === 'string' ? property : property.id;
    const title = typeof property === 'string' ? 'Property' : property.title;

    setComparePropertyIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toastInfo('Removed from comparison', `${title} was removed from your comparison set.`);
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 4) {
          toastError('Comparison limit reached', 'You can compare up to 4 properties at a time.');
          return prev;
        }
        toastSuccess('Added to comparison', `${title} was added to your comparison set.`);
        return [...prev, id];
      }
    });
  }, [toastInfo, toastSuccess, toastError]);

  const removeCompare = useCallback((id) => {
    setComparePropertyIds((prev) => prev.filter((item) => item !== id));
    toastInfo('Removed from comparison', 'The listing was removed from your comparison set.');
  }, [toastInfo]);

  const clearCompare = useCallback(() => {
    setComparePropertyIds([]);
    toastInfo('Comparison cleared', 'All properties were removed from your comparison set.');
  }, [toastInfo]);

  // 3. Search and Faceted Filter State Preservation (PRD 4.2.1 & 4.2.2)
  const [filters, setFilters] = useState(() => {
    try {
      const stored = sessionStorage.getItem('estateone_active_filters');
      return stored ? { ...DEFAULT_FILTERS, ...JSON.parse(stored) } : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('estateone_active_filters', JSON.stringify(filters));
    } catch {
      // storage unavailable
    }
  }, [filters]);

  const updateFilters = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const setExactFilters = useCallback((newFilters) => {
    setFilters({ ...DEFAULT_FILTERS, ...newFilters });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    toastInfo('Filters reset', 'All search criteria have returned to default values.');
  }, [toastInfo]);

  // 4. Modals State: Enquiry & Site Visit (PRD 4.1, 4.2.6, 4.2.7)
  const [enquiryProperty, setEnquiryProperty] = useState(null);
  const [siteVisitProperty, setSiteVisitProperty] = useState(null);
  const [confirmationConfig, setConfirmationConfig] = useState(null);

  const openEnquiry = useCallback((property) => setEnquiryProperty(property), []);
  const closeEnquiry = useCallback(() => setEnquiryProperty(null), []);

  const openSiteVisit = useCallback((property) => setSiteVisitProperty(property), []);
  const closeSiteVisit = useCallback(() => setSiteVisitProperty(null), []);

  const openConfirm = useCallback((config) => setConfirmationConfig(config), []);
  const closeConfirm = useCallback(() => setConfirmationConfig(null), []);

  // 5. Recently Viewed Properties (PRD 5.2) with localStorage persistence
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_recently_viewed');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2', 'prop-8'];
    } catch {
      return ['prop-1', 'prop-2', 'prop-8'];
    }
  });

  const markRecentlyViewed = useCallback((id) => {
    if (!id) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const updated = [id, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('estateone_recently_viewed', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        savedPropertyIds,
        isSaved,
        toggleSave,
        comparePropertyIds,
        isCompared,
        toggleCompare,
        removeCompare,
        clearCompare,
        recentlyViewedIds,
        markRecentlyViewed,
        filters,
        updateFilters,
        setExactFilters,
        resetFilters,
        enquiryProperty,
        openEnquiry,
        closeEnquiry,
        siteVisitProperty,
        openSiteVisit,
        closeSiteVisit,
        confirmationConfig,
        openConfirm,
        closeConfirm
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}
