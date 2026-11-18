import React, { useState } from 'react';
import { ChatCircleText, CheckCircle, WarningCircle, ShieldCheck, MapPin, X } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useProperty } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';

const ENQUIRY_TOPICS = [
  'Pricing and payment plan',
  'Floor plan and architectural brochure',
  'Schedule callback with advisor',
  'RERA verification records'
];

export default function EnquiryModal({ property: propProperty, onClose: propOnClose }) {
  let contextProperty = null;
  let contextClose = null;

  try {
    const ctx = useProperty();
    contextProperty = ctx.enquiryProperty;
    contextClose = ctx.closeEnquiry;
  } catch {
    // context not available
  }

  const property = propProperty || contextProperty;
  const onClose = propOnClose || contextClose || (() => {});

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [topic, setTopic] = useState('Pricing and payment plan');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!property) return null;

  // Client side validation per PRD 4.2.6
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid 10 digit mobile number';
    }

    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrors({});
    setFullName('');
    setPhoneNumber('');
    setEmailAddress('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl bg-white border-0 shadow-2xl text-left">
        
        {/* Header Preview */}
        <div className="bg-[#142B4A] text-white p-6 relative">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 text-slate-300 hover:text-white cursor-pointer"
          >
            <X size={18} weight="bold" />
          </button>

          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-1.5 block">
            Direct advisor enquiry
          </span>
          <DialogTitle className="heading-3 text-white font-bold tracking-tight">
            Enquire about this residence
          </DialogTitle>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
            <MapPin size={14} className="text-[#C5A46D] shrink-0" />
            <span className="truncate">{property.title} • {property.location}</span>
          </div>
        </div>

        <ScrollArea className="max-h-[75vh]">
          <div className="p-6 md:p-8">
          {isSubmitted ? (
            /* PRD 4.2.7: Confirmation State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle size={38} weight="fill" />
              </div>

              <h3 className="heading-3 text-brand-navy font-bold">
                Enquiry submitted
              </h3>

              <p className="body-4 text-slate-600 max-w-sm mx-auto">
                Thank you {fullName}. The verified advisor for <strong>{property.title}</strong> will contact you via <strong>{phoneNumber}</strong> within 2 hours.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 text-left space-y-2 text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subject:</span>
                  <span className="font-semibold text-brand-navy">{topic}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Listed price:</span>
                  <span className="font-semibold text-brand-navy">{property.priceDisplay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Advisory fee:</span>
                  <span className="font-semibold text-emerald-700">Zero brokerage for buyers</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Enquiry Topic */}
              <div>
                <label className="caption-1 font-bold text-brand-navy block mb-2">
                  What would you like to enquire about?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ENQUIRY_TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        topic === t
                          ? 'bg-[#142B4A] text-white border-[#142B4A] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="caption-2 font-semibold text-slate-600 block mb-1">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Iyer"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                    errors.fullName ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                  }`}
                />
                {errors.fullName && (
                  <p className="caption-2 text-rose-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-2 font-semibold text-slate-600 block mb-1">
                    Mobile number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                      errors.phoneNumber ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="caption-2 text-rose-500 mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="caption-2 font-semibold text-slate-600 block mb-1">
                    Email address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value);
                      if (errors.emailAddress) setErrors((prev) => ({ ...prev, emailAddress: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                      errors.emailAddress ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                  {errors.emailAddress && (
                    <p className="caption-2 text-rose-500 mt-1">{errors.emailAddress}</p>
                  )}
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label className="caption-2 font-semibold text-slate-600 block mb-1">
                  Specific questions or preferences (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Are higher floors available? Can we discuss payment milestones?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-brand-navy focus:outline-none focus:bg-white focus:border-brand-blue transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#142B4A] hover:bg-brand-blue text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <ChatCircleText size={16} weight="bold" />
                  <span>{isSubmitting ? 'Submitting enquiry...' : 'Submit property enquiry'}</span>
                </button>
              </div>

            </form>
          )}
          </div>
        </ScrollArea>

      </DialogContent>
    </Dialog>
  );
}
