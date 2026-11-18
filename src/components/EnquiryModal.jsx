import React, { useState } from 'react';
import { CalendarCheck, CheckCircle, WarningCircle, ShieldCheck } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

export default function EnquiryModal({ property, onClose }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitType, setVisitType] = useState('In person');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Client side validation per B10
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email format';
    }

    if (!visitDate) {
      newErrors.visitDate = 'Please select a preferred date';
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

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
              <CalendarCheck size={18} weight="fill" />
            </div>
            <div>
              <DialogTitle>Schedule your site visit</DialogTitle>
              <DialogDescription>
                Direct coordinator confirmation within 2 hours
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle size={36} weight="fill" />
            </div>
            <h4 className="heading-5 text-brand-navy mb-2">
              Visit request confirmed
            </h4>
            <p className="body-5 text-brand-muted max-w-sm mx-auto mb-6">
              Thank you {fullName}. The verified advisor for {property ? property.title : 'this property'} will reach out on {phoneNumber} to coordinate your time slot.
            </p>
            <div className="p-3 bg-slate-100/70 border-0 rounded-xl text-xs text-brand-navy text-left space-y-1 mb-6 shadow-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Preferred date:</span>
                <span className="font-semibold">{visitDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Visit type:</span>
                <span className="font-semibold">{visitType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Advisory fee:</span>
                <span className="font-semibold text-emerald-600">Free of charge</span>
              </div>
            </div>
            <Button type="button" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {property && (
              <div className="p-3 bg-slate-100/70 border-0 rounded-xl flex items-center gap-3 shadow-xs">
                <img 
                  src={property.image || (property.images && property.images[0]) || ''} 
                  alt={property.title} 
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="text-left flex-1 min-w-0">
                  <p className="title-4 text-brand-navy truncate font-semibold">
                    {property.title}
                  </p>
                  <p className="caption-2 text-brand-muted truncate">
                    {property.location}
                  </p>
                  <p className="caption-3 text-brand-blue font-semibold">
                    {property.priceDisplay}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="full-name-input" className="caption-4 text-brand-navy font-medium block mb-1">
                Full name *
              </label>
              <input
                id="full-name-input"
                type="text"
                placeholder="E.g. Rajesh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-brand-fast ${
                  errors.fullName 
                    ? 'border-rose-400 focus:ring-rose-200' 
                    : 'border-brand-border focus:border-brand-blue focus:ring-blue-100'
                }`}
              />
              {errors.fullName && (
                <span className="caption-5 text-rose-500 flex items-center gap-1 mt-1">
                  <WarningCircle size={12} weight="fill" />
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone-number-input" className="caption-4 text-brand-navy font-medium block mb-1">
                  Mobile number *
                </label>
                <input
                  id="phone-number-input"
                  type="tel"
                  placeholder="10 digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-brand-fast ${
                    errors.phoneNumber 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-brand-border focus:border-brand-blue focus:ring-blue-100'
                  }`}
                />
                {errors.phoneNumber && (
                  <span className="caption-5 text-rose-500 flex items-center gap-1 mt-1">
                    <WarningCircle size={12} weight="fill" />
                    {errors.phoneNumber}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="email-address-input" className="caption-4 text-brand-navy font-medium block mb-1">
                  Email address *
                </label>
                <input
                  id="email-address-input"
                  type="email"
                  placeholder="name@domain.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-brand-fast ${
                    errors.emailAddress 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-brand-border focus:border-brand-blue focus:ring-blue-100'
                  }`}
                />
                {errors.emailAddress && (
                  <span className="caption-5 text-rose-500 flex items-center gap-1 mt-1">
                    <WarningCircle size={12} weight="fill" />
                    {errors.emailAddress}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="visit-date-input" className="caption-4 text-brand-navy font-medium block mb-1">
                  Preferred date *
                </label>
                <input
                  id="visit-date-input"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-brand-fast ${
                    errors.visitDate 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-brand-border focus:border-brand-blue focus:ring-blue-100'
                  }`}
                />
                {errors.visitDate && (
                  <span className="caption-5 text-rose-500 flex items-center gap-1 mt-1">
                    <WarningCircle size={12} weight="fill" />
                    {errors.visitDate}
                  </span>
                )}
              </div>

              <div>
                <span className="caption-4 text-brand-navy font-medium block mb-1">
                  Visit type
                </span>
                <div className="flex gap-2">
                  {['In person', 'Video tour'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVisitType(type)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-brand-fast ${
                        visitType === type
                          ? 'bg-brand-navy text-white border-brand-navy'
                          : 'bg-slate-50 text-brand-muted border-brand-border hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="note-textarea" className="caption-4 text-brand-navy font-medium block mb-1">
                Specific questions (optional)
              </label>
              <textarea
                id="note-textarea"
                rows={2}
                placeholder="Mention preferred time slots or questions regarding floor plans"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-brand-fast resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <ShieldCheck size={16} className="text-brand-blue" />
              <span>Zero spam policy. We never share your phone number with unverified brokers.</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span>Scheduling visit...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <CalendarCheck size={18} weight="bold" className="text-brand-gold" />
                  <span>Confirm visit request</span>
                </span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
