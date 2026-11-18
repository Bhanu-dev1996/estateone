import React, { useState, useMemo } from 'react';
import { MagnifyingGlass, X, Scales, ShieldCheck, Plus, Check } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export default function AddComparePropertyModal({
  isOpen,
  onClose,
  onSelectProperty,
  targetSlotId = null, // if replacing a specific property
  existingCompareIds = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('all'); // 'all' | 'buy' | 'rent' | 'commercial'

  const availableProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => {
      // Exclude properties already in compare set (unless it's the one being replaced)
      if (existingCompareIds.includes(p.id) && p.id !== targetSlotId) {
        return false;
      }

      // Filter by Intent Tab
      if (selectedIntent === 'buy' && (p.intent !== 'buy' || p.isCommercial)) return false;
      if (selectedIntent === 'rent' && p.intent !== 'rent') return false;
      if (selectedIntent === 'commercial' && !p.isCommercial && p.intent !== 'commercial' && p.type !== 'Commercial') return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesLoc = p.location?.toLowerCase().includes(q);
        const matchesCity = p.city?.toLowerCase().includes(q);
        const matchesType = p.type?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCity && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [existingCompareIds, targetSlotId, selectedIntent, searchQuery]);

  if (!isOpen) return null;

  const isReplacing = !!targetSlotId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6 sm:p-8 bg-white rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="text-left mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-2 self-start">
            <Scales size={15} weight="fill" />
            <span>{isReplacing ? 'Replace comparison slot' : 'Expand comparison'}</span>
          </div>
          <DialogTitle className="heading-3 text-brand-navy font-bold">
            {isReplacing ? 'Select replacement property' : 'Add property to compare'}
          </DialogTitle>
          <DialogDescription className="body-4 text-slate-500 mt-1">
            {isReplacing
              ? 'Choose a listing to swap into this comparison column.'
              : 'Choose another verified listing to evaluate side by side (up to 4 properties).'}
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar & Intent Filters */}
        <div className="space-y-3 mb-4 text-left">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by building name, locality, city, or property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer transition-colors"
              >
                <X size={13} weight="bold" />
              </button>
            )}
          </div>

          {/* Quick Segment Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All listings' },
              { id: 'buy', label: 'Residential buy' },
              { id: 'rent', label: 'Residential rent' },
              { id: 'commercial', label: 'Commercial' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedIntent(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedIntent === tab.id
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-brand-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Selection List */}
        <ScrollArea className="h-80 pr-2">
          {availableProperties.length > 0 ? (
            <div className="space-y-2.5">
              {availableProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-brand-blue hover:bg-white transition-all flex items-center justify-between gap-3 text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={prop.images?.[0]}
                      alt={prop.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="caption-3 font-semibold text-brand-navy truncate group-hover:text-brand-blue transition-colors">
                          {prop.title}
                        </span>
                        {prop.verified && (
                          <ShieldCheck size={14} weight="fill" className="text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="caption-4 text-slate-500 truncate">
                        {prop.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="caption-3 font-bold text-brand-navy">
                          {prop.intent === 'rent' ? (prop.monthlyRentDisplay || prop.priceDisplay) : prop.priceDisplay}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="caption-4 text-slate-500">
                          {prop.area}
                        </span>
                        {prop.bedrooms && (
                          <>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="caption-4 text-slate-500">
                              {prop.bedrooms}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    className="shrink-0 px-3.5 py-1.5 h-auto text-xs font-semibold rounded-xl bg-brand-navy hover:bg-brand-blue text-white cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Plus size={13} weight="bold" />
                    <span>{isReplacing ? 'Select' : 'Add'}</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>No available properties found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIntent('all');
                }}
                className="mt-2 text-brand-blue font-semibold hover:underline cursor-pointer"
              >
                Clear search criteria
              </button>
            </div>
          )}
        </ScrollArea>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <span className="caption-4 text-slate-400">
            Showing {availableProperties.length} available listings
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-brand-navy cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
