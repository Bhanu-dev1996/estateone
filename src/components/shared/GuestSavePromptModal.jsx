import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, ShieldCheck, ArrowRight, X } from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

export default function GuestSavePromptModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { savePromptOpen, setSavePromptOpen, savePromptProperty, saveGuestProperty } = useProperty();
  const { saveIntendedDestination } = useAuth();

  if (!savePromptOpen || !savePromptProperty) return null;

  const handleSignIn = () => {
    // 1. Remember intended destination (to return to original property after login per PRD 5.7 flow)
    saveIntendedDestination(location.pathname + location.search);
    
    // 2. Remember pending property to save upon authentication
    try {
      sessionStorage.setItem('estateone_pending_save', JSON.stringify({
        id: savePromptProperty.id,
        title: savePromptProperty.title
      }));
    } catch {}

    setSavePromptOpen(false);
    navigate('/login');
  };

  const handleSaveAsGuest = () => {
    saveGuestProperty(savePromptProperty);
    setSavePromptOpen(false);
  };

  const handleClose = () => {
    setSavePromptOpen(false);
  };

  return (
    <Dialog open={savePromptOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 sm:p-8 bg-white rounded-3xl border-0 shadow-2xl text-left">
        <DialogHeader className="text-left mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-small font-semibold mb-2 self-start">
            <Heart size={14} weight="fill" />
            <span>Shortlist property</span>
          </div>
          <DialogTitle className="text-h4 text-brand-navy font-semibold">
            Save to your collection
          </DialogTitle>
          <DialogDescription className="text-small text-slate-500 mt-1">
            Sign in to synchronize your saved properties across all devices, or save for this browsing session.
          </DialogDescription>
        </DialogHeader>

        {/* Property Preview Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5 mb-5">
          <img
            src={savePromptProperty.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
            alt={savePromptProperty.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="title-4 text-brand-navy font-bold truncate">
              {savePromptProperty.title}
            </h4>
            <p className="caption-3 text-slate-500 truncate">
              {savePromptProperty.location}
            </p>
            <p className="caption-3 font-bold text-brand-navy mt-0.5">
              {savePromptProperty.intent === 'rent'
                ? (savePromptProperty.monthlyRentDisplay || savePromptProperty.priceDisplay)
                : savePromptProperty.priceDisplay}
            </p>
          </div>
        </div>

        {/* Primary and Guest Action Buttons */}
        <div className="space-y-2.5">
          <Button size="sm"
            type="button"
            onClick={handleSignIn}
            className="w-full py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white font-semibold min-h-10 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <User size={16} weight="bold" />
            <span>Sign in to save and sync</span>
            <ArrowRight size={14} weight="bold" />
          </Button>

          <Button size="sm"
            type="button"
            variant="outline"
            onClick={handleSaveAsGuest}
            className="w-full py-2.5 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold min-h-10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Save to guest session only</span>
          </Button>
        </div>

        {/* Footer Note */}
        <p className="caption-4 text-center text-slate-400 mt-4">
          Free account with zero broker spam. Return to this listing anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
}
