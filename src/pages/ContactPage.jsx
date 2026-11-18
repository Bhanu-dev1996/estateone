import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Envelope, 
  Phone, 
  CheckCircle, 
  ChatCircleDots,
  PaperPlaneTilt,
  Clock,
  ArrowSquareOut,
  Buildings,
  Question,
  Headset,
  WarningCircle
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ENQUIRY_CATEGORIES = [
  'General enquiry',
  'Buying property',
  'Renting property',
  'Listing a property',
  'Agent / builder partnership',
  'Technical support',
  'Report an issue',
  'Other'
];

const SUPPORT_FAQS = [
  {
    question: 'How quickly will an advisor respond to my enquiry?',
    answer: 'Our dedicated client advisory desk reviews incoming requests continuously. For submissions received between 9 AM and 7 PM Monday to Saturday, an accredited coordinator will connect with you within 2 to 4 hours. Enquiries submitted on Sundays or bank holidays are addressed first thing the following business morning.'
  },
  {
    question: 'Can I visit the EstateOne physical office for a private consultation?',
    answer: 'Yes. Our corporate headquarters at Bandra Kurla Complex (BKC), Mumbai welcomes prospective buyers, institutional investors, and master developers by appointment. We provide dedicated conference suites for confidential portfolio reviews and document inspections.'
  },
  {
    question: 'Are there any fees for buyers or tenants to schedule property site visits?',
    answer: 'Zero fees. EstateOne does not charge buyers or tenants for browsing verified listings, inspecting title certificates, or scheduling confirmed physical walkthroughs. You connect directly with title owners and verified developers without speculative intermediary markups.'
  },
  {
    question: 'How does EstateOne verify developer credentials and RERA certificates?',
    answer: 'Every project on our platform undergoes physical geotagged photographic inspection by regional compliance officers. We match stated carpet areas, society sanction plans, and developer registrations directly against state real estate regulatory authority registries before granting publication clearance.'
  },
  {
    question: 'How do I report an inaccurate listing or unauthorized agent posting?',
    answer: 'Select the "Report an issue" category in the contact form above, or click "Report listing" directly from any property page. Our compliance ombudsman investigates every discrepancy within 12 hours, unpublishing listings that fail title or ownership verification.'
  }
];

export default function ContactPage() {
  const { user } = useAuth();
  const { toastSuccess } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    category: 'General enquiry',
    message: '',
    privacyConsent: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please enter a valid email address.';
    }
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Please enter an enquiry subject.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide details on your inquiry (minimum 10 characters).';
    }
    if (!formData.privacyConsent) {
      errs.privacyConsent = 'You must accept the privacy consent to proceed.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const refCode = `REQ-CNT-${Math.floor(100000 + Math.random() * 900000)}`;

    const contactRequest = {
      referenceId: refCode,
      ...formData,
      status: 'Open',
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage per PRD 5.11 flow
    try {
      const stored = localStorage.getItem('estateone_contact_requests');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(contactRequest);
      localStorage.setItem('estateone_contact_requests', JSON.stringify(list));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedReference(refCode);
      toastSuccess('Enquiry recorded', `Your enquiry was logged with reference ${refCode}.`);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }, 450);
  };

  const handleReset = () => {
    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      subject: '',
      category: 'General enquiry',
      message: '',
      privacyConsent: true
    });
    setErrors({});
    setSubmittedReference(null);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full space-y-16">
      
      {/* =========================================================================
          1. CONTACT HERO
         ========================================================================= */}
      <section className="space-y-4">
        <Breadcrumbs 
          items={[
            { label: 'Contact us' }
          ]} 
          className="mb-2" 
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
            <ChatCircleDots size={15} weight="fill" />
            <span>Dedicated client advisory and support</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <Clock size={14} weight="fill" />
            <span>Average response window: 2 to 4 hours</span>
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Contact EstateOne client advisory.
          </h1>
          <p className="body-3 text-slate-500 leading-relaxed">
            Whether you are seeking a verified residence, leasing corporate headquarters, submitting a property for RERA inspection, or exploring developer partnerships, our regional advisory coordinators are available to assist.
          </p>
        </div>
      </section>

      {/* =========================================================================
          2 & 3. CONTACT FORM & CONTACT INFORMATION LAYOUT
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 7 Cols: Contact Form / Confirmation */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-10 rounded-3xl bg-white shadow-xs border-0">
            {submittedReference ? (
              /* Success Confirmation State */
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle size={36} weight="fill" />
                </div>

                <div className="space-y-1">
                  <h2 className="heading-2 text-brand-navy font-bold">
                    Enquiry submitted successfully
                  </h2>
                  <p className="body-3 text-slate-500 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-brand-navy">{formData.fullName}</span>. Your enquiry has been routed to our compliance and advisory desk.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 inline-block font-mono text-xs text-slate-600">
                  Reference code: <span className="font-bold text-brand-navy">{submittedReference}</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 text-xs text-brand-navy max-w-md mx-auto text-left space-y-1">
                  <span className="font-semibold block">What happens next?</span>
                  <p className="text-slate-600">
                    A dedicated coordinator specializing in <strong className="text-brand-navy">{formData.category}</strong> will review your details and reach out via phone or email within 2 to 4 hours.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="title-1 text-brand-navy font-bold mb-1">
                    Send an enquiry
                  </h2>
                  <p className="caption-2 text-slate-500">
                    Please provide your contact details and message context.
                  </p>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-fullName" className="caption-1 font-semibold text-brand-navy block">
                      Full name *
                    </Label>
                    <Input
                      id="contact-fullName"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`h-11 rounded-xl bg-slate-50 text-xs text-brand-navy border ${
                        errors.fullName ? 'border-rose-500 focus-visible:ring-rose-500' : 'border-slate-200 focus-visible:ring-brand-blue'
                      }`}
                    />
                    {errors.fullName && <p className="caption-3 text-rose-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="caption-1 font-semibold text-brand-navy block">
                      Email address *
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`h-11 rounded-xl bg-slate-50 text-xs text-brand-navy border ${
                        errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : 'border-slate-200 focus-visible:ring-brand-blue'
                      }`}
                    />
                    {errors.email && <p className="caption-3 text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="caption-1 font-semibold text-brand-navy block">
                      Phone number *
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`h-11 rounded-xl bg-slate-50 text-xs text-brand-navy border ${
                        errors.phone ? 'border-rose-500' : 'border-slate-200 focus-visible:ring-brand-blue'
                      }`}
                    />
                    {errors.phone && <p className="caption-3 text-rose-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-category" className="caption-1 font-semibold text-brand-navy block">
                      Enquiry category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger id="contact-category" className="h-11 rounded-xl bg-slate-50 border-slate-200 text-xs text-brand-navy">
                        <SelectValue placeholder="Select enquiry category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENQUIRY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject" className="caption-1 font-semibold text-brand-navy block">
                    Subject *
                  </Label>
                  <Input
                    id="contact-subject"
                    type="text"
                    placeholder="e.g. Schedule visit for 4 BHK Worli penthouse"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`h-11 rounded-xl bg-slate-50 text-xs text-brand-navy border ${
                      errors.subject ? 'border-rose-500' : 'border-slate-200 focus-visible:ring-brand-blue'
                    }`}
                  />
                  {errors.subject && <p className="caption-3 text-rose-500 mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="caption-1 font-semibold text-brand-navy block">
                    Message *
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Share your specific requirements, preferred dates for site visits, or partnership details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`min-h-[110px] rounded-2xl bg-slate-50 text-xs text-brand-navy border ${
                      errors.message ? 'border-rose-500' : 'border-slate-200 focus-visible:ring-brand-blue'
                    } resize-none`}
                  />
                  {errors.message && <p className="caption-3 text-rose-500 mt-1">{errors.message}</p>}
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="contact-privacy"
                      checked={formData.privacyConsent}
                      onCheckedChange={(checked) => setFormData({ ...formData, privacyConsent: !!checked })}
                      className="mt-0.5 rounded-md"
                    />
                    <Label
                      htmlFor="contact-privacy"
                      className="text-xs text-slate-600 font-normal leading-relaxed cursor-pointer select-none"
                    >
                      I consent to having an EstateOne client advisor contact me regarding this enquiry in accordance with the privacy policy.
                    </Label>
                  </div>
                  {errors.privacyConsent && <p className="caption-3 text-rose-500 mt-1">{errors.privacyConsent}</p>}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <PaperPlaneTilt size={15} weight="bold" />
                    <span>{isSubmitting ? 'Sending enquiry...' : 'Submit enquiry'}</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Right 5 Cols: Contact Information, Office Address & Real Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Contact Direct Lines */}
          <Card className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-5">
            <div>
              <h2 className="title-2 text-brand-navy font-bold">
                Direct client advisory lines
              </h2>
              <p className="caption-3 text-slate-500 mt-0.5">
                Speak directly with accredited regional real estate coordinators.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Phone size={18} weight="bold" />
                </div>
                <div>
                  <span className="caption-3 text-slate-400 block mb-0.5">Corporate advisory line</span>
                  <a href="tel:+912261204400" className="caption-1 font-bold text-brand-navy hover:text-brand-blue transition-colors">
                    +91 22 6120 4400
                  </a>
                  <span className="caption-3 text-slate-500 block">Monday to Saturday, 9 AM to 7 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Envelope size={18} weight="bold" />
                </div>
                <div>
                  <span className="caption-3 text-slate-400 block mb-0.5">Client correspondence</span>
                  <a href="mailto:contact@estateone.in" className="caption-1 font-bold text-brand-navy hover:text-brand-blue transition-colors block">
                    contact@estateone.in
                  </a>
                  <a href="mailto:support@estateone.in" className="caption-3 text-slate-500 hover:text-brand-navy transition-colors">
                    support@estateone.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ChatCircleDots size={18} weight="bold" />
                </div>
                <div>
                  <span className="caption-3 text-slate-400 block mb-0.5">Direct chat support</span>
                  <a href="https://wa.me/919820044100" target="_blank" rel="noopener noreferrer" className="caption-1 font-bold text-emerald-800 hover:underline">
                    +91 98200 44100
                  </a>
                  <span className="caption-3 text-slate-500 block">Instant WhatsApp verification desk</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 4 & 5. Real Office Address & Map Card */}
          <Card className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-brand-navy font-bold mb-1">
                <Buildings size={16} weight="fill" className="text-brand-blue" />
                <span>Corporate headquarters</span>
              </div>
              <p className="caption-1 font-bold text-brand-navy leading-snug">
                Bandra Kurla Complex (BKC)
              </p>
              <p className="caption-2 text-slate-500 mt-0.5 leading-relaxed">
                G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India
              </p>
            </div>

            {/* Map Card Preview for BKC Office */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
              {/* Architectural Map Background Image */}
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                alt="BKC Mumbai map location"
                className="w-full h-full object-cover filter saturate-50 contrast-125"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-navy/30" />

              {/* Pin Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-brand-navy text-[#C5A46D] flex items-center justify-center shadow-lg ring-4 ring-white/80 animate-pulse">
                  <MapPin size={20} weight="fill" />
                </div>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-brand-navy/95 text-white font-semibold text-[10px] shadow-xs">
                  EstateOne BKC Hub
                </span>
              </div>

              {/* Coordinates Pill */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-brand-navy shadow-xs">
                19.0660° N, 72.8687° E
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="caption-3 text-slate-400">
                Near BKC Metro and Jio World Centre
              </span>
              <a
                href="https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
              >
                <span>Open in Google Maps</span>
                <ArrowSquareOut size={13} weight="bold" />
              </a>
            </div>
          </Card>

          {/* Regional Verification Hubs */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="caption-2 font-bold text-brand-navy block">
              Regional verification desks
            </span>
            <p className="caption-3 text-slate-500 leading-relaxed">
              Physical document verification coordinators operating in Mumbai, Bengaluru, Hyderabad, Delhi NCR, Pune, Chennai, and Goa.
            </p>
          </div>

        </div>

      </div>

      {/* =========================================================================
          6. SUPPORT FAQ (ACCORDION)
         ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-slate-100">
        <div className="max-w-2xl">
          <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block mb-1">
            Frequently asked questions
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            Common support inquiries.
          </h2>
          <p className="body-4 text-slate-500 mt-2">
            Answers to frequent questions about our verification protocols, site visits, and client assistance.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 w-full">
          {SUPPORT_FAQS.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-200/80 rounded-2xl bg-white shadow-xs">
              <AccordionTrigger className="px-6 py-4 text-xs sm:text-sm font-bold text-brand-navy hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </div>
  );
}
