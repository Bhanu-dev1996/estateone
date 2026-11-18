import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  HouseLine, 
  Bathtub, 
  ArrowsOut, 
  CalendarCheck, 
  Phone, 
  CheckCircle,
  Star
} from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export default function PropertyDetailModal({ property, onClose, onScheduleVisit }) {
  if (!property) return null;

  const images = property.images && property.images.length > 0 
    ? property.images 
    : (property.gallery && property.gallery.length > 0 ? property.gallery : [property.image]);

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden rounded-3xl bg-white border-0 shadow-2xl">
        
        {/* Fixed Pinned Header (Does Not Scroll) */}
        <div className="shrink-0 px-6 py-4 pr-14 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="flex items-center gap-1">
              <ShieldCheck size={14} weight="fill" className="text-brand-blue" />
              <span>RERA verified: {property.reraId}</span>
            </Badge>
            {property.guestFavorite && (
              <Badge variant="accent">
                Verified choice
              </Badge>
            )}
            <Badge variant="neutral">
              {property.status}
            </Badge>
          </div>

          <DialogTitle className="text-sm font-bold text-brand-navy truncate sm:max-w-xs">
            {property.title}
          </DialogTitle>
        </div>

        {/* Scrollable Body (Only This Area Scrolls) */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6 text-left">
          
          {/* Main Photo & Thumbnail Gallery */}
          <div>
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 border-0 shadow-xs">
              <img 
                src={activeImage} 
                alt={`${property.title} preview`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-brand-navy/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-sm font-bold shadow-md">
                {property.priceDisplay} <span className="text-xs font-normal text-slate-300">{property.priceUnit}</span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === img ? 'border-brand-navy ring-2 ring-brand-navy/30' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              
              {/* Rating & Location */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star size={14} weight="fill" className="text-amber-500" />
                  <span>{property.rating || 4.95}</span>
                </span>
                <span>({property.reviewCount || 36} verified reviews)</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-brand-navy">
                  <MapPin size={14} className="text-brand-blue" />
                  <span>{property.location}</span>
                </span>
              </div>

              <div>
                <h3 className="heading-4 text-brand-navy mb-2">
                  {property.title}
                </h3>
                <p className="body-5 text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border-0 shadow-xs">
                <div className="flex flex-col items-center text-center">
                  <HouseLine size={20} className="text-brand-blue mb-1" />
                  <span className="caption-3 font-semibold text-brand-navy">{property.bedrooms}</span>
                  <span className="caption-5 text-brand-muted">Configuration</span>
                </div>
                <div className="flex flex-col items-center text-center border-x border-slate-200/60">
                  <Bathtub size={20} className="text-brand-blue mb-1" />
                  <span className="caption-3 font-semibold text-brand-navy">{property.bathrooms}</span>
                  <span className="caption-5 text-brand-muted">Restrooms</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <ArrowsOut size={20} className="text-brand-blue mb-1" />
                  <span className="caption-3 font-semibold text-brand-navy">{property.area}</span>
                  <span className="caption-5 text-brand-muted">Carpet area</span>
                </div>
              </div>

              {/* Verified Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-brand-navy mb-3">
                    What this verified place offers
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 py-1">
                        <CheckCircle size={15} weight="fill" className="text-emerald-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Agent / Contact Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border-0 shadow-xs flex flex-col justify-between">
              <div>
                <span className="caption-4 text-brand-muted uppercase tracking-wider block mb-2">
                  Verified listing partner
                </span>
                <h4 className="title-2 text-brand-navy font-semibold mb-1">
                  {property.agent?.name || 'Verified Advisor'}
                </h4>
                <p className="caption-2 text-brand-blue font-medium mb-3">
                  {property.agent?.role || 'Premier Property Partner'}
                </p>
                <div className="space-y-2 text-xs text-brand-muted mb-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Identity and background verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>{property.agent?.experience || '10 years experience'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                    onScheduleVisit(property);
                  }}
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5 rounded-full cursor-pointer"
                >
                  <CalendarCheck size={16} />
                  <span>Schedule visit</span>
                </Button>
                {property.agent?.phone && (
                  <a
                    href={`tel:${property.agent.phone.replace(/\s+/g, '')}`}
                    className="w-full py-2 px-3 rounded-full bg-white border border-slate-200 text-brand-navy button-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 text-center font-medium"
                  >
                    <Phone size={16} />
                    <span>Direct phone</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Architectural Floor Layout Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border-0 shadow-xs text-left">
            <div className="flex items-center justify-between mb-3">
              <h4 className="title-3 text-brand-navy font-semibold">
                Architectural floor layout preview
              </h4>
              <span className="caption-4 text-brand-muted">
                Official layout filed under {property.reraId}
              </span>
            </div>
            <div className="aspect-[21/9] w-full rounded-xl bg-white border border-dashed border-slate-300 flex items-center justify-center p-4 text-center">
              <div>
                <p className="body-4 text-brand-navy mb-1 font-semibold">
                  Carpet area plan: {property.area}
                </p>
                <p className="caption-2 text-brand-muted">
                  Includes master suite, ensuite baths, living lounge, modular kitchen layout, and service balusters.
                </p>
              </div>
            </div>
          </div>

        </div>
        </ScrollArea>

        {/* Fixed Pinned Bottom Action Bar (Does Not Scroll) */}
        <div className="shrink-0 px-6 py-3.5 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between gap-4 text-left z-10">
          <div>
            <span className="title-2 font-bold text-brand-navy block">
              {property.priceDisplay}
            </span>
            <span className="text-[11px] text-brand-muted">
              {property.pricePerSqFt || property.priceUnit}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {property.agent?.phone && (
              <a
                href={`tel:${property.agent.phone.replace(/\s+/g, '')}`}
                className="hidden sm:inline-flex py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-semibold transition-all items-center gap-1.5"
              >
                <Phone size={15} />
                <span>Call agent</span>
              </a>
            )}

            <Button
              type="button"
              onClick={() => {
                onClose();
                onScheduleVisit(property);
              }}
              className="rounded-full px-6 py-2.5 bg-brand-navy hover:bg-slate-900 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck size={16} className="text-brand-gold" />
              <span>Schedule visit</span>
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
