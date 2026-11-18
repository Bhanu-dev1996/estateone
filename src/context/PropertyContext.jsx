import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();

  // 1. Saved Properties (Wishlist) with Guest / Auth Merge Support (PRD 5.7)
  const [savedPropertyIds, setSavedPropertyIds] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_saved_properties');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-7'];
    } catch {
      return ['prop-1', 'prop-7'];
    }
  });

  // Guest prompt modal when clicking save while not authenticated (PRD 5.7 Wishlist Flow)
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [savePromptProperty, setSavePromptProperty] = useState(null);

  // Sync saved properties with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('estateone_saved_properties', JSON.stringify(savedPropertyIds));
      if (user && user.id) {
        localStorage.setItem(`estateone_account_saved_${user.id}`, JSON.stringify(savedPropertyIds));
      }
    } catch {
      // storage unavailable
    }
  }, [savedPropertyIds, user]);

  // Authenticated behavior: Merge account items and handle pending post-login save (PRD 5.7)
  useEffect(() => {
    if (user && user.id) {
      try {
        // 1. Check if there was a pending save initiated before login
        const pendingStr = sessionStorage.getItem('estateone_pending_save');
        let pendingId = null;
        if (pendingStr) {
          const pendingObj = JSON.parse(pendingStr);
          pendingId = pendingObj?.id;
          sessionStorage.removeItem('estateone_pending_save');
          if (pendingObj?.title) {
            toastSuccess('Saved to your collection', `${pendingObj.title} was saved to your account.`);
          }
        }

        // 2. Merge with account saved items
        const accountStored = localStorage.getItem(`estateone_account_saved_${user.id}`);
        const accountIds = accountStored ? JSON.parse(accountStored) : [];
        setSavedPropertyIds((sessionIds) => {
          const combined = pendingId 
            ? [...sessionIds, pendingId, ...(Array.isArray(accountIds) ? accountIds : [])]
            : [...sessionIds, ...(Array.isArray(accountIds) ? accountIds : [])];
          return Array.from(new Set(combined));
        });
      } catch {
        // storage exception
      }
    }
  }, [user, toastSuccess]);

  const isSaved = useCallback((id) => savedPropertyIds.includes(id), [savedPropertyIds]);

  // Guest save action (when user chooses "Save to guest session only" in prompt modal)
  const saveGuestProperty = useCallback((property) => {
    const id = typeof property === 'string' ? property : property.id;
    const title = typeof property === 'string' ? 'Property' : property.title;

    setSavedPropertyIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    toastSuccess('Saved to guest collection', `${title} was shortlisted for this browsing session.`);
  }, [toastSuccess]);

  const toggleSave = useCallback((property) => {
    const id = typeof property === 'string' ? property : property.id;
    const title = typeof property === 'string' ? 'Property' : property.title;

    if (savedPropertyIds.includes(id)) {
      setSavedPropertyIds((prev) => prev.filter((item) => item !== id));
      toastInfo('Removed from saved properties', `${title} was removed from your collection.`);
      return;
    }

    // PRD 5.7 Wishlist Flow: Check if authenticated
    if (!user) {
      setSavePromptProperty(typeof property === 'string' ? { id, title } : property);
      setSavePromptOpen(true);
      return;
    }

    // Authenticated user saves directly
    setSavedPropertyIds((prev) => [...prev, id]);
    toastSuccess('Saved to your collection', `${title} is now in your saved properties.`);
  }, [savedPropertyIds, user, toastInfo, toastSuccess]);

  const clearSaved = useCallback(() => {
    setSavedPropertyIds([]);
    toastInfo('Wishlist cleared', 'All properties were removed from your saved collection.');
  }, [toastInfo]);

  // 2. Compare Properties (Max 4) with Guest / Auth Merge Support (PRD 5.6)
  const [comparePropertyIds, setComparePropertyIds] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_compare_properties');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  // Modal state when maximum 4 limit is reached & user wants to replace one
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [pendingReplaceProperty, setPendingReplaceProperty] = useState(null);

  // Sync with localStorage for guest session
  useEffect(() => {
    try {
      localStorage.setItem('estateone_compare_properties', JSON.stringify(comparePropertyIds));
      if (user && user.id) {
        localStorage.setItem(`estateone_account_compare_${user.id}`, JSON.stringify(comparePropertyIds));
      }
    } catch {
      // storage unavailable
    }
  }, [comparePropertyIds, user]);

  // Authenticated behavior: Merge session comparison items with account items without duplicates (PRD 5.6)
  useEffect(() => {
    if (user && user.id) {
      try {
        const accountStored = localStorage.getItem(`estateone_account_compare_${user.id}`);
        const accountIds = accountStored ? JSON.parse(accountStored) : [];
        if (Array.isArray(accountIds) && accountIds.length > 0) {
          setComparePropertyIds((sessionIds) => {
            const merged = Array.from(new Set([...sessionIds, ...accountIds])).slice(0, 4);
            return merged;
          });
        }
      } catch {
        // storage exception
      }
    }
  }, [user]);

  const isCompared = useCallback((id) => comparePropertyIds.includes(id), [comparePropertyIds]);

  const addCompare = useCallback((property) => {
    const id = typeof property === 'string' ? property : property.id;
    const title = typeof property === 'string' ? 'Property' : property.title;

    if (comparePropertyIds.includes(id)) {
      toastInfo('Already in comparison', `${title} is already shortlisted in your comparison set.`);
      return false;
    }

    if (comparePropertyIds.length >= 4) {
      setPendingReplaceProperty(property);
      setLimitModalOpen(true);
      toastError('Maximum limit reached', 'You can compare up to 4 properties at a time. Select one to replace.');
      return false;
    }

    setComparePropertyIds((prev) => [...prev, id]);
    toastSuccess('Added to comparison', `${title} was added to your comparison set.`);
    return true;
  }, [comparePropertyIds, toastInfo, toastSuccess, toastError]);

  const removeCompare = useCallback((id) => {
    setComparePropertyIds((prev) => prev.filter((item) => item !== id));
    toastInfo('Removed from comparison', 'The listing was removed from your comparison set.');
  }, [toastInfo]);

  const replaceCompare = useCallback((oldId, newProperty) => {
    const newId = typeof newProperty === 'string' ? newProperty : newProperty.id;
    const newTitle = typeof newProperty === 'string' ? 'Property' : newProperty.title;

    setComparePropertyIds((prev) => {
      if (prev.includes(newId)) {
        toastInfo('Already in comparison', `${newTitle} is already in your comparison set.`);
        return prev;
      }
      const updated = prev.map((item) => (item === oldId ? newId : item));
      toastSuccess('Comparison updated', `${newTitle} replaced the previous property.`);
      return updated;
    });
    setLimitModalOpen(false);
    setPendingReplaceProperty(null);
  }, [toastInfo, toastSuccess]);

  const toggleCompare = useCallback((property) => {
    const id = typeof property === 'string' ? property : property.id;
    if (comparePropertyIds.includes(id)) {
      removeCompare(id);
    } else {
      addCompare(property);
    }
  }, [comparePropertyIds, removeCompare, addCompare]);

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
        saveGuestProperty,
        clearSaved,
        savePromptOpen,
        setSavePromptOpen,
        savePromptProperty,
        setSavePromptProperty,
        comparePropertyIds,
        isCompared,
        addCompare,
        toggleCompare,
        removeCompare,
        replaceCompare,
        clearCompare,
        limitModalOpen,
        setLimitModalOpen,
        pendingReplaceProperty,
        setPendingReplaceProperty,
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
