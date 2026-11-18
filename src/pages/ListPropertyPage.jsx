import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HouseLine, 
  MapPin, 
  CurrencyInr, 
  Image as ImageIcon, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CITIES, PROPERTY_TYPES } from '../data/properties';

export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: 'Sell',
    propertyType: 'Apartment',
    title: '',
    bedrooms: '3 BHK',
    bathrooms: '3',
    carpetArea: '',
    city: 'Mumbai',
    locality: '',
    price: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    reraNumber: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">List your property</span>
      </nav>

      <div className="mb-8">
        <Badge variant="default" className="mb-3">
          <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
          <span>Seller portal</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          List your property on EstateOne
        </h1>
        <p className="body-4 text-brand-muted mt-2">
          Connect directly with qualified buyers and tenants. Every listing undergoes verification before going live.
        </p>
      </div>

      {submitted ? (
        <Card className="p-10 rounded-3xl bg-white/80 backdrop-blur-2xl border-0 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle size={36} weight="fill" />
          </div>
          <h2 className="heading-2 text-brand-navy font-bold">Property submitted for review</h2>
          <p className="body-3 text-brand-muted max-w-lg mx-auto">
            Thank you, {formData.ownerName || 'Partner'}. Your listing has been received with reference <span className="font-mono font-semibold text-brand-navy">PROP SUB 2026 9842</span>.
          </p>
          <p className="caption-1 text-brand-muted max-w-md mx-auto">
            Our compliance coordinator will inspect your RERA credentials and contact you within 24 hours to confirm your verification appointment.
          </p>
          <div className="pt-6">
            <Link to="/">
              <Button>Return to home</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-8 rounded-3xl bg-white/80 backdrop-blur-2xl border-0 shadow-xs">
          {/* Stepper Progress */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5 text-xs">
            {['Purpose', 'Details', 'Location', 'Pricing', 'Review'].map((step, idx) => {
              const stepNumber = idx + 1;
              const isActive = currentStep === stepNumber;
              const isPast = currentStep > stepNumber;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? 'bg-brand-navy text-white'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : stepNumber}
                  </div>
                  <span className={`hidden sm:inline ${isActive ? 'font-semibold text-brand-navy' : 'text-brand-muted'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step 1: Purpose & Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="title-2 text-brand-navy font-semibold">What is your listing goal?</h2>
              <div className="grid grid-cols-3 gap-4">
                {['Sell', 'Rent', 'Lease'].map((purpose) => (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => setFormData({ ...formData, purpose })}
                    className={`p-4 rounded-2xl text-center border cursor-pointer transition-all ${
                      formData.purpose === purpose
                        ? 'border-brand-navy bg-brand-navy/5 text-brand-navy font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {purpose} property
                  </button>
                ))}
              </div>

              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-2">Property category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.filter((t) => t !== 'All types').map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: type })}
                      className={`p-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                        formData.propertyType === type
                          ? 'border-brand-blue bg-blue-50 text-brand-blue'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="title-2 text-brand-navy font-semibold">Property details and specifications</h2>
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">Project or property title</label>
                <input
                  type="text"
                  placeholder="e.g. Skyline Waterfront Tower"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Bedrooms</label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4 BHK</option>
                    <option>5+ BHK</option>
                  </select>
                </div>
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Carpet area (sq ft)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2,400"
                    value={formData.carpetArea}
                    onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="title-2 text-brand-navy font-semibold">Property location</h2>
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                >
                  {CITIES.filter((c) => c !== 'All cities').map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">Locality or neighborhood</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West, Mumbai"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="title-2 text-brand-navy font-semibold">Pricing and RERA registry</h2>
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">Expected price or rent</label>
                <input
                  type="text"
                  placeholder="e.g. ₹4.50 Cr or ₹1.20 L / month"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                />
              </div>
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">State RERA certificate number</label>
                <input
                  type="text"
                  placeholder="e.g. P51900002148"
                  value={formData.reraNumber}
                  onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="title-2 text-brand-navy font-semibold">Contact details and review</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Full name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Mobile number</label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 text-xs text-brand-muted space-y-1">
                <p className="font-semibold text-brand-navy">Summary confirmation</p>
                <p>{formData.purpose} • {formData.propertyType} • {formData.city}</p>
                <p>{formData.title || 'Untitled listing'} • {formData.price || 'Price on request'}</p>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-black/5 mt-8">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrev} className="rounded-xl flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft size={16} />
                <span>Previous</span>
              </Button>
            ) : <div />}

            <Button onClick={handleNext} className="rounded-xl flex items-center gap-1.5 cursor-pointer">
              <span>{currentStep === 5 ? 'Submit for verification' : 'Next step'}</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
