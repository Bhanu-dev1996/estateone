import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ShieldCheck, Flag, CheckCircle } from '@phosphor-icons/react';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';

export default function ReportListingModal({ isOpen, onClose, property }) {
  const { reportListing } = useCustomerDashboard();
  const [reason, setReason] = useState('Incorrect details');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportRef, setReportRef] = useState('');

  const REASONS = [
    'Incorrect property details',
    'Suspicious or fraudulent activity',
    'Duplicate listing',
    'Property no longer available',
    'Misleading images or floor plans',
    'Other concern'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!property) return;
    const res = reportListing({
      propertyTitle: property.title || 'Selected property',
      propertyLocation: property.location || 'India',
      reason,
      description
    });
    setReportRef(res.reference);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setDescription('');
    setReason('Incorrect details');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleResetAndClose}>
      <DialogContent className="max-w-md p-6 bg-white rounded-3xl text-left border-0 shadow-2xl">
        <DialogHeader>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
            <Flag size={20} weight="fill" />
          </div>
          <DialogTitle className="text-h4 text-brand-navy font-semibold">
            Report a listing
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs mt-1">
            Help keep EstateOne accurate and verified. Your report is evaluated by our compliance desk confidentially.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={28} weight="fill" />
            </div>
            <div>
              <h3 className="text-h4 font-bold text-brand-navy">Report submitted</h3>
              <p className="caption-2 text-slate-500 mt-1">
                Investigation reference: <span className="font-mono font-bold text-brand-blue">{reportRef}</span>
              </p>
              <p className="text-small text-slate-500 mt-2">
                Our moderation officers will review this property within 24 hours. Your identity will never be disclosed to the listing agent.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleResetAndClose}
              size="sm" className="w-full rounded-2xl min-h-10 bg-brand-navy text-white font-semibold cursor-pointer mt-4"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {property && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                {property.images && property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-small font-bold text-brand-navy truncate">{property.title}</p>
                  <p className="text-small text-slate-500 truncate">{property.location}</p>
                </div>
              </div>
            )}

            <div>
              <label className="caption-2 font-bold text-brand-navy block mb-1.5">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-small py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-brand-navy focus:outline-none focus:border-brand-blue"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="caption-2 font-bold text-brand-navy block mb-1.5">
                Explanation and details
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is inaccurate or concerning regarding this listing..."
                className="w-full text-small p-3 rounded-xl border border-slate-200 bg-white text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-small text-slate-500">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
              <span>
                Confidentiality notice: Information submitted is protected under EstateOne privacy protocols.
              </span>
            </div>

            <DialogFooter className="flex sm:justify-end gap-2 pt-2">
              <Button size="sm"
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="rounded-2xl min-h-10 px-4 font-semibold cursor-pointer border-slate-200 text-slate-600"
              >
                Cancel
              </Button>
              <Button size="sm"
                type="submit"
                className="rounded-2xl min-h-10 px-4 font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Submit report
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
