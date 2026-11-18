import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Scales, 
  ShieldCheck, 
  Bed, 
  Bathtub, 
  ArrowsOut, 
  MapPin, 
  CalendarCheck,
  ChatCircleText,
  ImageBroken,
  Buildings,
  Car
} from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';

export default function PropertyCard({ property, layout = 'grid', className = '' }) {
  const { 
    isSaved, 
    toggleSave, 
    isCompared, 
    toggleCompare, 
    openEnquiry, 
    openSiteVisit 
  } = useProperty();

  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  const saved = isSaved(property.id);
  const compared = isCompared(property.id);

  const images = property.images && property.images.length > 0 ? property.images : [];
  const hasImages = images.length > 0 && !imageError;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  // Clear distinction between sale price, monthly rent, and deposit (PRD 4.2.13 & 5.4)
  const isRental = property.intent === 'rent';
  const isCommercial = property.intent === 'commercial' || property.type === 'Commercial' || property.category === 'commercial';

  return (
    <article 
      className={`group relative flex ${
        layout === 'list' ? 'flex-col md:flex-row' : 'flex-col'
      } bg-white rounded-3xl overflow-hidden border-0 shadow-xs hover:shadow-lg transition-all duration-300 text-left ${className}`}
    >
      {/* Media Container with Fallback Placeholder */}
      <div 
        className={`relative ${
          layout === 'list' ? 'aspect-[16/10] md:aspect-auto md:w-80 shrink-0 min-h-[220px]' : 'aspect-[16/10] w-full'
        } overflow-hidden bg-slate-100`}
      >
        {hasImages ? (
          <img
            src={currentImage}
            alt={property.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ImageBroken size={36} weight="duotone" className="mb-2 text-slate-300" />
            <span className="caption-2 font-medium">Verified listing photograph updating</span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* PRD 4.2.12: Avoid showing verification badge unless formally verified */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {property.availabilityStatus === 'leased' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-700/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-xs pointer-events-auto">
                <span>Leased out</span>
              </span>
            ) : (
              property.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-xs pointer-events-auto">
                  <ShieldCheck size={13} weight="fill" />
                  <span>Verified</span>
                </span>
              )
            )}
            {isCommercial && property.transactionType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-navy/90 backdrop-blur-md text-brand-gold text-[10px] font-bold uppercase tracking-wider shadow-xs pointer-events-auto">
                {property.transactionType}
              </span>
            )}
            {isCommercial && property.commercialCategory && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium pointer-events-auto">
                {property.commercialCategory}
              </span>
            )}
            {property.status && property.availabilityStatus !== 'leased' && !isCommercial && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium pointer-events-auto">
                {property.status}
              </span>
            )}
            {isRental && property.furnishing && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-brand-navy text-[10px] font-semibold shadow-xs pointer-events-auto">
                {property.furnishing}
              </span>
            )}
          </div>

          {/* Quick Action Controls: Save & Compare (PRD 4.2.4) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(property);
              }}
              aria-label={compared ? 'Remove from comparison' : 'Add to comparison'}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                compared 
                  ? 'bg-brand-navy text-brand-gold shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 hover:text-brand-navy shadow-xs'
              }`}
            >
              <Scales size={15} weight={compared ? 'fill' : 'bold'} />
            </button>

            {/* Save / Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(property);
              }}
              aria-label={saved ? 'Remove from saved' : 'Save property'}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                saved 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-xs'
              }`}
            >
              <Heart size={15} weight={saved ? 'fill' : 'bold'} />
            </button>
          </div>
        </div>

        {/* Thumbnail Dots Indicator if multiple images exist */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full pointer-events-none">
            {images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Pricing Area per PRD 4.2.13 & 5.4 */}
        <div className="flex items-baseline justify-between mb-1.5">
          <div>
            {isCommercial && property.priceLabel && (
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {property.priceLabel}
              </span>
            )}
            <span className="heading-3 text-brand-navy font-bold tracking-tight">
              {isRental ? (property.monthlyRentDisplay || property.priceDisplay) : property.priceDisplay}
            </span>
            {isRental && !property.monthlyRentDisplay && (
              <span className="caption-2 text-slate-500 ml-1">/ month</span>
            )}
          </div>

          {property.pricePerSqFt && (
            <span className="caption-2 text-slate-500">
              {property.pricePerSqFt}
            </span>
          )}
        </div>

        {/* Rental / Commercial extra fee disclosures per PRD 4.2.13 */}
        {isRental && (property.depositDisplay || property.deposit) && (
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Security deposit:</span>
            <span className="font-semibold text-brand-navy">{property.depositDisplay || property.deposit}</span>
          </div>
        )}
        {isCommercial && property.maintenance && (
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Maintenance charges:</span>
            <span className="font-semibold text-brand-navy">{property.maintenance}</span>
          </div>
        )}

        {/* Commercial Specifications pill per PRD 5.4 */}
        {isCommercial && (property.buildingType || property.floorNumber) && (
          <div className="text-[11px] text-slate-600 mb-2 bg-slate-50 p-2 rounded-xl flex items-center justify-between">
            <span className="font-medium">{property.buildingType || 'Commercial asset'}</span>
            {property.floorNumber && (
              <span className="text-[10px] text-slate-500 font-semibold">{property.floorNumber}</span>
            )}
          </div>
        )}

        {/* Rental availability and preferred tenant details per PRD 5.3 */}
        {isRental && (
          <div className="text-[11px] text-slate-500 space-y-1 mb-2 bg-slate-50 p-2 rounded-xl">
            {(property.availabilityDate || property.status) && (
              <div className="flex items-center justify-between">
                <span>Availability:</span>
                <span className={`font-semibold ${property.availabilityStatus === 'leased' ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {property.availabilityDate || property.status}
                </span>
              </div>
            )}
            {property.lastUpdatedDate && (
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Verification check:</span>
                <span>{property.lastUpdatedDate}</span>
              </div>
            )}
            {property.preferredTenant && (
              <div className="flex items-center justify-between">
                <span>Preferred tenant:</span>
                <span className="font-medium text-brand-navy truncate max-w-[170px]">{property.preferredTenant}</span>
              </div>
            )}
          </div>
        )}

        {/* Leased Notice per PRD 5.3 */}
        {property.availabilityStatus === 'leased' && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-xs">
            <span className="font-semibold">Notice:</span> This property was leased out and is not accepting visits.
          </div>
        )}

        {/* Title linked to route (PRD 4.2.3) */}
        <h3 className="heading-4 text-brand-navy font-semibold hover:text-brand-blue transition-colors line-clamp-1 mb-1">
          <Link to={`/property/${property.slug}`}>
            {property.title}
          </Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 caption-1 mb-4">
          <MapPin size={14} className="text-brand-gold shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Core Specs Grid - Never show residential-only bedrooms/bathrooms for commercial per PRD 5.4 */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 text-slate-600 caption-2 mb-4">
          {isCommercial ? (
            <>
              {property.area && (
                <div className="flex items-center gap-1.5 truncate" title={`Super built up area: ${property.area}`}>
                  <ArrowsOut size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{property.area}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 truncate" title={`Fitout: ${property.furnishing || 'Bare shell'}`}>
                <Buildings size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{property.furnishing || 'Bare shell'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate" title={property.parkingCount || property.parking || 'Parking available'}>
                <Car size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{property.parkingCount ? property.parkingCount.split(' ')[0] + ' Parking' : 'Parking'}</span>
              </div>
            </>
          ) : (
            <>
              {property.bedrooms && (
                <div className="flex items-center gap-1.5 truncate">
                  <Bed size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1.5 truncate">
                  <Bathtub size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowsOut size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{property.area}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTAs (PRD 4.2.10: avoid inert buttons) */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <Link
            to={`/property/${property.slug}`}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy caption-1 font-semibold text-center transition-colors"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={() => openSiteVisit(property)}
            aria-label="Schedule property inspection visit"
            className="p-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white transition-colors cursor-pointer"
            title="Schedule visit"
          >
            <CalendarCheck size={18} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => openEnquiry(property)}
            aria-label="Send property enquiry"
            className="p-2 rounded-xl bg-[#C5A46D] hover:bg-[#b0915d] text-brand-navy transition-colors cursor-pointer"
            title="Direct enquiry"
          >
            <ChatCircleText size={18} weight="bold" />
          </button>
        </div>

      </div>
    </article>
  );
}
