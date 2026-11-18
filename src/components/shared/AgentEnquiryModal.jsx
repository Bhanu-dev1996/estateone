import React, { useState } from 'react';
import { ChatCircleText, CheckCircle, ShieldCheck, User, Phone, Envelope, X, Buildings } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AgentEnquiryModal({ 
  isOpen, 
  onClose, 
  agent, 
  propertyContext = null, 
  availableProperties = [] 
}) {
  const { user } = useAuth();
  const { toastSuccess } = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyContext?.id || 'general');
  const [callbackTime, setCallbackTime] = useState('anytime');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');

  if (!isOpen || !agent) return null;

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name.';
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) errs.phoneNumber = 'Please enter a valid phone number.';
    if (!emailAddress.trim() || !emailAddress.includes('@')) errs.emailAddress = 'Please enter a valid email address.';
    if (!privacyConsent) errs.privacyConsent = 'You must accept the privacy consent to proceed.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const ref = `ENQ-AG-${Math.floor(100000 + Math.random() * 900000)}`;
    setEnquiryRef(ref);

    const newEnquiry = {
      referenceId: ref,
      agentId: agent.id,
      agentName: agent.name,
      agentCompany: agent.company,
      propertyId: selectedPropertyId,
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      email: emailAddress.trim(),
      callbackTime,
      message: message.trim() || 'I would like to inquire about properties in your territory.',
      createdAt: new Date().toISOString()
    };

    // Store enquiry against agent in localStorage per PRD 5.8
    try {
      const stored = localStorage.getItem('estateone_agent_enquiries');
      const list = stored ? JSON.parse(stored) : [];
      list.push(newEnquiry);
      localStorage.setItem('estateone_agent_enquiries', JSON.stringify(list));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toastSuccess('Enquiry sent', `Your inquiry for ${agent.name} was registered successfully.`);
    }, 450);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-lg p-6 sm:p-8 bg-white rounded-3xl border-0 shadow-2xl text-left">
        {isSubmitted ? (
          /* Success Confirmation State */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle size={36} weight="fill" />
            </div>
            <DialogTitle className="heading-3 text-brand-navy font-bold">
              Enquiry registered successfully
            </DialogTitle>
            <p className="body-4 text-slate-500 max-w-sm mx-auto">
              Your inquiry has been assigned to <span className="font-semibold text-brand-navy">{agent.name}</span> at {agent.company}.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 inline-block font-mono">
              Reference code: <span className="font-bold text-brand-navy">{enquiryRef}</span>
            </div>
            <p className="caption-3 text-slate-400">
              The advisor will reach out during your preferred time window.
            </p>
            <Button
              type="button"
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer"
            >
              Done
            </Button>
          </div>
        ) : (
          /* Enquiry Form */
          <>
            <DialogHeader className="text-left mb-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={agent.photo || agent.avatar || agent.logo}
                  alt={agent.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="caption-1 font-bold text-brand-navy">{agent.name}</span>
                    {agent.verified && (
                      <ShieldCheck size={14} weight="fill" className="text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="caption-3 text-slate-500">
                    {agent.role} • {agent.company}
                  </p>
                </div>
              </div>
              <DialogTitle className="heading-3 text-brand-navy font-bold">
                Contact verified advisor
              </DialogTitle>
              <DialogDescription className="body-4 text-slate-500">
                Send a direct enquiry regarding property portfolios or schedule a consultation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property Context Selection */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Property or advisory context
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="general">General territory advisory in {agent.city}</option>
                  {availableProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.priceDisplay})
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.fullName ? 'border-rose-500' : 'border-slate-200'
                  } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                />
                {errors.fullName && <p className="caption-3 text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Phone number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.phoneNumber ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.phoneNumber && <p className="caption-3 text-rose-500 mt-1">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.emailAddress ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.emailAddress && <p className="caption-3 text-rose-500 mt-1">{errors.emailAddress}</p>}
                </div>
              </div>

              {/* Preferred Callback Time */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Preferred callback window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'anytime', label: 'Anytime' },
                    { id: 'morning', label: 'Morning (9 AM to 12 PM)' },
                    { id: 'evening', label: 'Evening (4 PM to 8 PM)' }
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setCallbackTime(slot.id)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                        callbackTime === slot.id
                          ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Message or questions (optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details on your budget, property preferences, or questions..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span>
                    I consent to having this verified advisor contact me regarding property recommendations and relevant market data.
                  </span>
                </label>
                {errors.privacyConsent && <p className="caption-3 text-rose-500 mt-1">{errors.privacyConsent}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-500 hover:text-brand-navy cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChatCircleText size={15} weight="bold" />
                  <span>{isSubmitting ? 'Sending enquiry...' : 'Submit enquiry'}</span>
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
