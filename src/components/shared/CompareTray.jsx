import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scales, X, ArrowRight, CaretUp, CaretDown, Trash } from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function CompareTray() {
  const location = useLocation();
  const { comparePropertyIds, removeCompare, clearCompare } = useProperty();
  const [isMinimized, setIsMinimized] = useState(false);

  // Do not render tray on the compare page itself
  if (location.pathname === '/compare' || comparePropertyIds.length === 0) {
    return null;
  }

  const comparedProperties = SAMPLE_PROPERTIES.filter((p) =>
    comparePropertyIds.includes(p.id)
  );

  const totalSlots = 4;
  const emptySlotsCount = Math.max(0, totalSlots - comparedProperties.length);

  return (
    <aside 
      aria-label="Property comparison tray"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-4xl transition-all duration-300"
    >
      <div className="bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_rgba(20,43,74,0.18)] rounded-3xl p-3 sm:p-4 text-left">
        
        {/* Tray Header Bar */}
        <div className="flex items-center justify-between gap-3 mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-brand-navy text-brand-gold flex items-center justify-center shrink-0">
              <Scales size={15} weight="fill" />
            </span>
            <div className="flex items-center gap-2">
              <span className="caption-1 font-bold text-brand-navy">
                Compare properties
              </span>
              <Badge variant="neutral" className="px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {comparedProperties.length} of {totalSlots} selected
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="text-slate-400 hover:text-rose-600 text-[11px] font-semibold transition-colors px-2 py-1 cursor-pointer flex items-center gap-1"
              title="Clear comparison tray"
            >
              <Trash size={13} />
              <span className="hidden sm:inline">Clear all</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized((prev) => !prev)}
              aria-label={isMinimized ? 'Expand comparison tray' : 'Collapse comparison tray'}
              className="p-1 rounded-full text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isMinimized ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Expandable Thumbnail Slots & Action Bar */}
        {!isMinimized && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            
            {/* Shortlisted Properties Thumbnails */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-1 overflow-x-auto pb-1 sm:pb-0">
              {comparedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="relative flex items-center gap-2.5 p-1.5 sm:pr-3 rounded-2xl bg-slate-50 border border-slate-200/80 group hover:border-brand-blue transition-all min-w-[140px] sm:max-w-[200px]"
                >
                  <img
                    src={prop.images?.[0]}
                    alt={prop.title}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="caption-3 font-semibold text-brand-navy truncate">
                      {prop.title}
                    </p>
                    <p className="caption-4 text-slate-500 font-medium truncate">
                      {prop.priceDisplay}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCompare(prop.id)}
                    aria-label={`Remove ${prop.title} from comparison`}
                    className="w-5 h-5 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <X size={11} weight="bold" />
                  </button>
                </div>
              ))}

              {/* Empty Placeholder Slots */}
              {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="hidden md:flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium min-w-[120px]"
                >
                  <span className="text-[11px]">+ Add property</span>
                </div>
              ))}
            </div>

            {/* Compare CTA Button */}
            <div className="flex items-center justify-end shrink-0">
              <Link to="/compare" className="w-full sm:w-auto">
                <Button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Compare side by side</span>
                  <ArrowRight size={14} weight="bold" />
                </Button>
              </Link>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
}
