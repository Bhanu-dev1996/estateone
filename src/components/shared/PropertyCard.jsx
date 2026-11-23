import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Car,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';
import { getRentalPriceDisplay } from '../../lib/rentalPrice';
import { getPropertyStatusBadgeClassOnMedia } from '../../lib/propertyStatusBadge';
import { MKT_ICON } from '../../lib/iconScale';

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
  const touchStartX = useRef(null);

  const images = property?.images?.length ? property.images : [];
  const slideCount = Math.min(images.length, 5);
  const safeIndex = slideCount > 0 ? Math.min(currentImageIndex, slideCount - 1) : 0;

  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
  }, [property?.id]);

  useEffect(() => {
    if (currentImageIndex >= slideCount && slideCount > 0) {
      setCurrentImageIndex(slideCount - 1);
    }
  }, [currentImageIndex, slideCount]);

  const goToSlide = useCallback(
    (index, e) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (slideCount < 2) return;
      setCurrentImageIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goPrev = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      const idx = slideCount > 0 ? Math.min(currentImageIndex, slideCount - 1) : 0;
      goToSlide(idx - 1, e);
    },
    [goToSlide, slideCount, currentImageIndex]
  );

  const goNext = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      const idx = slideCount > 0 ? Math.min(currentImageIndex, slideCount - 1) : 0;
      goToSlide(idx + 1, e);
    },
    [goToSlide, slideCount, currentImageIndex]
  );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null || slideCount < 2) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX == null) return;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 48) {
      if (delta < 0) goNext(e);
      else goPrev(e);
    }
    touchStartX.current = null;
  };

  if (!property) return null;

  const saved = isSaved(property.id);
  const compared = isCompared(property.id);
  const hasImages = images.length > 0 && !imageError;
  const currentImage = hasImages ? images[safeIndex] : null;

  // Clear distinction between sale price, monthly rent, and deposit (PRD 4.2.13 & 5.4)
  const isRental = property.intent === 'rent';
  const isCommercial = property.intent === 'commercial' || property.type === 'Commercial' || property.category === 'commercial';
  const rentalPrice = isRental ? getRentalPriceDisplay(property) : null;

  return (
    <article
      className={`property-card property-card--${layout} group relative overflow-hidden rounded-2xl bg-white shadow-xs ${className}`}
    >
      <div
        className="property-card__media"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasImages ? (
          <img
            src={currentImage}
            alt={`${property.title} — photo ${safeIndex + 1} of ${images.length}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ImageBroken size={36} weight="duotone" className="mb-2 text-slate-300" />
            <span className="text-caption">Verified listing photograph updating</span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* PRD 4.2.12: Avoid showing verification badge unless formally verified */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {property.availabilityStatus === 'leased' ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-700/90 backdrop-blur-md text-white text-caption font-semibold shadow-xs pointer-events-auto">
                <span>Leased out</span>
              </span>
            ) : (
              property.verified && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-caption font-semibold leading-tight shadow-xs pointer-events-auto">
                  <ShieldCheck size={11} weight="fill" className="shrink-0" />
                  <span>Verified</span>
                </span>
              )
            )}
            {isCommercial && property.transactionType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-navy/90 backdrop-blur-md text-brand-gold text-label font-bold shadow-xs pointer-events-auto">
                {property.transactionType}
              </span>
            )}
            {isCommercial && property.commercialCategory && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-caption font-medium pointer-events-auto">
                {property.commercialCategory}
              </span>
            )}
            {property.status && property.availabilityStatus !== 'leased' && !isCommercial && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full backdrop-blur-md text-caption font-semibold shadow-xs pointer-events-auto ${getPropertyStatusBadgeClassOnMedia(property.status)}`}
              >
                {property.status}
              </span>
            )}
            {isRental && property.furnishing && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-brand-navy text-caption font-semibold shadow-xs pointer-events-auto">
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
              <Scales size={16} weight={compared ? 'fill' : 'bold'} />
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
              <Heart size={16} weight={saved ? 'fill' : 'bold'} />
            </button>
          </div>
        </div>

        {slideCount > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-[2] -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white opacity-100 backdrop-blur-sm transition-opacity hover:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-[2] -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white opacity-100 backdrop-blur-sm transition-opacity hover:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <CaretRight size={16} weight="bold" />
            </button>
            <div
              className="absolute bottom-2.5 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm"
              role="tablist"
              aria-label="Property photos"
            >
              {images.slice(0, slideCount).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === safeIndex}
                  aria-label={`Photo ${idx + 1}`}
                  onClick={(e) => goToSlide(idx, e)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === safeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="property-card__body">
        <div className="property-card__pricing">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
            {isCommercial && property.priceLabel && (
              <span className="mb-0.5 block w-full text-label text-slate-400">
                {property.priceLabel}
              </span>
            )}
            <span className="type-card-price whitespace-nowrap">
              {isRental ? rentalPrice.text : property.priceDisplay}
            </span>
            {rentalPrice?.showMonthSuffix && (
              <span className="property-card__price-note whitespace-nowrap">/ month</span>
            )}
          </div>
          <div className="shrink-0 text-right">
            {isRental ? (
              <span className="property-card__price-note block">
                {property.depositDisplay || property.deposit
                  ? `Deposit ${property.depositDisplay || property.deposit}`
                  : 'Maintenance incl.'}
              </span>
            ) : property.pricePerSqFt ? (
              <span className="property-card__price-note block">{property.pricePerSqFt}</span>
            ) : null}
          </div>
        </div>

        <h3 className="property-card__title">
          <Link to={`/property/${property.slug}`}>{property.title}</Link>
        </h3>

        <div className="property-card__location">
          <MapPin size={MKT_ICON.md} className="shrink-0 text-brand-gold" aria-hidden />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="property-card__specs">
          {isCommercial ? (
            <>
              {property.area && (
                <div className="property-card__spec" title={`Super built up area: ${property.area}`}>
                  <ArrowsOut size={MKT_ICON.md} className="shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{property.area}</span>
                </div>
              )}
              <div className="property-card__spec" title={`Fitout: ${property.furnishing || 'Bare shell'}`}>
                <Buildings size={MKT_ICON.md} className="shrink-0 text-slate-400" aria-hidden />
                <span className="truncate">{property.furnishing || 'Bare shell'}</span>
              </div>
              <div
                className="property-card__spec"
                title={property.parkingCount || property.parking || 'Parking available'}
              >
                <Car size={MKT_ICON.md} className="shrink-0 text-slate-400" aria-hidden />
                <span className="truncate">
                  {property.parkingCount ? `${property.parkingCount.split(' ')[0]} Parking` : 'Parking'}
                </span>
              </div>
            </>
          ) : (
            <>
              {property.bedrooms && (
                <div className="property-card__spec">
                  <Bed size={MKT_ICON.md} className="shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="property-card__spec">
                  <Bathtub size={MKT_ICON.md} className="shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                <div className="property-card__spec">
                  <ArrowsOut size={MKT_ICON.md} className="shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{property.area}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="property-card__context">
          {property.availabilityStatus === 'leased' ? (
            <div className="property-card__context-inner border-amber-200/60 bg-amber-50 text-amber-900">
              <span className="type-card-context-key text-amber-900">Leased</span>
              <span className="type-card-context-val text-amber-700">Not accepting visits</span>
            </div>
          ) : isRental ? (
            <div className="property-card__context-inner">
              <span className="type-card-context-key text-emerald-700">
                {property.availabilityDate || property.status || 'Immediate move in'}
              </span>
              <span className="type-card-context-val max-w-[9.5rem] truncate">
                {property.preferredTenant || 'All tenants welcome'}
              </span>
            </div>
          ) : isCommercial ? (
            <div className="property-card__context-inner">
              <span className="type-card-context-key">
                {property.buildingType || 'Commercial asset'}
              </span>
              <span className="type-card-context-val">{property.floorNumber || 'Multiple floors'}</span>
            </div>
          ) : (
            <div className="property-card__context-inner">
              <span className="type-card-context-key">Title certified</span>
              <span className="type-card-context-val">RERA verified</span>
            </div>
          )}
        </div>

        <div className="property-card__footer">
          <Link to={`/property/${property.slug}`} className="property-card__cta-primary">
            View details
          </Link>
          <button
            type="button"
            onClick={() => openSiteVisit(property)}
            aria-label="Schedule property inspection visit"
            title="Schedule visit"
            className="property-card__icon-btn property-card__icon-btn--navy"
          >
            <CalendarCheck size={MKT_ICON.lg} weight="bold" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => openEnquiry(property)}
            aria-label="Send property enquiry"
            title="Enquire with advisor"
            className="property-card__icon-btn property-card__icon-btn--gold"
          >
            <ChatCircleText size={MKT_ICON.lg} weight="bold" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
