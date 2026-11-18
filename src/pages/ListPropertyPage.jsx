import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  HouseLine, 
  Buildings, 
  MapPin, 
  CurrencyInr, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FloppyDisk,
  Trash,
  PlusCircle,
  User,
  Phone,
  Envelope,
  VideoCamera,
  Star,
  WarningCircle,
  PencilSimple,
  Clock,
  Sparkle,
  UploadSimple,
  Check
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { CITIES, PROPERTY_TYPES } from '../data/properties';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ListingStatusTracker from '../components/listing/ListingStatusTracker';
import MySubmissionsView from '../components/listing/MySubmissionsView';
import Breadcrumbs from '../components/shared/Breadcrumbs';

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Telangana',
  'Delhi NCR',
  'Tamil Nadu',
  'Goa',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh'
];

const SAMPLE_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
];

const SAMPLE_FLOOR_PLAN = 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80';

const INITIAL_FORM_DATA = {
  // Step 1: Purpose
  purpose: 'sell', // 'sell' | 'rent' | 'lease'

  // Step 2: Property Type
  propertyType: 'Apartment',

  // Step 3: Details
  title: '',
  description: '',
  builtUpArea: '',
  carpetArea: '',
  bedrooms: '3 BHK',
  bathrooms: '3',
  furnishing: 'Semi furnished',
  floorNumber: '8',
  totalFloors: '24',
  propertyAge: 'Ready to move',
  availability: 'Immediate',
  availableFromDate: '',
  facing: 'East',
  parkingSlots: '2 covered',
  balconies: '2',
  gatedCommunity: true,
  powerBackup: '100% full backup',

  // Step 4: Location
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  locality: '',
  fullAddress: '',
  pincode: '',
  landmark: '',

  // Step 5: Pricing
  expectedPrice: '',
  monthlyRent: '',
  securityDeposit: '',
  leaseRatePerSqFt: '',
  leaseDuration: '36 months',
  isNegotiable: false,
  maintenanceCharges: '',
  maintenanceIncluded: false,
  otherChargesLabel: 'Clubhouse and car parking allocation',
  otherChargesAmount: '',

  // Step 6: Media
  images: [SAMPLE_PRESET_IMAGES[0], SAMPLE_PRESET_IMAGES[1]],
  coverImageIndex: 0,
  floorPlans: [SAMPLE_FLOOR_PLAN],
  videoTourUrl: '',

  // Step 7: Submitter
  submitterName: '',
  submitterPhone: '',
  submitterEmail: '',
  submitterRole: 'Owner',
  companyName: '',
  reraNumber: '',

  // Step 8: Consents
  agreeTruthful: false,
  agreePrivacy: false
};

export default function ListPropertyPage() {
  const { user, isAuthenticated, login, saveIntendedDestination } = useAuth();
  const { toastSuccess, toastInfo, toastError } = useToast();
  const navigate = useNavigate();

  // Active View Tab: 'wizard' | 'submissions'
  const [activeTab, setActiveTab] = useState('wizard');

  // Wizard Step (1 to 8)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState(null);

  // Draft banner state
  const [draftPrompt, setDraftPrompt] = useState(null);

  // Upload simulation states
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Submissions list from localStorage
  const [submissions, setSubmissions] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_submitted_listings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Pre-fill submitter from authenticated user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        submitterName: prev.submitterName || user.name || '',
        submitterEmail: prev.submitterEmail || user.email || ''
      }));
    }
  }, [user]);

  // Check for unsaved draft on mount
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem('estateone_listing_draft');
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft);
        if (parsed?.data) {
          setDraftPrompt(parsed);
        }
      }
    } catch {}
  }, []);

  // Save draft action
  const handleSaveDraft = () => {
    try {
      const draftPayload = {
        data: formData,
        step: currentStep,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('estateone_listing_draft', JSON.stringify(draftPayload));
      toastSuccess('Draft saved locally', 'You can resume this listing anytime from this browser.');
    } catch {
      toastError('Error saving draft', 'Local storage was unavailable.');
    }
  };

  const handleResumeDraft = () => {
    if (draftPrompt?.data) {
      setFormData(draftPrompt.data);
      if (draftPrompt.step) setCurrentStep(draftPrompt.step);
      setDraftPrompt(null);
      toastInfo('Draft restored', 'Resumed listing from your saved draft.');
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem('estateone_listing_draft');
    } catch {}
    setDraftPrompt(null);
    toastInfo('Draft cleared', 'Starting with a fresh listing form.');
  };

  // Step Validation Logic
  const validateStep = (stepNumber) => {
    const errs = {};

    if (stepNumber === 1) {
      if (!formData.purpose) errs.purpose = 'Please select a listing goal.';
    }

    if (stepNumber === 2) {
      if (!formData.propertyType) errs.propertyType = 'Please choose a property category.';
    }

    if (stepNumber === 3) {
      if (!formData.title.trim() || formData.title.trim().length < 8) {
        errs.title = 'Please enter a descriptive property title (minimum 8 characters).';
      }
      if (!formData.carpetArea && !formData.builtUpArea) {
        errs.carpetArea = 'Please enter carpet area or built up area in square feet.';
      }
      if (!formData.description.trim() || formData.description.trim().length < 15) {
        errs.description = 'Please provide a short description highlighting property features.';
      }
    }

    if (stepNumber === 4) {
      if (!formData.city) errs.city = 'Please select a city.';
      if (!formData.locality.trim()) errs.locality = 'Please enter the locality or sub market.';
      if (!formData.fullAddress.trim() || formData.fullAddress.trim().length < 5) {
        errs.fullAddress = 'Please enter the property building name and address.';
      }
    }

    if (stepNumber === 5) {
      if (formData.purpose === 'sell') {
        if (!formData.expectedPrice.trim()) errs.expectedPrice = 'Please enter expected sale price.';
      } else if (formData.purpose === 'rent') {
        if (!formData.monthlyRent.trim()) errs.monthlyRent = 'Please enter monthly rent.';
        if (!formData.securityDeposit.trim()) errs.securityDeposit = 'Please enter security deposit.';
      } else if (formData.purpose === 'lease') {
        if (!formData.expectedPrice.trim() && !formData.monthlyRent.trim() && !formData.leaseRatePerSqFt.trim()) {
          errs.expectedPrice = 'Please specify commercial lease rate or monthly valuation.';
        }
      }
    }

    if (stepNumber === 6) {
      if (!formData.images || formData.images.length === 0) {
        errs.images = 'Please upload or pick at least one property photo.';
      }
    }

    if (stepNumber === 7) {
      if (!formData.submitterName.trim()) errs.submitterName = 'Please enter your full name.';
      const cleanPhone = (formData.submitterPhone || '').replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 8) errs.submitterPhone = 'Please enter a valid phone number.';
      if (!formData.submitterEmail.trim() || !formData.submitterEmail.includes('@')) {
        errs.submitterEmail = 'Please enter a valid email address.';
      }
      if ((formData.submitterRole === 'Licensed Agent' || formData.submitterRole === 'Builder or Developer') && !formData.companyName.trim()) {
        errs.companyName = 'Please enter your company or agency name.';
      }
    }

    if (stepNumber === 8) {
      if (!formData.agreeTruthful) errs.agreeTruthful = 'You must confirm that all listing details are truthful.';
      if (!formData.agreePrivacy) errs.agreePrivacy = 'You must accept the terms and privacy consent.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      window.scrollTo({ top: 120, behavior: 'smooth' });
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStep > 1) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToStep = (stepNumber) => {
    setErrors({});
    window.scrollTo({ top: 120, behavior: 'smooth' });
    setCurrentStep(stepNumber);
  };

  // Image Upload Simulation & Validation
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);
    setUploadProgress(20);

    const validFiles = [];
    for (const file of files) {
      // Validate format
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadError('Only JPEG, PNG, and WebP image formats are supported.');
        setUploadProgress(null);
        return;
      }
      // Validate size <= 10MB
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Files must be under 10MB in size.');
        setUploadProgress(null);
        return;
      }
      validFiles.push(file);
    }

    // Simulate progress
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          // Convert files to object URLs
          const newUrls = validFiles.map((f) => URL.createObjectURL(f));
          setFormData((curr) => ({
            ...curr,
            images: [...curr.images, ...newUrls]
          }));
          setUploadProgress(null);
          toastSuccess('Photos uploaded', `Added ${validFiles.length} property images.`);
          return null;
        }
        return prev + 35;
      });
    }, 150);
  };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toastError('File too large', 'Floor plan must be under 10MB.');
      return;
    }

    const planUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      floorPlans: [...prev.floorPlans, planUrl]
    }));
    toastSuccess('Floor plan added', 'Architectural layout attached.');
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => {
      const nextImages = prev.images.filter((_, i) => i !== idx);
      const nextCover = prev.coverImageIndex >= nextImages.length ? 0 : prev.coverImageIndex;
      return { ...prev, images: nextImages, coverImageIndex: nextCover };
    });
  };

  const handleSetCover = (idx) => {
    setFormData((prev) => ({ ...prev, coverImageIndex: idx }));
    toastInfo('Cover photo updated', 'Selected image set as primary listing cover.');
  };

  // Submit for Verification
  const handleSubmitListing = (e) => {
    e?.preventDefault();
    if (!validateStep(8)) return;

    setIsSubmitting(true);
    const refCode = `EST-LST-${Math.floor(100000 + Math.random() * 900000)}`;

    const newSubmission = {
      referenceId: refCode,
      ...formData,
      status: 'Pending verification',
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      try {
        const stored = localStorage.getItem('estateone_submitted_listings');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newSubmission);
        localStorage.setItem('estateone_submitted_listings', JSON.stringify(list));
        setSubmissions(list);

        // Remove draft once submitted
        localStorage.removeItem('estateone_listing_draft');
      } catch {}

      setIsSubmitting(false);
      setSubmittedReference(refCode);
      toastSuccess('Submission registered', `Property submitted under reference ${refCode}.`);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 600);
  };

  const handleResetForNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setSubmittedReference(null);
    setActiveTab('wizard');
  };

  // Edit Submission (PRD 6.4 Owner Journey: Changes Required -> Update Listing)
  const handleEditSubmission = (sub) => {
    setFormData((prev) => ({
      ...prev,
      ...sub
    }));
    setCurrentStep(7);
    setActiveTab('wizard');
    setSubmittedReference(null);
    toastInfo('Editing listing', `Loaded ${sub.title || 'listing'} into wizard for updates.`);
  };

  // Quick Demo Login for instant testing if visitor is unauthenticated
  const handleQuickDemoLogin = () => {
    login('owner.rajesh@estateone.in', 'owner');
    toastSuccess('Signed in as property owner', 'Listing wizard unlocked.');
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full">
      <Breadcrumbs 
        items={[
          { label: 'Seller and advisor portal', href: '/list-property' },
          { label: 'List your property' }
        ]} 
        className="mb-4" 
      />

      {/* Top Banner and Navigation Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
              <ShieldCheck size={15} weight="fill" />
              <span>EstateOne verified submission portal</span>
            </span>
          </div>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            List your verified property.
          </h1>
          <p className="body-4 text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Submit your residential or commercial property for direct administrative review. Every listing undergoes physical verification and RERA screening before public display.
          </p>
        </div>

        {/* Tab Switcher: Submit Listing vs My Submissions */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs self-start lg:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('wizard'); setSubmittedReference(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'wizard' && !submittedReference
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
            }`}
          >
            <PlusCircle size={15} weight="bold" />
            <span>Listing wizard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
            }`}
          >
            <Clock size={15} weight="bold" />
            <span>My submissions ({submissions.length})</span>
          </button>
        </div>
      </div>

      {/* Unsaved Draft Banner */}
      {draftPrompt && activeTab === 'wizard' && !submittedReference && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2.5 text-brand-navy">
            <FloppyDisk size={18} className="text-brand-blue shrink-0" weight="fill" />
            <div>
              <span className="font-bold block">Unsaved listing draft detected</span>
              <span className="text-slate-600">
                You have an in progress draft from {new Date(draftPrompt.savedAt).toLocaleDateString('en-IN')}. Would you like to resume?
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-semibold cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleResumeDraft}
              className="px-4 py-1.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-semibold cursor-pointer shadow-xs"
            >
              Resume draft
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW A: SUBMISSIONS HISTORY
         ========================================================================= */}
      {activeTab === 'submissions' ? (
        <MySubmissionsView 
          submissions={submissions} 
          onNewListing={() => { setActiveTab('wizard'); handleResetForNew(); }} 
          onEditSubmission={handleEditSubmission}
        />
      ) : submittedReference ? (
        /* =========================================================================
            VIEW B: SUBMISSION CONFIRMATION & MODERATION TRACKER
           ========================================================================= */
        <div className="space-y-8 w-full">
          <Card className="p-8 sm:p-10 rounded-3xl bg-white shadow-xs border-0 text-center space-y-4 w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle size={36} weight="fill" />
            </div>
            
            <h2 className="heading-2 text-brand-navy font-bold">
              Property submitted for verification
            </h2>
            
            <p className="body-3 text-slate-500 max-w-lg mx-auto">
              Thank you, <span className="font-semibold text-brand-navy">{formData.submitterName}</span>. Your property listing has been recorded with reference number:
            </p>

            <div className="inline-block p-4 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-sm font-bold text-brand-navy">
              {submittedReference}
            </div>

            <p className="caption-2 text-slate-400 max-w-md mx-auto">
              Our regional compliance team will review your title documentation and schedule physical verification within 24 to 48 hours.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
              <Button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Track my submissions
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetForNew}
                className="px-6 py-2.5 rounded-xl border-slate-200 text-brand-navy hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Submit another property
              </Button>
              <Link to="/">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs font-semibold text-slate-500 hover:text-brand-navy cursor-pointer"
                >
                  Return to home
                </Button>
              </Link>
            </div>
          </Card>

          {/* Moderation Stage Tracker & Regulatory Statuses */}
          <ListingStatusTracker 
            currentStatus="Pending verification" 
            referenceId={submittedReference} 
          />
        </div>
      ) : !isAuthenticated ? (
        /* =========================================================================
            VIEW C: AUTHENTICATION GATE (PRD 5.9 Rule: Ask visitor to login/signup)
           ========================================================================= */
        <Card className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-white shadow-xs border-0 w-full text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left 7 Columns: Value Propositions & Authority */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
                <ShieldCheck size={16} weight="fill" />
                <span>Verified seller and builder gateway</span>
              </div>

              <h2 className="heading-1 text-brand-navy font-bold tracking-tight">
                Sign in to list and manage your luxury properties.
              </h2>

              <p className="body-3 text-slate-500 leading-relaxed max-w-2xl">
                Every property on EstateOne connects directly with prequalified high net worth buyers and corporate tenants. Signing in secures your listing drafts, attaches official RERA certificates, and enables direct inquiry tracking.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                  <span className="caption-1 font-bold text-brand-navy block mb-1">
                    Zero ghost inquiries
                  </span>
                  <span className="caption-3 text-slate-500">
                    Direct coordinator management with verified buyers only.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                  <span className="caption-1 font-bold text-brand-navy block mb-1">
                    Complimentary media
                  </span>
                  <span className="caption-3 text-slate-500">
                    High resolution architectural photography and 2D floor plans.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                  <span className="caption-1 font-bold text-brand-navy block mb-1">
                    24 to 48h screening
                  </span>
                  <span className="caption-3 text-slate-500">
                    Expedited state RERA document and title inspection window.
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Authentication Actions */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white text-brand-blue flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck size={28} weight="fill" />
                </div>

                <div>
                  <h3 className="title-2 font-bold text-brand-navy">
                    Access seller portal
                  </h3>
                  <p className="caption-2 text-slate-500 mt-1">
                    Sign in to continue your listing submission or create an account.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      saveIntendedDestination('/list-property');
                      navigate('/login');
                    }}
                    className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Sign in to existing account
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      saveIntendedDestination('/list-property');
                      navigate('/register');
                    }}
                    className="w-full py-3 rounded-2xl border-slate-200 bg-white hover:bg-slate-100 text-brand-navy text-xs font-semibold cursor-pointer"
                  >
                    Create new seller account
                  </Button>
                </div>

                <div className="pt-3 border-t border-slate-200/80">
                  <p className="caption-3 text-slate-400 mb-2">
                    Evaluating the listing workflow?
                  </p>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-brand-blue caption-2 font-bold transition-colors cursor-pointer"
                  >
                    Sign in instantly as verified listing owner
                  </button>
                </div>
              </div>
            </div>

          </div>
        </Card>
      ) : (
        /* =========================================================================
            VIEW D: 8-STEP LISTING WIZARD
           ========================================================================= */
        <Card className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-white shadow-xs border-0 space-y-8 w-full">
          
          {/* Wizard Header Bar: Step Progress & Save Draft Action */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
            <div>
              <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block mb-1">
                Step {currentStep} of 8
              </span>
              <h2 className="heading-3 text-brand-navy font-bold">
                {currentStep === 1 && 'Listing purpose'}
                {currentStep === 2 && 'Property category'}
                {currentStep === 3 && 'Property specifications'}
                {currentStep === 4 && 'Location and territory'}
                {currentStep === 5 && 'Pricing and commercial terms'}
                {currentStep === 6 && 'Media and architectural plans'}
                {currentStep === 7 && 'Owner and advisor details'}
                {currentStep === 8 && 'Review and submission'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-brand-navy text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Save draft to continue later"
              >
                <FloppyDisk size={14} weight="bold" />
                <span className="hidden sm:inline">Save draft</span>
              </button>
            </div>
          </div>

          {/* 8-Step Visual Stepper Bar */}
          <div className="grid grid-cols-8 gap-1.5 pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
              const isPast = currentStep > s;
              const isCurrent = currentStep === s;
              return (
                <div key={s} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isPast
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? 'bg-brand-navy'
                        : 'bg-slate-100'
                    }`}
                  />
                  <span className={`caption-3 hidden md:block text-center truncate ${isCurrent ? 'font-bold text-brand-navy' : 'text-slate-400'}`}>
                    {s === 1 && 'Purpose'}
                    {s === 2 && 'Type'}
                    {s === 3 && 'Details'}
                    {s === 4 && 'Location'}
                    {s === 5 && 'Pricing'}
                    {s === 6 && 'Media'}
                    {s === 7 && 'Contact'}
                    {s === 8 && 'Review'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* =====================================================================
              STEP 1: LISTING PURPOSE (Sell, Rent, Lease)
             ===================================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  What is the primary transaction goal for this listing?
                </h3>
                <p className="caption-2 text-slate-500">
                  Select whether you are offering this property for outright acquisition, residential tenancy, or commercial lease.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'sell',
                    title: 'Sell property',
                    desc: 'Outright transfer of residential apartment, villa, plot, or commercial unit.',
                    icon: HouseLine
                  },
                  {
                    id: 'rent',
                    title: 'Rent property',
                    desc: 'Monthly residential lease to verified families or corporate executives.',
                    icon: Buildings
                  },
                  {
                    id: 'lease',
                    title: 'Commercial lease',
                    desc: 'Long term institutional lease for Grade A offices, retail, or industrial assets.',
                    icon: ShieldCheck
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.purpose === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, purpose: item.id })}
                      className={`p-6 rounded-3xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-navy bg-slate-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-navy mb-4 shadow-xs">
                        <Icon size={24} weight={isSelected ? 'fill' : 'regular'} className={isSelected ? 'text-brand-blue' : 'text-slate-500'} />
                      </div>
                      <div>
                        <span className="caption-1 font-bold text-brand-navy block mb-1">
                          {item.title}
                        </span>
                        <p className="caption-3 text-slate-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.purpose && <p className="caption-2 text-rose-500">{errors.purpose}</p>}
            </div>
          )}

          {/* =====================================================================
              STEP 2: PROPERTY TYPE
             ===================================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Select the structural category of the property
                </h3>
                <p className="caption-2 text-slate-500">
                  Ensure the selection matches official municipal and society sanction records.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  'Apartment',
                  'Villa',
                  'Independent house',
                  'Plot',
                  'Commercial property',
                  'Other'
                ].map((type) => {
                  const isSelected = formData.propertyType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: type })}
                      className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-navy bg-slate-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="caption-1 font-bold text-brand-navy block mb-0.5">
                        {type}
                      </span>
                      <span className="caption-3 text-slate-400">
                        {type === 'Apartment' && 'High rise residence or penthouse'}
                        {type === 'Villa' && 'Gated estate or standalone villa'}
                        {type === 'Independent house' && 'Freehold bungalow or row house'}
                        {type === 'Plot' && 'Residential or commercial parcel'}
                        {type === 'Commercial property' && 'Grade A office or retail shop'}
                        {type === 'Other' && 'Bespoke mixed use development'}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.propertyType && <p className="caption-2 text-rose-500">{errors.propertyType}</p>}
            </div>
          )}

          {/* =====================================================================
              STEP 3: PROPERTY DETAILS & SPECIFICATIONS
             ===================================================================== */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Property details and specifications
                </h3>
                <p className="caption-2 text-slate-500">
                  Provide verified dimensions and configurations supported by approved architectural drawings.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Property listing title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4 BHK Seafront Penthouse with Private Deck"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full p-3 rounded-2xl border ${
                    errors.title ? 'border-rose-500' : 'border-slate-200'
                  } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                />
                {errors.title && <p className="caption-3 text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Area Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Carpet area (sq ft) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2,450"
                    value={formData.carpetArea}
                    onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.carpetArea ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  <span className="caption-3 text-slate-400 mt-1 block">RERA compliant net usable floor space</span>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Built up area (sq ft)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3,100"
                    value={formData.builtUpArea}
                    onChange={(e) => setFormData({ ...formData, builtUpArea: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                  <span className="caption-3 text-slate-400 mt-1 block">Including walls and external conduits</span>
                </div>
              </div>

              {/* Bedrooms & Bathrooms (If residential) */}
              {formData.propertyType !== 'Plot' && formData.propertyType !== 'Commercial property' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Bedrooms</label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    >
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4 BHK</option>
                      <option>5+ BHK</option>
                      <option>Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Bathrooms</label>
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </div>

                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Furnishing</label>
                    <select
                      value={formData.furnishing}
                      onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    >
                      <option>Unfurnished</option>
                      <option>Semi furnished</option>
                      <option>Fully furnished</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Floor & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Floor number</label>
                  <input
                    type="text"
                    placeholder="e.g. 14"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Total floors</label>
                  <input
                    type="text"
                    placeholder="e.g. 32"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Age of property</label>
                  <select
                    value={formData.propertyAge}
                    onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    <option>Under construction</option>
                    <option>Ready to move</option>
                    <option>0 to 1 year</option>
                    <option>1 to 5 years</option>
                    <option>5 to 10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    <option>Immediate</option>
                    <option>Within 15 days</option>
                    <option>Within 30 days</option>
                    <option>Specific date</option>
                  </select>
                </div>
              </div>

              {/* Property Attributes: Facing, Parking, Balconies */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Facing orientation</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    <option>East</option>
                    <option>North</option>
                    <option>North East</option>
                    <option>West</option>
                    <option>South</option>
                  </select>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Reserved parking</label>
                  <select
                    value={formData.parkingSlots}
                    onChange={(e) => setFormData({ ...formData, parkingSlots: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    <option>1 covered</option>
                    <option>2 covered</option>
                    <option>3+ covered</option>
                    <option>Open parking</option>
                    <option>None</option>
                  </select>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Power backup</label>
                  <select
                    value={formData.powerBackup}
                    onChange={(e) => setFormData({ ...formData, powerBackup: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    <option>100% full backup</option>
                    <option>Partial backup</option>
                    <option>None</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Full property description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the architectural highlights, interior specifications, view unobstructed angles, and society credentials..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-3 rounded-2xl border ${
                    errors.description ? 'border-rose-500' : 'border-slate-200'
                  } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue resize-none`}
                />
                {errors.description && <p className="caption-3 text-rose-500 mt-1">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 4: LOCATION AND TERRITORY
             ===================================================================== */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Property location and address
                </h3>
                <p className="caption-2 text-slate-500">
                  Accurate locality details ensure correct discovery by buyers looking in specific catchment areas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value={formData.country}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  >
                    {CITIES.filter((c) => c !== 'All cities').map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Locality or neighborhood *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Worli Sea Face, Bandra West, Whitefield"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.locality ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.locality && <p className="caption-3 text-rose-500 mt-1">{errors.locality}</p>}
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Postal PIN code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 400018"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  Full address (Building, Wing, Road) *
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tower 2, Horizon Promenade, Dr. Annie Besant Road"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className={`w-full p-3 rounded-2xl border ${
                    errors.fullAddress ? 'border-rose-500' : 'border-slate-200'
                  } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue resize-none`}
                />
                {errors.fullAddress && <p className="caption-3 text-rose-500 mt-1">{errors.fullAddress}</p>}
              </div>

              {/* Map Locator Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-blue">
                    <MapPin size={22} weight="fill" className="text-brand-gold" />
                  </div>
                  <div>
                    <span className="caption-1 font-bold text-brand-navy block">
                      Geographic pin preview
                    </span>
                    <span className="caption-3 text-slate-500">
                      Coordinates mapped to {formData.locality || formData.city}, India
                    </span>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">
                  <span>Coordinates verified</span>
                </Badge>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 5: PRICING AND CHARGES
             ===================================================================== */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Pricing and commercial terms
                </h3>
                <p className="caption-2 text-slate-500">
                  Transparent price breakdowns prevent negotiation delays and ensure genuine buyer qualification.
                </p>
              </div>

              {formData.purpose === 'sell' && (
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Expected sale price *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 8.50 Cr or ₹ 95.00 L"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.expectedPrice ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.expectedPrice && <p className="caption-3 text-rose-500 mt-1">{errors.expectedPrice}</p>}
                </div>
              )}

              {formData.purpose === 'rent' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">
                      Monthly rent *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 1.85 L / month"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className={`w-full p-3 rounded-2xl border ${
                        errors.monthlyRent ? 'border-rose-500' : 'border-slate-200'
                      } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                    />
                    {errors.monthlyRent && <p className="caption-3 text-rose-500 mt-1">{errors.monthlyRent}</p>}
                  </div>

                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">
                      Security deposit *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 10.00 L"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      className={`w-full p-3 rounded-2xl border ${
                        errors.securityDeposit ? 'border-rose-500' : 'border-slate-200'
                      } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                    />
                    {errors.securityDeposit && <p className="caption-3 text-rose-500 mt-1">{errors.securityDeposit}</p>}
                  </div>
                </div>
              )}

              {formData.purpose === 'lease' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">
                      Lease rate per sq ft
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 155 / sq ft / month"
                      value={formData.leaseRatePerSqFt}
                      onChange={(e) => setFormData({ ...formData, leaseRatePerSqFt: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">
                      Security deposit (months)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 months rent"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">
                      Lease duration
                    </label>
                    <select
                      value={formData.leaseDuration}
                      onChange={(e) => setFormData({ ...formData, leaseDuration: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    >
                      <option>12 months</option>
                      <option>24 months</option>
                      <option>36 months</option>
                      <option>60 months</option>
                      <option>9 years</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Maintenance Charges & Negotiable Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Maintenance charges (monthly)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 18,500 / month or Included"
                    value={formData.maintenanceCharges}
                    onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isNegotiable}
                      onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                      className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="font-semibold text-brand-navy">
                      Valuation is negotiable for qualified buyers
                    </span>
                  </label>
                </div>
              </div>

              {/* Other applicable charges */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-3">
                <span className="caption-1 font-semibold text-brand-navy block">
                  Other applicable charges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Charge label, e.g. Society transfer and club fee"
                    value={formData.otherChargesLabel}
                    onChange={(e) => setFormData({ ...formData, otherChargesLabel: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-brand-navy"
                  />
                  <input
                    type="text"
                    placeholder="e.g. ₹ 3.50 L"
                    value={formData.otherChargesAmount}
                    onChange={(e) => setFormData({ ...formData, otherChargesAmount: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-brand-navy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 6: MEDIA AND ARCHITECTURAL PLANS
             ===================================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Upload property photography and media
                </h3>
                <p className="caption-2 text-slate-500">
                  High resolution photography increases site visit requests by 300%. Formats: JPEG, PNG, or WebP up to 10MB each.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="p-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-3 relative">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-brand-blue mx-auto">
                  <UploadSimple size={24} />
                </div>
                <div>
                  <p className="caption-1 font-bold text-brand-navy">
                    Click to browse or drop property images here
                  </p>
                  <p className="caption-3 text-slate-400 mt-0.5">
                    JPEG, PNG, or WebP up to 10MB per file
                  </p>
                </div>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between caption-3 text-slate-500">
                    <span>Uploading media...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-blue transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {uploadError && <p className="caption-2 text-rose-500 font-semibold">{uploadError}</p>}
              {errors.images && <p className="caption-2 text-rose-500 font-semibold">{errors.images}</p>}

              {/* Uploaded Images Grid */}
              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="caption-1 font-semibold text-brand-navy">
                      Attached photos ({formData.images.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ...SAMPLE_PRESET_IMAGES] })}
                      className="caption-3 text-brand-blue font-semibold hover:underline cursor-pointer"
                    >
                      + Add luxury sample photos
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.images.map((imgUrl, idx) => {
                      const isCover = formData.coverImageIndex === idx;
                      return (
                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200">
                          <img src={imgUrl} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {isCover && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#C5A46D] text-brand-navy text-[10px] font-bold shadow-xs">
                              Cover photo
                            </span>
                          )}

                          <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(idx)}
                                className="p-1.5 rounded-lg bg-white/90 text-brand-navy hover:bg-white text-[10px] font-bold cursor-pointer"
                                title="Make cover photo"
                              >
                                Set cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                              title="Remove image"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Floor Plans & Video Tour Link */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Floor plan layout
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-brand-navy cursor-pointer transition-colors inline-block">
                      <span>Upload architectural floor plan</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFloorPlanUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.floorPlans.length > 0 && (
                      <span className="caption-3 text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle size={14} weight="fill" />
                        <span>Attached</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Video tour link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. YouTube or Matterport walkthrough link"
                    value={formData.videoTourUrl}
                    onChange={(e) => setFormData({ ...formData, videoTourUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 7: OWNER / AGENT INFORMATION
             ===================================================================== */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Owner and representative contact details
                </h3>
                <p className="caption-2 text-slate-500">
                  Every submission is linked to a verified individual or RERA certified firm.
                </p>
              </div>

              {/* Submitter Role */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-2">
                  I am submitting this property as an:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    'Owner',
                    'Licensed Agent',
                    'Builder or Developer'
                  ].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, submitterRole: role })}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        formData.submitterRole === role
                          ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submitter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Full name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your legal name"
                    value={formData.submitterName}
                    onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.submitterName ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.submitterName && <p className="caption-3 text-rose-500 mt-1">{errors.submitterName}</p>}
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Phone number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.submitterPhone}
                    onChange={(e) => setFormData({ ...formData, submitterPhone: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.submitterPhone ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.submitterPhone && <p className="caption-3 text-rose-500 mt-1">{errors.submitterPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.submitterEmail}
                    onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.submitterEmail ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.submitterEmail && <p className="caption-3 text-rose-500 mt-1">{errors.submitterEmail}</p>}
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">
                    Company or agency name {formData.submitterRole !== 'Owner' && '*'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prestige Advisors or DLF Living"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.companyName ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.companyName && <p className="caption-3 text-rose-500 mt-1">{errors.companyName}</p>}
                </div>
              </div>

              {/* RERA Number */}
              <div>
                <label className="caption-1 font-semibold text-brand-navy block mb-1">
                  RERA certificate number (optional for individual owners)
                </label>
                <input
                  type="text"
                  placeholder="e.g. P51900008492"
                  value={formData.reraNumber}
                  onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                />
                <span className="caption-3 text-slate-400 mt-1 block">
                  Mandatory for commercial promoters and registered brokers under state RERA guidelines.
                </span>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 8: REVIEW AND SUBMISSION
             ===================================================================== */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="title-2 text-brand-navy font-bold mb-1">
                  Review listing summary before submission
                </h3>
                <p className="caption-2 text-slate-500">
                  Carefully inspect each section. Use the edit actions to adjust any values before sending for verification.
                </p>
              </div>

              {/* Review Section 1: Purpose & Type */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Goal and category
                  </span>
                  <p className="caption-1 font-bold text-brand-navy">
                    {formData.purpose.toUpperCase()} • {formData.propertyType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(1)}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Review Section 2: Specifications */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Property specifications
                  </span>
                  <p className="title-3 font-bold text-brand-navy">{formData.title}</p>
                  <p className="caption-2 text-slate-600">
                    Carpet area: <strong className="text-brand-navy">{formData.carpetArea || '2,400'} sq ft</strong> • {formData.bedrooms} • {formData.bathrooms} bathrooms • {formData.furnishing}
                  </p>
                  <p className="caption-3 text-slate-500 line-clamp-2 mt-1">
                    {formData.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(3)}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Review Section 3: Location */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Territory and address
                  </span>
                  <p className="caption-1 font-bold text-brand-navy">
                    {formData.locality}, {formData.city}, {formData.state} {formData.pincode ? `• PIN: ${formData.pincode}` : ''}
                  </p>
                  <p className="caption-2 text-slate-500">{formData.fullAddress}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(4)}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Review Section 4: Pricing */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Declared commercial valuation
                  </span>
                  <p className="heading-4 font-bold text-brand-navy">
                    {formData.expectedPrice || formData.monthlyRent || 'Valuation evaluated on call'}
                  </p>
                  <p className="caption-2 text-slate-500">
                    Negotiable: {formData.isNegotiable ? 'Yes' : 'Fixed'} • Maintenance: {formData.maintenanceCharges || 'Included'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(5)}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Review Section 5: Media Preview */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Attached media ({formData.images.length} photos)
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    {formData.images.slice(0, 4).map((url, i) => (
                      <img key={i} src={url} alt="Thumb" className="w-12 h-10 rounded-lg object-cover border border-slate-200" />
                    ))}
                    {formData.images.length > 4 && (
                      <span className="caption-2 font-bold text-slate-500">+{formData.images.length - 4} more</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(6)}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Review Section 6: Submitter */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Submitter credentials
                  </span>
                  <p className="caption-1 font-bold text-brand-navy">
                    {formData.submitterName} ({formData.submitterRole})
                  </p>
                  <p className="caption-2 text-slate-500">
                    {formData.submitterPhone} • {formData.submitterEmail}
                    {formData.companyName ? ` • ${formData.companyName}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(7)}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Regulatory Notice per PRD 5.9 */}
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs leading-relaxed flex items-start gap-3">
                <ShieldCheck size={20} weight="fill" className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Verification moderation checkpoint</p>
                  <p className="text-amber-800">
                    Important: Submission does not automatically mean that a property is verified or published. Verification and publication must follow the moderation process.
                  </p>
                </div>
              </div>

              {/* Legal Checkboxes */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.agreeTruthful}
                      onChange={(e) => setFormData({ ...formData, agreeTruthful: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span>
                      I confirm that all listing details, carpet area dimensions, and ownership disclosures are truthful and accurate to the best of my knowledge. *
                    </span>
                  </label>
                  {errors.agreeTruthful && <p className="caption-3 text-rose-500 mt-1">{errors.agreeTruthful}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.agreePrivacy}
                      onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span>
                      I agree to the EstateOne listing terms of service and consent to verification phone calls and document screening by licensed compliance officers. *
                    </span>
                  </label>
                  {errors.agreePrivacy && <p className="caption-3 text-rose-500 mt-1">{errors.agreePrivacy}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Nav Buttons Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border-slate-200 text-brand-navy hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Previous step</span>
              </Button>
            ) : <div />}

            {currentStep < 8 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to step {currentStep + 1}</span>
                <ArrowRight size={15} />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitListing}
                className="px-8 py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <ShieldCheck size={16} weight="bold" />
                <span>{isSubmitting ? 'Submitting for review...' : 'Submit listing for verification'}</span>
              </Button>
            )}
          </div>

        </Card>
      )}

    </div>
  );
}
