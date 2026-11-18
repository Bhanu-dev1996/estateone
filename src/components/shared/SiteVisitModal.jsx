import React, { useState } from 'react';
import { 
  X, 
  CalendarCheck, 
  Clock, 
  VideoCamera, 
  MapPin, 
  User, 
  Phone, 
  Envelope, 
  CheckCircle,
  ShieldCheck
} from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (10:00 AM)', value: '10:00 AM' },
  { id: 'afternoon', label: 'Afternoon (02:30 PM)', value: '02:30 PM' },
  { id: 'evening', label: 'Evening (05:00 PM)', value: '05:00 PM' }
];

export default function SiteVisitModal() {
  const { siteVisitProperty, closeSiteVisit } = useProperty();
  const { toastSuccess } = useToast();

  const [visitType, setVisitType] = useState('in-person'); // 'in-person' | 'virtual'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!siteVisitProperty) return null;

  // Tomorrow's date formatted as YYYY-MM-DD for date input minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const validate = () => {
    const errs = {};
    if (!selectedDate) errs.date = 'Please select a preferred inspection date';
    if (!selectedSlot) errs.slot = 'Please select a preferred time slot';
    if (!fullName.trim()) errs.name = 'Full name is required';
    
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10 digit Indian mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate verified booking confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      toastSuccess('Site visit scheduled', `Your visit for ${siteVisitProperty.title} is confirmed.`);
    }, 800);
  };

  const handleClose = () => {
    setIsConfirmed(false);
    setErrors({});
    setSelectedDate('');
    setSelectedSlot('');
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    closeSiteVisit();
  };

  return (
    <Dialog open={!!siteVisitProperty} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl bg-white border-0 shadow-2xl text-left">
        
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
            Property inspection
          </span>
          <DialogTitle className="heading-3 text-white font-bold tracking-tight">
            Schedule a site visit
          </DialogTitle>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
            <MapPin size={14} className="text-[#C5A46D] shrink-0" />
            <span className="truncate">{siteVisitProperty.title} • {siteVisitProperty.location}</span>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="max-h-[75vh]">
          <div className="p-6 md:p-8">
          {isConfirmed ? (
            /* PRD 4.2.7: Confirmation State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle size={38} weight="fill" />
              </div>

              <h3 className="heading-3 text-brand-navy font-bold">
                Site visit confirmed
              </h3>

              <p className="body-4 text-slate-600 max-w-md mx-auto">
                Your visit for <strong>{siteVisitProperty.title}</strong> has been confirmed for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 text-left space-y-2 text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Visit format:</span>
                  <span className="font-semibold text-brand-navy capitalize">{visitType.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned advisor:</span>
                  <span className="font-semibold text-brand-navy">{siteVisitProperty.agent?.name || 'Senior Estate Advisor'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Confirmation sent to:</span>
                  <span className="font-semibold text-brand-navy">{email}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Return to properties
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Visit Format */}
              <div>
                <label className="caption-1 font-bold text-brand-navy block mb-2">
                  Visit format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType('in-person')}
                    className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      visitType === 'in-person'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CalendarCheck size={16} weight="bold" />
                    <span>In person guided tour</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisitType('virtual')}
                    className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      visitType === 'virtual'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <VideoCamera size={16} weight="bold" />
                    <span>Live video walkthrough</span>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="caption-1 font-bold text-brand-navy block mb-1.5">
                  Select preferred date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                    errors.date ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                  }`}
                />
                {errors.date && (
                  <p className="caption-2 text-rose-500 mt-1">{errors.date}</p>
                )}
              </div>

              {/* Time Slots */}
              <div>
                <label className="caption-1 font-bold text-brand-navy block mb-2">
                  Preferred time slot <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot.value);
                        if (errors.slot) setErrors((prev) => ({ ...prev, slot: null }));
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedSlot === slot.value
                          ? 'bg-[#142B4A] text-white border-[#142B4A] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
                {errors.slot && (
                  <p className="caption-2 text-rose-500 mt-1">{errors.slot}</p>
                )}
              </div>

              {/* Personal Details with Validation (PRD 4.2.6) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="caption-2 font-semibold text-slate-600 block mb-1">
                    Your full name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                      errors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                  {errors.name && (
                    <p className="caption-2 text-rose-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="caption-2 font-semibold text-slate-600 block mb-1">
                    Mobile phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                      errors.phone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                  {errors.phone && (
                    <p className="caption-2 text-rose-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="caption-2 font-semibold text-slate-600 block mb-1">
                  Email address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs text-brand-navy focus:outline-none focus:bg-white transition-all ${
                    errors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-brand-blue'
                  }`}
                />
                {errors.email && (
                  <p className="caption-2 text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#142B4A] hover:bg-brand-blue text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <CalendarCheck size={16} weight="bold" />
                  <span>{isSubmitting ? 'Confirming appointment...' : 'Confirm site inspection'}</span>
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
