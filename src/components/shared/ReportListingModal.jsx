import React, { useState } from 'react';
import { 
  X, 
  Flag, 
  ShieldCheck, 
  CheckCircle, 
  WarningCircle 
} from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { useToast } from '../../context/ToastContext';

const REPORT_REASONS = [
  { id: 'incorrect-info', label: 'Incorrect information', description: 'Price, square footage, specifications, or location details are inaccurate.' },
  { id: 'duplicate-listing', label: 'Duplicate listing', description: 'This exact unit is already listed under another entry.' },
  { id: 'property-unavailable', label: 'Property unavailable', description: 'Property has already been sold, leased, or taken off the market.' },
  { id: 'suspected-fraud', label: 'Suspected fraud', description: 'Suspicious seller contact, unverified ownership claims, or advance fee requests.' },
  { id: 'inappropriate-content', label: 'Inappropriate content', description: 'Images, descriptions, or comments violate platform community guidelines.' },
  { id: 'other', label: 'Other', description: 'Any other listing integrity or compliance concern.' }
];

export default function ReportListingModal({ isOpen, onClose, property }) {
  const { toastSuccess, toastError } = useToast();
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Please select a reason for reporting this listing.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Simulate moderation API dispatch (PRD 5.5 Report Listing Flow)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toastSuccess('Report received', 'Listing queued for moderation review.');
    }, 600);
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95vw] p-6 rounded-3xl bg-white border-0 shadow-2xl text-left">
        <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Flag size={16} weight="bold" />
            </div>
            <div>
              <DialogTitle className="heading-4 text-brand-navy font-bold">
                Report this listing
              </DialogTitle>
              <p className="caption-2 text-slate-500">
                {property?.title || 'Listing compliance review'}
              </p>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={36} weight="fill" />
            </div>
            <div className="space-y-1">
              <h3 className="heading-4 text-brand-navy font-bold">
                Report logged successfully
              </h3>
              <p className="body-4 text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for helping protect platform integrity. Reference ticket <span className="font-mono font-bold text-brand-navy">REP-{Math.floor(10000 + Math.random() * 90000)}</span> has been queued for our compliance desk.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Our moderation team reviews reported listings against official RERA registry data within 24 business hours.
            </div>
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-3">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                <WarningCircle size={16} weight="fill" className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="caption-1 font-bold text-brand-navy block mb-2">
                Select reason for reporting
              </label>
              <RadioGroup
                value={selectedReason}
                onValueChange={(val) => {
                  setSelectedReason(val);
                  setError('');
                }}
                className="gap-2.5"
              >
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedReason === r.id
                        ? 'border-brand-navy bg-slate-50'
                        : 'border-slate-100 hover:bg-slate-50/60'
                    }`}
                  >
                    <RadioGroupItem value={r.id} id={r.id} className="mt-0.5" />
                    <div>
                      <span className="caption-1 font-semibold text-brand-navy block">
                        {r.label}
                      </span>
                      <span className="caption-2 text-slate-500 text-[11px] block mt-0.5 leading-snug">
                        {r.description}
                      </span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <label htmlFor="report-details" className="caption-1 font-bold text-brand-navy block mb-1">
                Additional information (optional)
              </label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any additional context, links, or discrepancy details..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold border border-slate-200 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold"
              >
                {isSubmitting ? 'Submitting report...' : 'Submit report'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
