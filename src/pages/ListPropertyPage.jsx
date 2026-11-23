import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  HouseLine, 
  Buildings, 
  CurrencyInr, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle,
  FloppyDisk,
  Trash,
  User,
  Phone,
  Envelope,
  VideoCamera,
  Star,
  WarningCircle,
  PencilSimple,
  Sparkle,
  UploadSimple,
  Check
} from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { PROPERTY_TYPES } from '../data/properties';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ListingStatusTracker from '../components/listing/ListingStatusTracker';
import MySubmissionsView from '../components/listing/MySubmissionsView';
import ListPropertyPageHeader from '../components/listing/ListPropertyPageHeader';
import ListPropertyAuthGate from '../components/listing/ListPropertyAuthGate';
import ListingWizardStepper from '../components/listing/ListingWizardStepper';
import ListingWizardFooter from '../components/listing/ListingWizardFooter';
import ListingPurposeOptions from '../components/listing/ListingPurposeOptions';
import ListingPropertyTypeOptions from '../components/listing/ListingPropertyTypeOptions';
import ListingPropertyDetailsStep from '../components/listing/ListingPropertyDetailsStep';
import ListingPropertyLocationStep from '../components/listing/ListingPropertyLocationStep';
import {
  reconcileErrorsAfterPatch,
  reconcileFieldOnBlur,
} from '../components/listing/listingWizardFieldValidation';
import ListingWizardPanel from '../components/listing/ListingWizardPanel';
import ListingSubmissionSuccess from '../components/listing/ListingSubmissionSuccess';
import { PhoneInput } from '../components/ui/phone-input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { formatPhoneDisplay, isValidPhone } from '../lib/phone';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { DUMMY_FLOOR_PLANS } from '../lib/propertyMedia';

const SAMPLE_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
];

const SAMPLE_FLOOR_PLAN = DUMMY_FLOOR_PLANS[0];

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
  const formDataRef = useRef(formData);
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

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

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

  const applyWizardPatch = (patch) => {
    setFormData((prev) => {
      const next = { ...prev, ...patch };
      formDataRef.current = next;
      setErrors((errs) => reconcileErrorsAfterPatch(currentStep, errs, next, Object.keys(patch)));
      return next;
    });
  };

  const handleWizardFieldBlur = (field) => {
    setErrors((errs) => reconcileFieldOnBlur(currentStep, errs, formDataRef.current, field));
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
      if (!isValidPhone(formData.submitterPhone)) {
        errs.submitterPhone = 'Please enter a valid mobile number for the selected country.';
      }
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
    const res = login('demo2@estateone.in', 'Password@123');
    if (res.success) {
      toastSuccess('Signed in', 'Listing wizard unlocked.');
    } else {
      toastInfo('Sign in required', 'Create an account or use demo2@estateone.in with Password@123.');
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full">
      <Breadcrumbs
        items={[
          { label: 'Seller portal', href: '/list-property' },
          { label: 'List your property' },
        ]}
        className="mb-2"
      />

      <ListPropertyPageHeader
        activeTab={activeTab === 'submissions' ? 'submissions' : 'wizard'}
        submissionsCount={submissions.length}
        showWizardTab={!submittedReference}
        onTabChange={(value) => {
          if (value === 'wizard') {
            setActiveTab('wizard');
            setSubmittedReference(null);
          } else {
            setActiveTab('submissions');
          }
        }}
      />

      {/* Unsaved Draft Banner */}
      {draftPrompt && activeTab === 'wizard' && !submittedReference && (
        <Alert
          variant="info"
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <FloppyDisk size={22} className="text-brand-blue shrink-0 mt-0.5" weight="fill" aria-hidden />
            <div>
              <AlertTitle>Pick up where you left off</AlertTitle>
              <AlertDescription>
                <p>
                  Draft saved on{' '}
                  {new Date(draftPrompt.savedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  . Resume or start fresh.
                </p>
              </AlertDescription>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleDiscardDraft}>
              Start fresh
            </Button>
            <Button type="button" size="sm" onClick={handleResumeDraft}>
              Resume draft
            </Button>
          </div>
        </Alert>
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
          <ListingSubmissionSuccess
            referenceId={submittedReference}
            submitterName={formData.submitterName}
            listingTitle={formData.title}
            purpose={formData.purpose}
            propertyType={formData.propertyType}
            city={formData.city}
            locality={formData.locality}
            onTrackSubmissions={() => setActiveTab('submissions')}
            onSubmitAnother={handleResetForNew}
          />

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
        <ListPropertyAuthGate
          onSignIn={() => {
            saveIntendedDestination('/list-property');
            navigate('/login');
          }}
          onRegister={() => {
            saveIntendedDestination('/list-property');
            navigate('/register');
          }}
          onDemoLogin={handleQuickDemoLogin}
        />
      ) : (
        /* =========================================================================
            VIEW D: 8-STEP LISTING WIZARD
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
          <ListingWizardStepper
            className="lg:col-span-4 xl:col-span-3 order-1 lg:order-none"
            currentStep={currentStep}
            onSaveDraft={handleSaveDraft}
          />

          <ListingWizardPanel
            className="lg:col-span-8 xl:col-span-9 order-2 lg:order-none"
            currentStep={currentStep}
            footer={
              <ListingWizardFooter
                currentStep={currentStep}
                totalSteps={8}
                isSubmitting={isSubmitting}
                onPrev={handlePrev}
                onNext={handleNext}
                onSubmit={handleSubmitListing}
              />
            }
          >

          {/* =====================================================================
              STEP 1: LISTING PURPOSE (Sell, Rent, Lease)
             ===================================================================== */}
          {currentStep === 1 && (
            <ListingPurposeOptions
              value={formData.purpose}
              onChange={(purpose) => applyWizardPatch({ purpose })}
              error={errors.purpose}
            />
          )}

          {/* =====================================================================
              STEP 2: PROPERTY TYPE
             ===================================================================== */}
          {currentStep === 2 && (
            <ListingPropertyTypeOptions
              value={formData.propertyType}
              onChange={(propertyType) => applyWizardPatch({ propertyType })}
              error={errors.propertyType}
            />
          )}

          {/* =====================================================================
              STEP 3: PROPERTY DETAILS & SPECIFICATIONS
             ===================================================================== */}
          {currentStep === 3 && (
            <ListingPropertyDetailsStep
              formData={formData}
              errors={errors}
              onPatch={applyWizardPatch}
              onFieldBlur={handleWizardFieldBlur}
            />
          )}

          {/* =====================================================================
              STEP 4: LOCATION AND TERRITORY
             ===================================================================== */}
          {currentStep === 4 && (
            <ListingPropertyLocationStep
              formData={formData}
              errors={errors}
              onPatch={applyWizardPatch}
              onFieldBlur={handleWizardFieldBlur}
            />
          )}

          {/* =====================================================================
              STEP 5: PRICING AND CHARGES
             ===================================================================== */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="wizard-step-heading text-h4 font-semibold text-brand-navy mb-1">
                  Pricing and commercial terms
                </h3>
                <p className="wizard-step-lead text-caption font-normal text-slate-500">
                  Transparent price breakdowns prevent negotiation delays and ensure genuine buyer qualification.
                </p>
              </div>

              {formData.purpose === 'sell' && (
                <div>
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Expected sale price *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 8.50 Cr or ₹ 95.00 L"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.expectedPrice ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.expectedPrice && <p className="wizard-field-error mt-1">{errors.expectedPrice}</p>}
                </div>
              )}

              {formData.purpose === 'rent' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                      Monthly rent *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 1.85 L / month"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className={`w-full p-3 rounded-2xl border ${
                        errors.monthlyRent ? 'border-rose-500' : 'border-slate-200'
                      } bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white focus:outline-none focus:border-brand-blue`}
                    />
                    {errors.monthlyRent && <p className="wizard-field-error mt-1">{errors.monthlyRent}</p>}
                  </div>

                  <div>
                    <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                      Security deposit *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 10.00 L"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      className={`w-full p-3 rounded-2xl border ${
                        errors.securityDeposit ? 'border-rose-500' : 'border-slate-200'
                      } bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white focus:outline-none focus:border-brand-blue`}
                    />
                    {errors.securityDeposit && <p className="wizard-field-error mt-1">{errors.securityDeposit}</p>}
                  </div>
                </div>
              )}

              {formData.purpose === 'lease' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                      Lease rate per sq ft
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 155 / sq ft / month"
                      value={formData.leaseRatePerSqFt}
                      onChange={(e) => setFormData({ ...formData, leaseRatePerSqFt: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                      Security deposit (months)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 months rent"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                      Lease duration
                    </label>
                    <select
                      value={formData.leaseDuration}
                      onChange={(e) => setFormData({ ...formData, leaseDuration: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white"
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
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Maintenance charges (monthly)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 18,500 / month or Included"
                    value={formData.maintenanceCharges}
                    onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white"
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
                <span className="text-small font-medium text-brand-navy block">
                  Other applicable charges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Charge label, e.g. Society transfer and club fee"
                    value={formData.otherChargesLabel}
                    onChange={(e) => setFormData({ ...formData, otherChargesLabel: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-brand-navy listing-wizard-field-control"
                  />
                  <input
                    type="text"
                    placeholder="e.g. ₹ 3.50 L"
                    value={formData.otherChargesAmount}
                    onChange={(e) => setFormData({ ...formData, otherChargesAmount: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-brand-navy listing-wizard-field-control"
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
                <h3 className="wizard-step-heading text-h4 font-semibold text-brand-navy mb-1">
                  Upload property photography and media
                </h3>
                <p className="wizard-step-lead text-caption font-normal text-slate-500">
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
                  <p className="text-small font-semibold text-brand-navy">
                    Click to browse or drop property images here
                  </p>
                  <p className="wizard-field-hint text-caption text-slate-400 mt-0.5">
                    JPEG, PNG, or WebP up to 10MB per file
                  </p>
                </div>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-caption text-slate-500">
                    <span>Uploading media...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-blue transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {uploadError && <p className="wizard-field-error font-medium">{uploadError}</p>}
              {errors.images && <p className="wizard-field-error font-medium">{errors.images}</p>}

              {/* Uploaded Images Grid */}
              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-medium text-brand-navy">
                      Attached photos ({formData.images.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ...SAMPLE_PRESET_IMAGES] })}
                      className="text-caption font-medium text-brand-blue hover:underline cursor-pointer"
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
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#C5A46D] text-brand-navy text-caption font-bold shadow-xs">
                              Cover photo
                            </span>
                          )}

                          <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(idx)}
                                className="p-1.5 rounded-lg bg-white/90 text-brand-navy hover:bg-white text-caption font-bold cursor-pointer"
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
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Floor plan layout
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="min-h-10 button-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-brand-navy cursor-pointer transition-colors inline-block">
                      <span>Upload architectural floor plan</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFloorPlanUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.floorPlans.length > 0 && (
                      <span className="text-caption font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle size={14} weight="fill" />
                        <span>Attached</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Video tour link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. YouTube or Matterport walkthrough link"
                    value={formData.videoTourUrl}
                    onChange={(e) => setFormData({ ...formData, videoTourUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white"
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
                <h3 className="wizard-step-heading text-h4 font-semibold text-brand-navy mb-1">
                  Owner and representative contact details
                </h3>
                <p className="wizard-step-lead text-caption font-normal text-slate-500">
                  Every submission is linked to a verified individual or RERA certified firm.
                </p>
              </div>

              {/* Submitter Role */}
              <div>
                <label className="wizard-field-label text-small font-medium text-brand-navy block mb-2">
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
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Full name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your legal name"
                    value={formData.submitterName}
                    onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.submitterName ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.submitterName && <p className="wizard-field-error mt-1">{errors.submitterName}</p>}
                </div>

                <div>
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Phone number *
                  </label>
                  <PhoneInput
                    id="submitter-phone"
                    value={formData.submitterPhone}
                    onChange={(e) => applyWizardPatch({ submitterPhone: e.target.value })}
                    aria-invalid={Boolean(errors.submitterPhone)}
                    className={errors.submitterPhone ? 'border-rose-500' : 'border-slate-200'}
                    inputClassName="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />
                  {errors.submitterPhone && <p className="wizard-field-error mt-1">{errors.submitterPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.submitterEmail}
                    onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.submitterEmail ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.submitterEmail && <p className="wizard-field-error mt-1">{errors.submitterEmail}</p>}
                </div>

                <div>
                  <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                    Company or agency name {formData.submitterRole !== 'Owner' && '*'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prestige Advisors or DLF Living"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={`w-full p-3 rounded-2xl border ${
                      errors.companyName ? 'border-rose-500' : 'border-slate-200'
                    } bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white focus:outline-none focus:border-brand-blue`}
                  />
                  {errors.companyName && <p className="wizard-field-error mt-1">{errors.companyName}</p>}
                </div>
              </div>

              {/* RERA Number */}
              <div>
                <label className="wizard-field-label text-small font-medium text-brand-navy block mb-1">
                  RERA certificate number (optional for individual owners)
                </label>
                <input
                  type="text"
                  placeholder="e.g. P51900008492"
                  value={formData.reraNumber}
                  onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-brand-navy listing-wizard-field-control focus:bg-white"
                />
                <span className="wizard-field-hint text-caption text-slate-400 mt-1 block">
                  Mandatory for commercial promoters and registered brokers under state RERA guidelines.
                </span>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 8: REVIEW AND SUBMISSION
             ===================================================================== */}
          {currentStep === 8 && (
            <div className="wizard-review">
              <div className="wizard-step-intro">
                <h3 className="wizard-step-heading">Review listing summary before submission</h3>
                <p className="wizard-step-lead">
                  Carefully inspect each section. Use the edit actions to adjust any values before sending for
                  verification.
                </p>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-card__body">
                  <span className="wizard-review-label">Goal and category</span>
                  <p className="wizard-review-value">
                    {formData.purpose.toUpperCase()} • {formData.propertyType}
                  </p>
                </div>
                <button type="button" onClick={() => handleJumpToStep(1)} className="wizard-review-edit">
                  <PencilSimple size={14} weight="bold" aria-hidden />
                  <span>Edit</span>
                </button>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-card__body wizard-review-card__body--stack">
                  <span className="wizard-review-label">Property specifications</span>
                  <p className="wizard-review-value wizard-review-value--title">{formData.title}</p>
                  <p className="wizard-review-meta">
                    Carpet area: <strong className="text-brand-navy">{formData.carpetArea || '2,400'} sq ft</strong> •{' '}
                    {formData.bedrooms} • {formData.bathrooms} bathrooms • {formData.furnishing}
                  </p>
                  <p className="wizard-review-meta wizard-review-meta--muted wizard-review-meta--clamp">
                    {formData.description}
                  </p>
                </div>
                <button type="button" onClick={() => handleJumpToStep(3)} className="wizard-review-edit">
                  <PencilSimple size={14} weight="bold" aria-hidden />
                  <span>Edit</span>
                </button>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-card__body wizard-review-card__body--stack">
                  <span className="wizard-review-label">Territory and address</span>
                  <p className="wizard-review-value">
                    {formData.locality}, {formData.city}, {formData.state}{' '}
                    {formData.pincode ? `• PIN: ${formData.pincode}` : ''}
                  </p>
                  <p className="wizard-review-meta wizard-review-meta--muted">{formData.fullAddress}</p>
                </div>
                <button type="button" onClick={() => handleJumpToStep(4)} className="wizard-review-edit">
                  <PencilSimple size={14} weight="bold" aria-hidden />
                  <span>Edit</span>
                </button>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-card__body wizard-review-card__body--stack">
                  <span className="wizard-review-label">Declared commercial valuation</span>
                  <p className="wizard-review-value wizard-review-value--price">
                    {formData.expectedPrice || formData.monthlyRent || 'Valuation evaluated on call'}
                  </p>
                  <p className="wizard-review-meta wizard-review-meta--muted">
                    Negotiable: {formData.isNegotiable ? 'Yes' : 'Fixed'} • Maintenance:{' '}
                    {formData.maintenanceCharges || 'Included'}
                  </p>
                </div>
                <button type="button" onClick={() => handleJumpToStep(5)} className="wizard-review-edit">
                  <PencilSimple size={14} weight="bold" aria-hidden />
                  <span>Edit</span>
                </button>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-card__body">
                  <span className="wizard-review-label">Attached media ({formData.images.length} photos)</span>
                  <div className="wizard-review-thumbs">
                    {formData.images.slice(0, 4).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                    {formData.images.length > 4 && (
                      <span className="wizard-review-more">+{formData.images.length - 4} more</span>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => handleJumpToStep(6)} className="wizard-review-edit">
                  <PencilSimple size={14} weight="bold" aria-hidden />
                  <span>Edit</span>
                </button>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-card__body wizard-review-card__body--stack">
                  <span className="wizard-review-label">Submitter credentials</span>
                  <p className="wizard-review-value">
                    {formData.submitterName} ({formData.submitterRole})
                  </p>
                  <p className="wizard-review-meta wizard-review-meta--muted">
                    {formatPhoneDisplay(formData.submitterPhone) || formData.submitterPhone} • {formData.submitterEmail}
                    {formData.companyName ? ` • ${formData.companyName}` : ''}
                  </p>
                </div>
                <button type="button" onClick={() => handleJumpToStep(7)} className="wizard-review-edit">
                  <PencilSimple size={14} weight="bold" aria-hidden />
                  <span>Edit</span>
                </button>
              </div>

              <div className="wizard-review-notice">
                <ShieldCheck size={20} weight="fill" className="text-amber-700 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="wizard-review-notice__title">Verification moderation checkpoint</p>
                  <p className="wizard-review-notice__body">
                    Important: Submission does not automatically mean that a property is verified or published.
                    Verification and publication must follow the moderation process.
                  </p>
                </div>
              </div>

              <div className="wizard-review-legal">
                <div className="space-y-1">
                  <div className="wizard-review-legal__row">
                    <Checkbox
                      id="listing-agree-truthful"
                      checked={formData.agreeTruthful}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreeTruthful: checked === true })
                      }
                      className="mt-0.5"
                      aria-invalid={Boolean(errors.agreeTruthful)}
                    />
                    <Label htmlFor="listing-agree-truthful" className="wizard-review-legal__label font-normal">
                      I confirm that all listing details, carpet area dimensions, and ownership disclosures are truthful
                      and accurate to the best of my knowledge. *
                    </Label>
                  </div>
                  {errors.agreeTruthful && <p className="wizard-field-error mt-1">{errors.agreeTruthful}</p>}
                </div>

                <div className="space-y-1">
                  <div className="wizard-review-legal__row">
                    <Checkbox
                      id="listing-agree-privacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreePrivacy: checked === true })
                      }
                      className="mt-0.5"
                      aria-invalid={Boolean(errors.agreePrivacy)}
                    />
                    <Label htmlFor="listing-agree-privacy" className="wizard-review-legal__label font-normal">
                      I agree to the EstateOne listing terms of service and consent to verification phone calls and
                      document screening by licensed compliance officers. *
                    </Label>
                  </div>
                  {errors.agreePrivacy && <p className="wizard-field-error mt-1">{errors.agreePrivacy}</p>}
                </div>
              </div>
            </div>
          )}

          </ListingWizardPanel>
        </div>
      )}

    </div>
  );
}
