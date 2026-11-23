import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Scales, 
  X, 
  CalendarCheck, 
  ChatCircleText, 
  ShieldCheck, 
  Trash, 
  Check, 
  Plus, 
  ArrowClockwise, 
  ShareNetwork, 
  ArrowRight,
  Eye,
  SlidersHorizontal,
  MapPin,
  Building,
  HouseLine
} from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { useProperty } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import EmptyState from '../components/shared/EmptyState';
import AddComparePropertyModal from '../components/shared/AddComparePropertyModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toastSuccess, toastInfo } = useToast();
  const { 
    comparePropertyIds, 
    addCompare,
    removeCompare, 
    replaceCompare, 
    clearCompare, 
    openConfirm, 
    openSiteVisit, 
    openEnquiry 
  } = useProperty();

  // Highlight differences toggle
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Modal for adding or replacing properties
  const [modalOpen, setModalOpen] = useState(false);
  const [targetReplaceId, setTargetReplaceId] = useState(null); // null if adding into empty slot

  // Sync with URL search params (?ids=prop-1,prop-2)
  useEffect(() => {
    const urlIds = searchParams.get('ids');
    if (urlIds) {
      const parsed = urlIds.split(',').filter(Boolean);
      parsed.forEach((id) => {
        if (!comparePropertyIds.includes(id) && comparePropertyIds.length < 4) {
          addCompare(id);
        }
      });
    }
  }, [searchParams]);

  // Update URL whenever comparePropertyIds change
  useEffect(() => {
    if (comparePropertyIds.length > 0) {
      setSearchParams({ ids: comparePropertyIds.join(',') }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [comparePropertyIds, setSearchParams]);

  const comparedProperties = useMemo(() => {
    return comparePropertyIds
      .map((id) => SAMPLE_PROPERTIES.find((p) => p.id === id))
      .filter(Boolean);
  }, [comparePropertyIds]);

  // Aggregate all unique amenities across the compared properties
  const allAmenities = useMemo(() => {
    const set = new Set();
    comparedProperties.forEach((p) => {
      (p.amenities || []).forEach((a) => set.add(a));
    });
    return Array.from(set).sort();
  }, [comparedProperties]);

  // Determine if a row has differences
  const hasDifference = (getter) => {
    if (comparedProperties.length <= 1) return false;
    const firstVal = getter(comparedProperties[0]);
    return comparedProperties.some((p) => getter(p) !== firstVal);
  };

  const handleClear = () => {
    openConfirm({
      title: 'Clear comparison table?',
      message: 'This will remove all shortlisted properties from the side by side comparison table.',
      confirmText: 'Clear comparison',
      isDestructive: true,
      onConfirm: clearCompare
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Compare properties on EstateOne',
        text: `Review ${comparedProperties.map((p) => p.title).join(' vs ')} side by side on EstateOne.`,
        url: shareUrl
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toastSuccess('Comparison link copied', 'The shareable comparison link was copied to your clipboard.');
    }
  };

  const handleOpenAddModal = () => {
    setTargetReplaceId(null);
    setModalOpen(true);
  };

  const handleOpenReplaceModal = (oldId) => {
    setTargetReplaceId(oldId);
    setModalOpen(true);
  };

  const handleSelectPropertyFromModal = (newProp) => {
    if (targetReplaceId) {
      replaceCompare(targetReplaceId, newProp);
    } else {
      addCompare(newProp);
    }
  };

  const totalSlots = 4;
  const emptySlotsCount = Math.max(0, totalSlots - comparedProperties.length);

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs items={[{ label: 'Compare properties' }]} className="mb-4" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
              <Scales size={16} weight="fill" />
              <span>Decision support</span>
            </span>
            <Badge variant="neutral" className="px-3 py-1 text-xs font-semibold text-slate-700">
              {comparedProperties.length} of {totalSlots} listings active
            </Badge>
          </div>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Compare verified properties.
          </h1>
          <p className="body-4 text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Side by side architectural specifications, transaction models, possession timelines, and verified owner pricing for up to 4 shortlisted listings.
          </p>
        </div>

        {/* Global Table Controls */}
        {comparedProperties.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
            {/* Highlight Differences Toggle */}
            <button
              type="button"
              onClick={() => setHighlightDifferences((prev) => !prev)}
              className={`min-h-10 button-sm px-3.5 py-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 ${ highlightDifferences ? 'bg-brand-navy text-white border-brand-navy shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs' }`}
              title="Highlight differing values across compared properties"
            >
              <SlidersHorizontal size={14} weight={highlightDifferences ? 'bold' : 'regular'} />
              <span>Highlight differences</span>
            </button>

            {/* Share Comparison */}
            <button
              type="button"
              onClick={handleShare}
              className="min-h-10 button-sm px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-brand-navy border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share comparison link"
            >
              <ShareNetwork size={16} />
              <span>Share</span>
            </button>

            {/* Clear All */}
            <button
              type="button"
              onClick={handleClear}
              className="min-h-10 button-sm py-2 px-3.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear all properties from comparison"
            >
              <Trash size={14} />
              <span>Clear table</span>
            </button>
          </div>
        )}
      </div>

      {/* Comparison Matrix Table */}
      {comparedProperties.length > 0 ? (
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-xs border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-4 w-44 sm:w-52 text-xs font-bold text-slate-400 uppercase tracking-wider align-top bg-white">
                    Property overview
                  </th>

                  {/* Compared Property Columns */}
                  {comparedProperties.map((p) => (
                    <th key={p.id} className="p-4 w-64 sm:w-72 align-top bg-white">
                      <div className="relative rounded-2xl overflow-hidden bg-slate-50/80 border border-slate-100 p-3.5 group hover:border-slate-300 transition-all flex flex-col justify-between h-full">
                        
                        {/* Top Action Pills: Remove & Replace */}
                        <div className="flex items-center justify-between gap-1.5 mb-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReplaceModal(p.id)}
                            className="px-2.5 py-1 rounded-full bg-white hover:bg-brand-navy hover:text-white text-slate-600 text-small font-semibold border border-slate-200 shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Replace this property with another"
                          >
                            <ArrowClockwise size={12} weight="bold" />
                            <span>Replace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => removeCompare(p.id)}
                            aria-label={`Remove ${p.title} from comparison`}
                            className="w-7 h-7 rounded-full bg-white hover:bg-rose-500 hover:text-white text-slate-500 border border-slate-200 shadow-xs flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X size={12} weight="bold" />
                          </button>
                        </div>

                        {/* Property Image & Status Badges */}
                        <div className="relative rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-slate-100">
                          <img
                            src={p.images?.[0]}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1 flex-wrap pointer-events-none">
                            {p.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-caption font-semibold shadow-xs">
                                <ShieldCheck size={12} weight="fill" />
                                <span>Verified</span>
                              </span>
                            )}
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-brand-navy/90 text-brand-gold text-label font-bold shadow-xs">
                              {p.intent === 'rent' ? 'Rent' : p.transactionType || 'Sale'}
                            </span>
                          </div>
                        </div>

                        {/* Title & Location */}
                        <div className="mb-3">
                          <h3 className="heading-4 text-brand-navy font-bold line-clamp-1 mb-1">
                            <Link 
                              to={`/property/${p.slug}`} 
                              className="hover:text-brand-blue transition-colors"
                              title={p.title}
                            >
                              {p.title}
                            </Link>
                          </h3>
                          <p className="caption-2 text-slate-500 line-clamp-1 flex items-center gap-1">
                            <MapPin size={14} className="text-brand-gold shrink-0" />
                            <span>{p.location}</span>
                          </p>
                        </div>

                        {/* Action Buttons: View Details, Visit, Enquire */}
                        <div className="space-y-1.5 mt-auto pt-2 border-t border-slate-200/60">
                          <Link 
                            to={`/property/${p.slug}`}
                            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye size={14} />
                            <span>View details</span>
                          </Link>
                          
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => openSiteVisit(p)}
                              className="py-1.5 px-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-small font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <CalendarCheck size={14} weight="bold" />
                              <span>Visit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEnquiry(p)}
                              className="py-1.5 px-2.5 rounded-xl bg-brand-gold hover:bg-[#b0915d] text-brand-navy text-small font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <ChatCircleText size={14} weight="bold" />
                              <span>Enquire</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </th>
                  ))}

                  {/* Empty Slot Columns (if < 4 properties) */}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <th key={`empty-col-${idx}`} className="p-4 w-64 sm:w-72 align-top bg-white">
                      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center h-[340px] hover:border-brand-blue hover:bg-blue-50/20 transition-all">
                        <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-blue mb-3">
                          <Plus size={20} weight="bold" />
                        </div>
                        <h4 className="title-3 font-bold text-brand-navy mb-1">
                          Add listing {comparedProperties.length + idx + 1}
                        </h4>
                        <p className="caption-2 text-slate-500 mb-5 max-w-[180px]">
                          Evaluate another residence or commercial space side by side.
                        </p>
                        <Button size="sm" type="button" variant="outline" onClick={handleOpenAddModal} className="min-h-10 px-4 py-2 h-auto rounded-xl border-slate-300 hover:bg-brand-navy hover:text-white transition-colors cursor-pointer flex items-center gap-1.5" >
                          <Plus size={14} weight="bold" />
                          <span>Add property</span>
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                
                {/* ----------------------------------------------------------------- */}
                {/* SECTION 1: FINANCIALS & PRICING */}
                {/* ----------------------------------------------------------------- */}
                <tr className="bg-slate-50/80">
                  <td colSpan={totalSlots + 1} className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-small">
                    Financial breakdown and transaction model
                  </td>
                </tr>

                {/* Price */}
                <tr className={highlightDifferences && hasDifference((p) => p.priceDisplay) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Listed price
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4">
                      <span className="heading-3 text-brand-navy font-bold block">
                        {p.intent === 'rent' ? (p.monthlyRentDisplay || p.priceDisplay) : p.priceDisplay}
                      </span>
                      {p.intent === 'rent' && (
                        <span className="caption-4 text-slate-500 font-medium">Monthly rent</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-price-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Security Deposit (for Rentals) */}
                <tr className={highlightDifferences && hasDifference((p) => p.depositDisplay || 'None') ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Security deposit
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.depositDisplay ? (
                        <span className="font-semibold text-brand-navy">{p.depositDisplay}</span>
                      ) : (
                        <span className="text-slate-400">Not applicable (Direct sale)</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-deposit-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Rate per Sq Ft */}
                <tr className={highlightDifferences && hasDifference((p) => p.pricePerSqFt) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Rate per sq ft
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700 font-medium">
                      {p.pricePerSqFt || 'Market pricing'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-ratesqft-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Transaction Type */}
                <tr className={highlightDifferences && hasDifference((p) => p.intent) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Transaction type
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-brand-navy capitalize">
                        {p.intent === 'rent' ? 'Rental tenancy' : p.transactionType || 'Direct sale'}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-transtype-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* ----------------------------------------------------------------- */}
                {/* SECTION 2: ARCHITECTURAL SPECIFICATIONS */}
                {/* ----------------------------------------------------------------- */}
                <tr className="bg-slate-50/80">
                  <td colSpan={totalSlots + 1} className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-small">
                    Space and architectural specifications
                  </td>
                </tr>

                {/* Property Type */}
                <tr className={highlightDifferences && hasDifference((p) => p.type) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Property category
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 font-semibold text-brand-navy">
                      {p.type}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-proptype-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Bedrooms & Bathrooms */}
                <tr className={highlightDifferences && hasDifference((p) => `${p.bedrooms}-${p.bathrooms}`) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Bedrooms and baths
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.bedrooms ? (
                        <span className="font-semibold text-brand-navy">
                          {p.bedrooms} • {p.bathrooms || 'Standard baths'}
                        </span>
                      ) : (
                        <span className="text-slate-500">Commercial floor layout</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-bhk-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Carpet Area */}
                <tr className={highlightDifferences && hasDifference((p) => p.carpetArea || p.area) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Carpet area
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-brand-navy font-semibold">
                      {p.carpetArea || p.area}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-carpet-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Super Built-up Area */}
                <tr className={highlightDifferences && hasDifference((p) => p.superBuiltUpArea || p.area) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Super built up area
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.superBuiltUpArea || p.area}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-builtup-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Furnishing Status */}
                <tr className={highlightDifferences && hasDifference((p) => p.furnishing) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Furnishing status
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.furnishing || 'Unfurnished'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-furnish-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Floor Level & Total Floors */}
                <tr className={highlightDifferences && hasDifference((p) => p.floorLevel) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Floor position
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.floorLevel || 'Ground level'} {p.totalFloors ? `(${p.totalFloors})` : ''}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-floor-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Facing Direction */}
                <tr className={highlightDifferences && hasDifference((p) => p.facingDirection) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Facing direction
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.facingDirection || 'East facing'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-facing-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Parking Capacity */}
                <tr className={highlightDifferences && hasDifference((p) => p.parking) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Parking allocation
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.parking || '2 covered parking spots'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-parking-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* ----------------------------------------------------------------- */}
                {/* SECTION 3: LOCATION & CONNECTIVITY */}
                {/* ----------------------------------------------------------------- */}
                <tr className="bg-slate-50/80">
                  <td colSpan={totalSlots + 1} className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-small">
                    Location and regional connectivity
                  </td>
                </tr>

                {/* City & Locality */}
                <tr className={highlightDifferences && hasDifference((p) => p.city) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    City and locality
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      <p className="font-semibold text-brand-navy">{p.city}</p>
                      <p className="caption-3 text-slate-500 mt-0.5">{p.location}</p>
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-city-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Transit Distance */}
                <tr className={highlightDifferences && hasDifference((p) => p.distance) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Corridor connectivity
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      {p.distance || 'Minutes from arterial expressway'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-distance-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* ----------------------------------------------------------------- */}
                {/* SECTION 4: AVAILABILITY & VERIFICATION */}
                {/* ----------------------------------------------------------------- */}
                <tr className="bg-slate-50/80">
                  <td colSpan={totalSlots + 1} className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-small">
                    Availability status and legal verification
                  </td>
                </tr>

                {/* Possession / Availability Status */}
                <tr className={highlightDifferences && hasDifference((p) => p.status) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Possession timeline
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4">
                      {p.availabilityStatus === 'leased' ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                          Leased out
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-brand-navy">
                          {p.status}
                        </span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-status-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Available From Date */}
                <tr className={highlightDifferences && hasDifference((p) => p.availableFrom) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    Available from
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700 capitalize">
                      {p.availableFrom ? p.availableFrom.replace(/-/g, ' ') : 'Immediate possession'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-availfrom-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* RERA Number */}
                <tr className={highlightDifferences && hasDifference((p) => p.reraId) ? 'bg-amber-50/40' : ''}>
                  <td className="p-4 font-bold text-slate-600">
                    RERA registration
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 font-mono text-small font-semibold text-emerald-800">
                      {p.reraId ? `RERA: ${p.reraId}` : 'Document verified'}
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-rera-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* ----------------------------------------------------------------- */}
                {/* SECTION 5: AMENITIES MATRIX */}
                {/* ----------------------------------------------------------------- */}
                <tr className="bg-slate-50/80">
                  <td colSpan={totalSlots + 1} className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-small">
                    Lifestyle and infrastructure amenities matrix
                  </td>
                </tr>

                {allAmenities.map((amenity) => {
                  const hasDifferingAmenity = hasDifference((p) => (p.amenities || []).includes(amenity));
                  return (
                    <tr 
                      key={amenity}
                      className={highlightDifferences && hasDifferingAmenity ? 'bg-amber-50/40' : ''}
                    >
                      <td className="p-4 font-medium text-slate-600">
                        {amenity}
                      </td>
                      {comparedProperties.map((p) => {
                        const includesAmenity = (p.amenities || []).includes(amenity);
                        return (
                          <td key={p.id} className="p-4">
                            {includesAmenity ? (
                              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                                <Check size={16} weight="bold" className="text-emerald-600 shrink-0" />
                                <span>Included</span>
                              </span>
                            ) : (
                              <span className="text-slate-300 text-base font-light">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                        <td key={`empty-amenity-${amenity}-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                      ))}
                    </tr>
                  );
                })}

                {/* ----------------------------------------------------------------- */}
                {/* SECTION 6: AGENT & CONTACT ADVISORY */}
                {/* ----------------------------------------------------------------- */}
                <tr className="bg-slate-50/80">
                  <td colSpan={totalSlots + 1} className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-small">
                    Verified agent and owner contact
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600">
                    Assigned advisor
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">
                      <p className="font-semibold text-brand-navy">{p.agent?.name || 'Verified Advisor'}</p>
                      <p className="caption-3 text-slate-400 mt-0.5">{p.agent?.role || 'Senior Property Consultant'}</p>
                      <p className="caption-3 text-slate-500 mt-1">{p.agent?.phone || '+91 22 6120 4400'}</p>
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-agent-${idx}`} className="p-4 text-slate-300 text-center">—</td>
                  ))}
                </tr>

                {/* Bottom CTA Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-600">
                    Next actions
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => openSiteVisit(p)}
                          className="min-h-10 button-sm w-full py-2 px-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <CalendarCheck size={14} weight="bold" />
                          <span>Schedule visit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEnquiry(p)}
                          className="min-h-10 button-sm w-full py-2 px-3 rounded-xl bg-brand-gold hover:bg-[#b0915d] text-brand-navy flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <ChatCircleText size={14} weight="bold" />
                          <span>Send enquiry</span>
                        </button>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <td key={`empty-actions-${idx}`} className="p-4 text-center">
                      <Button size="sm" type="button" variant="outline" onClick={handleOpenAddModal} className="min-h-10 px-3 py-2 rounded-xl border-slate-300 cursor-pointer" >
                        Add to slot
                      </Button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State when zero properties are selected */
        <div className="space-y-12">
          <EmptyState
            icon={Scales}
            title="No properties selected for comparison"
            description="Shortlist up to 4 homes or commercial properties to evaluate architectural specifications, carpet areas, and owner pricing side by side."
            actionLabel="Browse properties for sale"
            onAction={() => {
              window.location.href = '/buy';
            }}
          />

          {/* Quick Starter Recommendations to compare with 1 click */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-0 shadow-xs text-left">
            <h3 className="heading-4 text-brand-navy font-bold mb-2">
              Start comparing with popular verified residences
            </h3>
            <p className="body-4 text-slate-500 mb-6 max-w-xl">
              Tap any pair to immediately populate the comparison table with prime residential listings.
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
                  <Button size="sm"
                    type="button"
                    onClick={() => addCompare(prop)}
                    className="shrink-0 px-3 py-1.5 h-auto rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white cursor-pointer transition-colors"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Replace Property Modal */}
      <AddComparePropertyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectProperty={handleSelectPropertyFromModal}
        targetSlotId={targetReplaceId}
        existingCompareIds={comparePropertyIds}
      />
    </div>
  );
}
