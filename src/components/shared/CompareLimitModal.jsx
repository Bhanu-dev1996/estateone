import React from 'react';
import { Scales, X, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

export default function CompareLimitModal() {
  const { 
    limitModalOpen, 
    setLimitModalOpen, 
    pendingReplaceProperty, 
    setPendingReplaceProperty, 
    comparePropertyIds, 
    replaceCompare 
  } = useProperty();

  if (!limitModalOpen || !pendingReplaceProperty) return null;

  const currentProperties = SAMPLE_PROPERTIES.filter((p) =>
    comparePropertyIds.includes(p.id)
  );

  const handleClose = () => {
    setLimitModalOpen(false);
    setPendingReplaceProperty(null);
  };

  const handleSelectReplacement = (targetOldId) => {
    replaceCompare(targetOldId, pendingReplaceProperty);
  };

  return (
    <Dialog open={limitModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-6 sm:p-8 bg-white rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="text-left mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-small font-semibold mb-2 self-start">
            <Scales size={16} weight="fill" className="text-amber-600" />
            <span>Maximum comparison capacity</span>
          </div>
          <DialogTitle className="text-h4 text-brand-navy font-semibold">
            Comparison limit reached
          </DialogTitle>
          <DialogDescription className="text-small text-slate-500 mt-1">
            You can compare up to 4 properties simultaneously. Select which property in your current set you would like to replace with the new listing.
          </DialogDescription>
        </DialogHeader>

        {/* Incoming Property Preview */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center gap-3.5 text-left">
          <img
            src={pendingReplaceProperty.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
            alt={pendingReplaceProperty.title}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="caption-2 text-brand-blue font-bold uppercase tracking-wider block text-caption">
              New property to add
            </span>
            <h4 className="text-h4 text-brand-navy font-semibold truncate">
              {pendingReplaceProperty.title}
            </h4>
            <p className="caption-2 text-slate-500 truncate">
              {pendingReplaceProperty.location} • <span className="font-semibold text-brand-navy">{pendingReplaceProperty.priceDisplay}</span>
            </p>
          </div>
        </div>

        {/* Shortlisted Properties to Choose For Replacement */}
        <div className="space-y-3 mb-6 text-left">
          <span className="caption-1 font-bold text-slate-700 block">
            Choose a property to remove and replace
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {currentProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-brand-blue transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={prop.images?.[0]}
                    alt={prop.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="title-4 text-brand-navy font-semibold truncate group-hover:text-brand-blue transition-colors">
                      {prop.title}
                    </h5>
                    <p className="caption-3 text-slate-500 font-medium">
                      {prop.priceDisplay}
                    </p>
                  </div>
                </div>

                <Button size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleSelectReplacement(prop.id)}
                  className="w-full text-small font-semibold py-1.5 h-auto rounded-xl border-slate-200 hover:bg-brand-navy hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Replace this property</span>
                  <ArrowRight size={14} weight="bold" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button size="sm"
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="font-semibold text-slate-600 min-h-10 hover:text-brand-navy cursor-pointer"
          >
            Keep current comparison set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
