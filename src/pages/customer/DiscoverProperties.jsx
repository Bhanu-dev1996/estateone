import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlass, 
  Funnel, 
  X, 
  Heart, 
  Scales, 
  ChatCircleText, 
  CalendarPlus, 
  ShareNetwork, 
  Flag, 
  MapPin, 
  ShieldCheck, 
  GridFour, 
  Rows, 
  BellRinging,
  Sparkle,
  ArrowRight,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { SAMPLE_PROPERTIES, CITIES } from '../../data/properties';
import { useProperty } from '../../context/PropertyContext';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { useToast } from '../../context/ToastContext';
import ReportListingModal from '../../components/dashboard/ReportListingModal';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';
import PropertyCard from '../../components/shared/PropertyCard';
import { getPropertyResultsLayoutClass } from '../../lib/listingResultsLayout';

export default function DiscoverProperties() {
  const location = useLocation();
  const prefill = location.state?.prefillQuery || '';
  const { toastSuccess, toastInfo } = useToast();

  const { 
    savedPropertyIds, 
    toggleSave, 
    isSaved, 
    comparePropertyIds, 
    toggleCompare, 
    isCompared 
  } = useProperty();

  const { createAlert, addSearchHistory, scheduleVisit, createEnquiry } = useCustomerDashboard();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(prefill);
  const [intent, setIntent] = useState('buy'); // buy or rent
  const [category, setCategory] = useState('residential'); // residential or commercial
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedType, setSelectedType] = useState('All types');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any');
  const [selectedFurnishing, setSelectedFurnishing] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Quick Action Modals
  const [reportModalProperty, setReportModalProperty] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertName, setAlertName] = useState('');
  const [alertFrequency, setAlertFrequency] = useState('Daily');

  // Quick Schedule Modal inside Discover
  const [scheduleModalProp, setScheduleModalProp] = useState(null);
  const [visitDate, setVisitDate] = useState('2026-11-25');
  const [visitSlot, setVisitSlot] = useState('11:30 AM');
  const [visitType, setVisitType] = useState('In person');
  const [visitNote, setVisitNote] = useState('');

  // Quick Enquiry Modal inside Discover
  const [enquiryModalProp, setEnquiryModalProp] = useState(null);
  const [enquiryMessage, setEnquiryMessage] = useState('');

  // Filtered properties computation
  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => {
      // Intent match
      if (p.intent && p.intent !== intent) return false;

      // City match
      if (selectedCity !== 'All cities' && p.city !== selectedCity) return false;

      // Type match
      if (selectedType !== 'All types' && p.type !== selectedType) return false;

      // Bedrooms match
      if (selectedBedrooms !== 'Any') {
        if (!p.bedrooms || !p.bedrooms.toLowerCase().includes(selectedBedrooms.toLowerCase())) {
          return false;
        }
      }

      // Furnishing match
      if (selectedFurnishing !== 'All') {
        if (!p.furnishing || p.furnishing.toLowerCase() !== selectedFurnishing.toLowerCase()) {
          return false;
        }
      }

      // Verified toggle
      if (verifiedOnly && !p.verified) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesType = p.type.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCity && !matchesType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return (a.priceValue || 0) - (b.priceValue || 0);
      if (sortBy === 'priceHigh') return (b.priceValue || 0) - (a.priceValue || 0);
      if (sortBy === 'newest') return (a.postedDaysAgo || 0) - (b.postedDaysAgo || 0);
      return 0; // recommended
    });
  }, [intent, selectedCity, selectedType, selectedBedrooms, selectedFurnishing, verifiedOnly, searchQuery, sortBy]);

  const activeFiltersCount = 
    (selectedCity !== 'All cities' ? 1 : 0) +
    (selectedType !== 'All types' ? 1 : 0) +
    (selectedBedrooms !== 'Any' ? 1 : 0) +
    (selectedFurnishing !== 'All' ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleClearFilters = () => {
    setSelectedCity('All cities');
    setSelectedType('All types');
    setSelectedBedrooms('Any');
    setSelectedFurnishing('All');
    setVerifiedOnly(false);
    setSearchQuery('');
    toastInfo('Filters cleared', 'All filters reset to defaults.');
  };

  const handleShare = (property) => {
    const url = `${window.location.origin}/property/${property.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toastSuccess('Link copied to clipboard', `Share link for ${property.title} copied.`);
    } else {
      toastInfo('Property share link', url);
    }
  };

  const handleSaveSearchAsAlert = (e) => {
    e.preventDefault();
    createAlert({
      name: alertName || `${selectedCity !== 'All cities' ? selectedCity : 'National'} ${selectedType} Search`,
      intent,
      location: selectedCity,
      propertyType: selectedType,
      bedrooms: selectedBedrooms,
      frequency: alertFrequency,
      channels: ['Email', 'In app']
    });
    setAlertModalOpen(false);
    setAlertName('');
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleModalProp) return;
    scheduleVisit({
      propertyId: scheduleModalProp.id,
      propertyTitle: scheduleModalProp.title,
      propertyLocation: scheduleModalProp.location,
      propertyImage: scheduleModalProp.images[0],
      agentName: scheduleModalProp.agent?.name || 'Vikramaditya Singhania',
      agentPhone: scheduleModalProp.agent?.phone || '+91 98201 44820',
      visitDate,
      timeSlot: visitSlot,
      visitType,
      customerNote: visitNote
    });
    setScheduleModalProp(null);
    setVisitNote('');
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryModalProp) return;
    createEnquiry({
      propertyId: enquiryModalProp.id,
      propertyTitle: enquiryModalProp.title,
      propertyLocation: enquiryModalProp.location,
      propertyPrice: enquiryModalProp.priceDisplay,
      propertyImage: enquiryModalProp.images[0],
      agentName: enquiryModalProp.agent?.name || 'Vikramaditya Singhania',
      agency: 'EstateOne Premier Advisory',
      message: enquiryMessage || 'I am interested in this verified residence.'
    });
    setEnquiryModalProp(null);
    setEnquiryMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER & INTENT SELECTOR (PRD Section 6.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Discover verified properties"
        description="Search, filter, compare, and schedule visits across India verified residential and commercial assets."
        action={
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setIntent('buy')}
            className={`px-4 py-2 rounded-xl min-h-9 button-sm font-semibold text-small transition-all cursor-pointer ${
              intent === 'buy'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            Buy properties
          </button>
          <button
            type="button"
            onClick={() => setIntent('rent')}
            className={`px-4 py-2 rounded-xl min-h-9 button-sm font-semibold text-small transition-all cursor-pointer ${
              intent === 'rent'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            Rent properties
          </button>
        </div>
        }
      />

      {/* =========================================================================
          2. SEARCH & FACETED FILTERS BAR (PRD Section 6.1 & 6.4)
         ========================================================================= */}
      <Card className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        
        {/* Main Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <MagnifyingGlass size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, locality, project name, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-small text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue"
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

          <Button size="sm"
            type="button"
            variant="outline"
            onClick={() => setAlertModalOpen(true)}
            className="rounded-2xl min-h-10 px-4 font-semibold border-slate-200 text-brand-blue hover:bg-blue-50 cursor-pointer flex items-center gap-1.5 shrink-0 py-2.5"
          >
            <BellRinging size={16} />
            <span>Save search as alert</span>
          </Button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          
          {/* City */}
          <div>
            <label className="caption-2 font-bold text-slate-500 block mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-small py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-brand-navy focus:outline-none focus:border-brand-blue"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="caption-2 font-bold text-slate-500 block mb-1">Property type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-small py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-brand-navy focus:outline-none focus:border-brand-blue"
            >
              <option value="All types">All types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Office">Commercial office</option>
              <option value="Retail">Commercial retail</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="caption-2 font-bold text-slate-500 block mb-1">Bedrooms</label>
            <select
              value={selectedBedrooms}
              onChange={(e) => setSelectedBedrooms(e.target.value)}
              className="w-full text-small py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-brand-navy focus:outline-none focus:border-brand-blue"
            >
              <option value="Any">Any bedrooms</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4+ BHK</option>
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label className="caption-2 font-bold text-slate-500 block mb-1">Furnishing</label>
            <select
              value={selectedFurnishing}
              onChange={(e) => setSelectedFurnishing(e.target.value)}
              className="w-full text-small py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-brand-navy focus:outline-none focus:border-brand-blue"
            >
              <option value="All">All furnishing</option>
              <option value="Furnished">Fully furnished</option>
              <option value="Semi-Furnished">Semi furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`w-full py-2 px-3 rounded-xl min-h-9 px-3 button-sm font-semibold text-small transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                verifiedOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck size={16} weight={verifiedOnly ? 'fill' : 'regular'} />
              <span>Verified only</span>
            </button>
          </div>

        </div>

        {/* Applied Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
            <span className="caption-2 font-bold text-slate-400 mr-1">Active filters:</span>
            {selectedCity !== 'All cities' && (
              <Badge variant="outline" className="bg-slate-50 text-xs py-0.5 gap-1">
                <span>City: {selectedCity}</span>
                <X size={12} className="cursor-pointer" onClick={() => setSelectedCity('All cities')} />
              </Badge>
            )}
            {selectedType !== 'All types' && (
              <Badge variant="outline" className="bg-slate-50 text-xs py-0.5 gap-1">
                <span>Type: {selectedType}</span>
                <X size={12} className="cursor-pointer" onClick={() => setSelectedType('All types')} />
              </Badge>
            )}
            {selectedBedrooms !== 'Any' && (
              <Badge variant="outline" className="bg-slate-50 text-xs py-0.5 gap-1">
                <span>Rooms: {selectedBedrooms}</span>
                <X size={12} className="cursor-pointer" onClick={() => setSelectedBedrooms('Any')} />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="bg-slate-50 text-xs py-0.5 gap-1">
                <span>Query: {searchQuery}</span>
                <X size={12} className="cursor-pointer" onClick={() => setSearchQuery('')} />
              </Badge>
            )}

            <button
              type="button"
              onClick={handleClearFilters}
              className="button-sm  text-rose-600 hover:underline ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

      </Card>

      {/* =========================================================================
          3. RESULTS BAR & CONTROLS (PRD Section 6.2)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-600">
          Showing <span className="text-brand-navy font-bold">{filteredProperties.length}</span> verified properties in portal
        </p>

        <div className="flex items-center gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white text-brand-navy font-semibold focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest listings</option>
              <option value="priceLow">Price low to high</option>
              <option value="priceHigh">Price high to low</option>
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              <GridFour size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              <Rows size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. PROPERTY CARDS (PRD Section 6.3)
         ========================================================================= */}
      {filteredProperties.length > 0 ? (
        <div className={getPropertyResultsLayoutClass(viewMode, 'three', '')}>
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              layout={viewMode === 'list' ? 'list' : 'grid'}
            />
          ))}
        </div>
      ) : (
        <Card className="p-10 rounded-3xl bg-white border border-slate-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <MagnifyingGlass size={24} />
          </div>
          <h3 className="text-h4 font-bold text-brand-navy">No matching verified properties found</h3>
          <p className="caption-2 text-slate-500 max-w-md mx-auto">
            Try adjusting your location, bedroom configurations, or removing active filters to view available inventory.
          </p>
          <Button size="sm"
            onClick={handleClearFilters}
            className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white cursor-pointer mt-2"
          >
            Clear all filters
          </Button>
        </Card>
      )}

      {/* =========================================================================
          5. SAVE SEARCH AS ALERT MODAL
         ========================================================================= */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <BellRinging size={20} className="text-brand-blue" />
                <h3 className="text-h4">Create search alert</h3>
              </div>
              <button onClick={() => setAlertModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="caption-2 text-slate-500">
              Receive notifications when new verified listings matching these search filters are published.
            </p>

            <form onSubmit={handleSaveSearchAsAlert} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Alert name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Mumbai Luxury 4 BHK"
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Notification frequency</label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                >
                  <option value="Instant">Instant (Real time)</option>
                  <option value="Daily">Daily summary</option>
                  <option value="Weekly">Weekly digest</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-small text-slate-600">
                <p className="font-semibold text-brand-navy mb-0.5">Applied alert filters:</p>
                <p>Intent: {intent} • City: {selectedCity} • Type: {selectedType} • Beds: {selectedBedrooms}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAlertModalOpen(false)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  Create alert
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* =========================================================================
          6. QUICK SCHEDULE VISIT MODAL
         ========================================================================= */}
      {scheduleModalProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <CalendarPlus size={20} className="text-emerald-600" />
                <h3 className="text-h4">Schedule site visit</h3>
              </div>
              <button onClick={() => setScheduleModalProp(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <img
                src={scheduleModalProp.images[0]}
                alt={scheduleModalProp.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-small font-bold text-brand-navy truncate">{scheduleModalProp.title}</p>
                <p className="caption-2 text-slate-500 truncate">{scheduleModalProp.location}</p>
              </div>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption-2 font-bold text-slate-700 block mb-1">Preferred date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-small p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="caption-2 font-bold text-slate-700 block mb-1">Time slot</label>
                  <select
                    value={visitSlot}
                    onChange={(e) => setVisitSlot(e.target.value)}
                    className="w-full text-small p-2 rounded-xl border border-slate-200"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Midday)</option>
                    <option value="03:00 PM">03:00 PM (Afternoon)</option>
                    <option value="05:00 PM">05:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Visit mode</label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full text-small p-2 rounded-xl border border-slate-200"
                >
                  <option value="In person">In person private walkthrough</option>
                  <option value="Virtual">Virtual live video tour</option>
                </select>
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Notes for advisor (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Visiting with family architect, need parking pass..."
                  value={visitNote}
                  onChange={(e) => setVisitNote(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setScheduleModalProp(null)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="rounded-xl min-h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Confirm request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* =========================================================================
          7. QUICK ENQUIRY MODAL
         ========================================================================= */}
      {enquiryModalProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <ChatCircleText size={20} className="text-brand-blue" />
                <h3 className="text-h4">Send enquiry</h3>
              </div>
              <button onClick={() => setEnquiryModalProp(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <img
                src={enquiryModalProp.images[0]}
                alt={enquiryModalProp.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-small font-bold text-brand-navy truncate">{enquiryModalProp.title}</p>
                <p className="caption-2 text-slate-500 truncate">{enquiryModalProp.location} • {enquiryModalProp.priceDisplay}</p>
              </div>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State your question regarding pricing, possession, or documentation..."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/50 text-small text-slate-600 flex items-start gap-1.5">
                <ShieldCheck size={16} className="text-brand-blue shrink-0 mt-0.5" weight="fill" />
                <span>Your verified contact details will be shared with the certified listing partner.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEnquiryModalProp(null)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  Submit enquiry
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Report Listing Modal */}
      {reportModalProperty && (
        <ReportListingModal
          isOpen={!!reportModalProperty}
          onClose={() => setReportModalProperty(null)}
          property={reportModalProperty}
        />
      )}

    </div>
  );
}
