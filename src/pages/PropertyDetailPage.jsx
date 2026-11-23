import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { PhoneInput } from '../components/ui/phone-input';
import { formatPhoneDisplay, isValidPhone } from '../lib/phone';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  ShareNetwork, 
  Heart, 
  Scales, 
  CalendarCheck, 
  ChatCircleText, 
  CheckCircle, 
  Bed, 
  Bathtub, 
  ArrowsOut, 
  Info, 
  Phone,
  FileText,
  Flag,
  Blueprint,
  VideoCamera,
  Compass,
  Buildings,
  Car,
  Check,
  WarningCircle,
  GraduationCap,
  FirstAid,
  AirplaneTilt,
  ShoppingBag,
  Clock,
  User,
  Envelope,
  PaperPlaneTilt,
  PhoneCall
} from '@phosphor-icons/react';
import { getPropertyBySlug, SAMPLE_PROPERTIES } from '../data/properties';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import PropertyDetailHeader from '../components/property/PropertyDetailHeader';
import PropertyGallery from '../components/shared/PropertyGallery';
import PropertyCard from '../components/shared/PropertyCard';
import ReportListingModal from '../components/shared/ReportListingModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Alert, AlertDescription } from '../components/ui/alert';
import { DatePickerField } from '../components/ui/date-picker';
import { cn } from '../lib/utils';
import { getRentalPriceDisplay } from '../lib/rentalPrice';
import { getPropertyStatusBadgeClassOnPage } from '../lib/propertyStatusBadge';
import { getListingVideoTourUrl, getListingFloorPlanUrl } from '../lib/propertyMedia';

const PropertyLocationMap = lazy(() => import('../components/shared/PropertyLocationMap'));

const VISIT_TIME_SLOTS = ['10:00 AM', '02:30 PM', '05:00 PM'];

const CALLBACK_TIME_OPTIONS = [
  'Morning (10:00 AM to 01:00 PM)',
  'Afternoon (02:00 PM to 05:00 PM)',
  'Evening (05:00 PM to 08:00 PM)',
];

const detailFieldClass =
  'rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white aria-invalid:border-rose-400 aria-invalid:ring-rose-400/30';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const rawProperty = getPropertyBySlug(slug) || SAMPLE_PROPERTIES[0];
  
  const { 
    isSaved, 
    toggleSave, 
    isCompared, 
    toggleCompare, 
    openSiteVisit, 
    openEnquiry,
    markRecentlyViewed 
  } = useProperty();

  const { user } = useAuth();
  const { toastSuccess, toastInfo, toastError } = useToast();

  // Mark property as recently viewed per PRD 5.2, 5.3, 5.4
  useEffect(() => {
    if (rawProperty?.id) {
      markRecentlyViewed(rawProperty.id);
    }
  }, [rawProperty?.id, markRecentlyViewed]);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('enquiry'); // 'enquiry' | 'visit' | 'callback'
  
  // Enquiry form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState(
    `Hello, I am interested in ${rawProperty.title} (${rawProperty.city}). Please share verified documentation and pricing breakdown.`
  );
  const [consent, setConsent] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Site visit inline state
  const [visitDate, setVisitDate] = useState('');
  const [visitSlot, setVisitSlot] = useState('10:00 AM');
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);

  // Callback inline state
  const [callbackTime, setCallbackTime] = useState('Morning (10:00 AM to 01:00 PM)');
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);

  // Synchronize prefill if auth changes
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Derived property attributes per PRD 5.5
  const property = useMemo(() => {
    const isComm = rawProperty.intent === 'commercial' || rawProperty.type === 'Commercial' || rawProperty.category === 'commercial';
    const isRent = rawProperty.intent === 'rent';
    const areaVal = rawProperty.areaSqFt || 2000;
    
    return {
      ...rawProperty,
      isCommercial: isComm,
      isRental: isRent,
      propertyId: `EST-${rawProperty.id.replace('prop-', '').toUpperCase().padStart(4, '0')}`,
      postedDateText: `Posted ${rawProperty.postedDaysAgo || 3} days ago`,
      carpetArea: `${Math.round(areaVal * 0.78).toLocaleString()} sq ft`,
      superBuiltUpArea: rawProperty.area || `${areaVal.toLocaleString()} sq ft`,
      balconyArea: `${Math.round(areaVal * 0.12).toLocaleString()} sq ft`,
      totalFloors: rawProperty.type === 'Villa' ? 'G + 2 Floors' : isComm ? '32 Floors' : '28 Floors',
      floorLevel: rawProperty.floorNumber || (rawProperty.type === 'Villa' ? 'Entire independent villa' : isComm ? 'Mid floor (12th)' : '16th Floor'),
      ageOfProperty: rawProperty.status === 'Under construction' ? 'Under construction' : 'Under 2 years',
      facingDirection: 'East facing (Vaastu compliant)',
      videoTourUrl: getListingVideoTourUrl(rawProperty),
      floorPlanImage: getListingFloorPlanUrl(rawProperty),
      highlights: [
        'Verified RERA registration certificate with verified title clearance',
        'Direct owner and principal advisor coordination with zero duplicate listings',
        'Sanctioned architectural layout, occupancy certificate, and fire NOC approved',
        '24x7 security personnel, biometric building access, and 100% power backup',
        'Dedicated car parking slots with electric vehicle charging provision'
      ],
      nearbyPlaces: {
        schools: [
          { name: 'The International School', distance: '1.4 km' },
          { name: 'Heritage Academy', distance: '2.8 km' }
        ],
        hospitals: [
          { name: 'Max Super Speciality Hospital', distance: '2.2 km' },
          { name: 'Apollo Health Center', distance: '3.5 km' }
        ],
        transport: [
          { name: 'Metro Station Corridor', distance: '700 m' },
          { name: 'International Airport Expressway', distance: '18 km' }
        ],
        shopping: [
          { name: 'Central Boulevard Mall', distance: '1.5 km' },
          { name: 'High Street Retail Plaza', distance: '800 m' }
        ]
      }
    };
  }, [rawProperty]);

  const saved = isSaved(property.id);
  const compared = isCompared(property.id);
  const rentalPrice = property.isRental ? getRentalPriceDisplay(rawProperty) : null;

  // Handle Share Action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `View ${property.title} in ${property.location} on EstateOne.`,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toastSuccess('Link copied', 'Property link copied to clipboard.');
    }
  };

  // Enquiry Validation and Submission (PRD 5.5 Property Enquiry Flow)
  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!isValidPhone(phone)) errors.phone = 'Please enter a valid mobile number for the selected country.';
    if (!email.trim() || !email.includes('@')) errors.email = 'Please enter a valid email address.';
    if (!consent) errors.consent = 'You must accept the privacy consent.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmittingEnquiry(true);

    setTimeout(() => {
      setIsSubmittingEnquiry(false);
      setEnquirySuccess(true);
      toastSuccess('Enquiry submitted', 'Your enquiry was sent to the property advisor.');
    }, 500);
  };

  // Site Visit Validation and Submission (PRD 5.5 Site Visit Scheduling Flow)
  const handleVisitSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!visitDate) errors.visitDate = 'Please select a preferred date.';
    if (!isValidPhone(phone)) errors.phone = 'Please enter a valid mobile number for the selected country.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmittingVisit(true);

    setTimeout(() => {
      setIsSubmittingVisit(false);
      setVisitSuccess(true);
      toastSuccess('Visit request submitted', 'Pending confirmation with listing agent.');
    }, 500);
  };

  // Callback Submission
  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setFormErrors({ phone: 'Please enter a valid mobile number for the selected country.' });
      return;
    }

    setFormErrors({});
    setIsSubmittingCallback(true);

    setTimeout(() => {
      setIsSubmittingCallback(false);
      setCallbackSuccess(true);
      toastSuccess('Callback requested', 'An advisor will call you during your selected window.');
    }, 500);
  };

  // Similar Properties per PRD 5.5 (Section J)
  const similarProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter(
      (p) => p.id !== property.id && (p.city === property.city || p.intent === property.intent)
    ).slice(0, 3);
  }, [property]);

  const parentRoute = property.isRental ? '/rent' : property.isCommercial ? '/commercial' : '/buy';
  const parentLabel = property.isRental ? 'Rent' : property.isCommercial ? 'Commercial' : 'Buy';

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* =========================================================================
          Section A: Breadcrumbs (Home > Category > City > Property Title)
         ========================================================================= */}
      <Breadcrumbs 
        items={[
          { label: parentLabel, href: parentRoute },
          { label: property.city, href: `${parentRoute}?city=${encodeURIComponent(property.city)}` },
          { label: property.title }
        ]} 
        className="mb-4" 
      />

      <PropertyDetailHeader
        property={property}
        saved={isSaved(property.id)}
        compared={isCompared(property.id)}
        onRequestVisit={() => openSiteVisit(property)}
        onEnquire={() => openEnquiry(property)}
        onToggleCompare={() => toggleCompare(property)}
        onToggleSave={() => toggleSave(property)}
        onShare={handleShare}
        onReport={() => setReportModalOpen(true)}
      />

      {/* =========================================================================
          Section B: Image Gallery & Lightbox (PRD 5.5)
         ========================================================================= */}
      <PropertyGallery 
        images={property.images} 
        title={property.title} 
        verified={property.verified}
        videoUrl={property.videoTourUrl}
        floorPlanImage={property.floorPlanImage}
        className="mb-10" 
      />

      {/* =========================================================================
          Main Layout: Left Specs & Content | Right Sticky Conversion Panel
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Columns: Specifications, Description, Amenities, Location, Floor Plan, Agent */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* =========================================================================
              Section D: Property Specifications (Category Relevant Only)
             ========================================================================= */}
          <section className="property-spec-panel p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <h2 className="property-spec-heading">
              Property specifications
            </h2>

            {/* Residential Specifications */}
            {!property.isCommercial && property.type !== 'Residential Plot' && (
              <div className="property-spec-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                <div className="property-spec-item">
                  <span className="property-spec-label">Bedrooms</span>
                  <span className="property-spec-value">{property.bedrooms || '3 BHK'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Bathrooms</span>
                  <span className="property-spec-value">{property.bathrooms || '3 Baths'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Carpet area</span>
                  <span className="property-spec-value">{property.carpetArea}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Super built up area</span>
                  <span className="property-spec-value">{property.superBuiltUpArea}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Property type</span>
                  <span className="property-spec-value">{property.type}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Floor number</span>
                  <span className="property-spec-value">{property.floorLevel}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Total floors</span>
                  <span className="property-spec-value">{property.totalFloors}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Furnishing</span>
                  <span className="property-spec-value">{property.furnishing || 'Furnished'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Facing</span>
                  <span className="property-spec-value">{property.facingDirection}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Property age</span>
                  <span className="property-spec-value">{property.ageOfProperty}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Possession status</span>
                  <span className="property-spec-value property-spec-value--accent">{property.status}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Rate estimate</span>
                  <span className="property-spec-value">{property.pricePerSqFt || 'Market price'}</span>
                </div>
              </div>
            )}

            {/* Commercial Specifications (PRD 5.4 & 5.5: No Bedrooms/Bathrooms) */}
            {property.isCommercial && (
              <div className="property-spec-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                <div className="property-spec-item">
                  <span className="property-spec-label">Super built up area</span>
                  <span className="property-spec-value">{property.superBuiltUpArea}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Carpet area</span>
                  <span className="property-spec-value">{property.carpetArea}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Category</span>
                  <span className="property-spec-value">{property.commercialCategory || 'Office spaces'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Building type</span>
                  <span className="property-spec-value">{property.buildingType || 'Grade A tech park'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Floor number</span>
                  <span className="property-spec-value">{property.floorLevel}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Fitout state</span>
                  <span className="property-spec-value">{property.furnishing || 'Warm shell'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Parking allocation</span>
                  <span className="property-spec-value">{property.parkingCount || 'Reserved slots'}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Power load capacity</span>
                  <span className="property-spec-value">{property.powerLoad || '100% DG backup'}</span>
                </div>
              </div>
            )}

            {/* Plot Specifications */}
            {property.type === 'Residential Plot' && (
              <div className="property-spec-grid grid grid-cols-2 sm:grid-cols-3">
                <div className="property-spec-item">
                  <span className="property-spec-label">Plot area</span>
                  <span className="property-spec-value">{property.superBuiltUpArea}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Dimensions</span>
                  <span className="property-spec-value">50 ft x 100 ft</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Zoning status</span>
                  <span className="property-spec-value">Freehold residential</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Facing</span>
                  <span className="property-spec-value">{property.facingDirection}</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Road width</span>
                  <span className="property-spec-value">40 feet asphalt road</span>
                </div>
                <div className="property-spec-item">
                  <span className="property-spec-label">Possession</span>
                  <span className="property-spec-value property-spec-value--accent">Immediate registration</span>
                </div>
              </div>
            )}
          </section>

          {/* =========================================================================
              Section E: Description and Key Highlights
             ========================================================================= */}
          <section className="property-detail-about space-y-5 p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <div>
              <h2 className="property-detail-section-heading">
                About this property
              </h2>
              <p className="property-detail-section-desc">
                {property.description}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="property-detail-subheading">
                Key property highlights
              </h3>
              <ul className="property-detail-highlight-list">
                {property.highlights.map((h, i) => (
                  <li key={i} className="property-detail-highlight-item">
                    <CheckCircle size={16} weight="fill" className="text-brand-blue shrink-0" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Title Notice */}
            <p className="property-detail-callout">
              Official RERA registration validated under certificate{' '}
              <span className="property-detail-callout-emphasis">{property.reraId}</span>. Legal deed
              verification, sanctioned municipal layout, and encumbrance checks cleared.
            </p>
          </section>

          {/* =========================================================================
              Section F: Amenities
             ========================================================================= */}
          <section className="property-detail-amenities p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <h2 className="property-detail-section-heading">
              Verified amenities
            </h2>
            <div className="property-detail-amenity-grid grid grid-cols-2 sm:grid-cols-3">
              {(property.amenities || []).map((amenity) => (
                <div key={amenity} className="property-detail-amenity-chip">
                  <CheckCircle size={16} weight="fill" className="text-brand-blue shrink-0" aria-hidden />
                  <span className="property-detail-amenity-label">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              Section G: Location & Neighbourhood Points of Interest
             ========================================================================= */}
          <section className="property-detail-location space-y-5 p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <div className="property-detail-location-header">
              <div className="min-w-0">
                <h2 className="property-detail-section-heading mb-0">
                  Location & neighbourhood
                </h2>
                <p className="property-detail-section-kicker">
                  {property.location}
                </p>
              </div>
              <Badge variant="neutral" className="property-detail-location-badge text-brand-navy">
                GPS Verified
              </Badge>
            </div>

            <Suspense
              fallback={
                <div
                  className="flex aspect-[21/9] min-h-[12rem] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-caption text-slate-500"
                  aria-hidden
                >
                  Loading map…
                </div>
              }
            >
              <PropertyLocationMap property={rawProperty} label={property.location} />
            </Suspense>

            {/* Verified Nearby Places Grid */}
            <div className="property-detail-poi-grid grid grid-cols-1 sm:grid-cols-2">
              <div className="property-detail-poi-card">
                <div className="property-detail-poi-title">
                  <GraduationCap size={16} className="text-brand-blue" aria-hidden />
                  <span>Nearby schools</span>
                </div>
                <div className="property-detail-poi-list">
                  {property.nearbyPlaces.schools.map((item, i) => (
                    <div key={i} className="property-detail-poi-row">
                      <span className="property-detail-poi-name">{item.name}</span>
                      <span className="property-detail-poi-distance">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="property-detail-poi-card">
                <div className="property-detail-poi-title">
                  <FirstAid size={16} className="text-rose-600" aria-hidden />
                  <span>Healthcare & hospitals</span>
                </div>
                <div className="property-detail-poi-list">
                  {property.nearbyPlaces.hospitals.map((item, i) => (
                    <div key={i} className="property-detail-poi-row">
                      <span className="property-detail-poi-name">{item.name}</span>
                      <span className="property-detail-poi-distance">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="property-detail-poi-card">
                <div className="property-detail-poi-title">
                  <AirplaneTilt size={16} className="text-brand-gold" aria-hidden />
                  <span>Transit & transport</span>
                </div>
                <div className="property-detail-poi-list">
                  {property.nearbyPlaces.transport.map((item, i) => (
                    <div key={i} className="property-detail-poi-row">
                      <span className="property-detail-poi-name">{item.name}</span>
                      <span className="property-detail-poi-distance">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="property-detail-poi-card">
                <div className="property-detail-poi-title">
                  <ShoppingBag size={16} className="text-emerald-600" aria-hidden />
                  <span>Shopping & lifestyle</span>
                </div>
                <div className="property-detail-poi-list">
                  {property.nearbyPlaces.shopping.map((item, i) => (
                    <div key={i} className="property-detail-poi-row">
                      <span className="property-detail-poi-name">{item.name}</span>
                      <span className="property-detail-poi-distance">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>

          {/* =========================================================================
              Section H: Floor Plans
             ========================================================================= */}
          <section className="property-detail-floorplan space-y-4 p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <div className="property-detail-section-header">
              <div className="min-w-0">
                <h2 className="property-detail-section-heading mb-0">
                  Sanctioned floor plans
                </h2>
                <p className="property-detail-section-kicker">
                  Architectural layout and area breakdown
                </p>
              </div>
              <Badge variant="neutral" className="property-detail-section-badge text-brand-navy">
                Scale 1:100
              </Badge>
            </div>

            <div className="property-detail-metric-strip">
              <div className="property-spec-item">
                <span className="property-spec-label">Carpet area</span>
                <span className="property-spec-value">{property.carpetArea}</span>
              </div>
              <div className="property-spec-item">
                <span className="property-spec-label">Balcony area</span>
                <span className="property-spec-value">{property.balconyArea}</span>
              </div>
              <div className="property-spec-item">
                <span className="property-spec-label">Super built up</span>
                <span className="property-spec-value">{property.superBuiltUpArea}</span>
              </div>
            </div>

            <div className="property-detail-floorplan-figure">
              <img
                src={property.floorPlanImage}
                alt={`${property.title} architectural floor plan layout`}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </div>
          </section>

          {/* =========================================================================
              Section I: Agent / Owner Details
             ========================================================================= */}
          {property.agent && (
            <section className="property-detail-advisor p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
              <div className="flex min-w-0 items-center gap-4">
                <div className="property-detail-advisor-avatar bg-brand-navy text-brand-gold shadow-md">
                  {property.agent.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="property-detail-advisor-name">{property.agent.name}</h3>
                    <ShieldCheck size={18} weight="fill" className="shrink-0 text-emerald-600" aria-hidden />
                  </div>
                  <p className="property-detail-advisor-meta">
                    {property.agent.role} • EstateOne Certified Partner
                  </p>
                  <p className="property-detail-advisor-phone">{property.agent.phone}</p>
                </div>
              </div>

              <div className="property-detail-advisor-actions">
                <Link
                  to="/agents"
                  className="button-sm flex-1 min-h-10 rounded-xl bg-slate-100 py-2.5 px-4 text-center text-small font-semibold text-brand-navy transition-colors hover:bg-slate-200 sm:flex-initial"
                >
                  View profile
                </Link>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="button-sm flex-1 min-h-10 cursor-pointer rounded-xl bg-brand-navy py-2.5 px-4 text-center text-small font-semibold text-white transition-colors hover:bg-brand-navy-hover sm:flex-initial"
                >
                  Call advisor
                </a>
              </div>
            </section>
          )}

          {/* Legal Diligence Notice (PRD 4.2.14) */}
          <div className="property-detail-notice" role="note">
            <Info size={18} className="mt-0.5 shrink-0 text-amber-700" aria-hidden />
            <div className="min-w-0">
              <span className="property-detail-notice-title">Independent diligence notice</span>
              <p className="property-detail-notice-body">
                EstateOne provides verified platform listing information and RERA disclosures. EstateOne does not
                guarantee future financial returns or third party titles. Prospective purchasers and tenants are advised
                to conduct independent legal verification prior to financial settlement.
              </p>
            </div>
          </div>

        </div>

        {/* =========================================================================
            Right Column: Sticky Conversion & Enquiry Panel (PRD 5.5)
           ========================================================================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 md:p-8 rounded-3xl bg-white shadow-xl border-0 text-left space-y-6">
            
            {/* Price Presentation (PRD 4.2.13) */}
            <div>
              <span className="caption-2 text-slate-400 block mb-1">
                {property.isRental ? 'Monthly rental price' : property.isCommercial ? 'Commercial offering price' : 'Offering price'}
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="type-card-price text-brand-navy">
                  {property.isRental ? rentalPrice.text : property.priceDisplay}
                </span>
                {rentalPrice?.showMonthSuffix && (
                  <span className="caption-1 text-slate-500 font-normal">/ month</span>
                )}
              </div>
              {property.pricePerSqFt && (
                <p className="caption-2 text-brand-blue font-semibold mt-1">{property.pricePerSqFt}</p>
              )}
            </div>

            {/* Separate Security Deposit / Extra Fees (PRD 4.2.13) */}
            {property.isRental && (property.depositDisplay || property.deposit) && (
              <div className="p-3 rounded-2xl bg-slate-50 text-small space-y-1 text-slate-600 text-pretty">
                <div className="flex justify-between">
                  <span className="text-slate-400">Security deposit:</span>
                  <span className="font-semibold text-brand-navy">{property.depositDisplay || property.deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lock in period:</span>
                  <span className="font-semibold text-brand-navy">11 months</span>
                </div>
              </div>
            )}

            {/* Tabbed Interactive Conversion Panel (PRD 5.5) */}
            <Tabs
              value={activeFormTab}
              onValueChange={setActiveFormTab}
              className="space-y-4 pt-2 border-t border-slate-100"
            >
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl border-0 bg-slate-100 p-1 shadow-none">
                <TabsTrigger
                  value="enquiry"
                  className="rounded-xl py-2 text-small font-semibold shadow-none data-[state=active]:font-bold data-[state=active]:shadow-xs"
                >
                  Enquiry
                </TabsTrigger>
                <TabsTrigger
                  value="visit"
                  className="rounded-xl py-2 text-small font-semibold shadow-none data-[state=active]:font-bold data-[state=active]:shadow-xs"
                >
                  Site visit
                </TabsTrigger>
                <TabsTrigger
                  value="callback"
                  className="rounded-xl py-2 text-small font-semibold shadow-none data-[state=active]:font-bold data-[state=active]:shadow-xs"
                >
                  Callback
                </TabsTrigger>
              </TabsList>

              <TabsContent value="enquiry" className="mt-0">
                {enquirySuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle size={28} weight="fill" />
                    </div>
                    <h4 className="text-h4 text-brand-navy font-semibold">Enquiry transmitted</h4>
                    <p className="caption-2 text-slate-500 leading-relaxed">
                      The advisor for {property.title} will review your request and contact you via phone or email shortly.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEnquirySuccess(false)}
                      className="text-brand-blue hover:text-brand-blue hover:bg-transparent font-semibold"
                    >
                      Send another enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="estate-form-surface space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="detail-enquiry-name" className="text-slate-500 font-semibold">
                        Full name
                      </Label>
                      <Input
                        id="detail-enquiry-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        aria-invalid={Boolean(formErrors.fullName)}
                        className={detailFieldClass}
                      />
                      {formErrors.fullName && (
                        <p className="wizard-field-error mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="detail-enquiry-phone" className="text-slate-500 font-semibold">
                        Phone number
                      </Label>
                      <PhoneInput
                        id="detail-enquiry-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        aria-invalid={Boolean(formErrors.phone)}
                        className={cn('rounded-xl border-slate-200', formErrors.phone && 'border-rose-400 ring-1 ring-rose-400/30')}
                        inputClassName="rounded-xl border-0 bg-slate-50 text-body md:text-small font-medium focus:bg-white"
                      />
                      {formErrors.phone && (
                        <p className="wizard-field-error mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="detail-enquiry-email" className="text-slate-500 font-semibold">
                        Email address
                      </Label>
                      <Input
                        id="detail-enquiry-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@company.com"
                        aria-invalid={Boolean(formErrors.email)}
                        className={detailFieldClass}
                      />
                      {formErrors.email && (
                        <p className="wizard-field-error mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="detail-enquiry-message" className="text-slate-500 font-semibold">
                        Message
                      </Label>
                      <Textarea
                        id="detail-enquiry-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={cn(detailFieldClass, 'min-h-[4.5rem] resize-y')}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="detail-enquiry-consent"
                          checked={consent}
                          onCheckedChange={(checked) => setConsent(checked === true)}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor="detail-enquiry-consent"
                          className="text-small font-normal text-slate-500 leading-snug cursor-pointer"
                        >
                          I consent to EstateOne and the verified advisor contacting me regarding this property.
                        </Label>
                      </div>
                      {formErrors.consent && (
                        <p className="wizard-field-error">{formErrors.consent}</p>
                      )}
                    </div>

                    <Button type="submit" size="sm" disabled={isSubmittingEnquiry} className="w-full rounded-2xl shadow-xs">
                      <PaperPlaneTilt size={16} weight="bold" />
                      <span>{isSubmittingEnquiry ? 'Sending enquiry...' : 'Send Enquiry'}</span>
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="visit" className="mt-0">
                {visitSuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CalendarCheck size={28} weight="fill" />
                    </div>
                    <h4 className="text-h4 text-brand-navy font-semibold">Visit requested</h4>
                    <p className="caption-2 text-slate-500 leading-relaxed">
                      Your inspection request for <span className="font-semibold text-brand-navy">{visitDate}</span> at{' '}
                      <span className="font-semibold text-brand-navy">{visitSlot}</span> is pending agent confirmation.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setVisitSuccess(false)}
                      className="text-brand-blue hover:text-brand-blue hover:bg-transparent font-semibold"
                    >
                      Schedule another slot
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleVisitSubmit} className="estate-form-surface space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="detail-visit-date" className="text-slate-500 font-semibold">
                        Select date
                      </Label>
                      <DatePickerField
                        id="detail-visit-date"
                        value={visitDate}
                        onChange={setVisitDate}
                        placeholder="dd-mm-yyyy"
                        minDate={new Date()}
                        aria-invalid={Boolean(formErrors.visitDate)}
                        className={detailFieldClass}
                      />
                      {formErrors.visitDate && (
                        <p className="wizard-field-error mt-1">{formErrors.visitDate}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="wizard-field-label block font-semibold text-slate-500">
                        Select available time slot
                      </span>
                      <RadioGroup
                        value={visitSlot}
                        onValueChange={setVisitSlot}
                        className="grid grid-cols-3 gap-1.5"
                      >
                        {VISIT_TIME_SLOTS.map((slot) => {
                          const slotId = `detail-visit-slot-${slot.replace(/[\s:]/g, '-')}`;
                          const isActive = visitSlot === slot;
                          return (
                            <div key={slot}>
                              <RadioGroupItem value={slot} id={slotId} className="peer sr-only" />
                              <label
                                htmlFor={slotId}
                                className={cn(
                                  'flex cursor-pointer items-center justify-center rounded-xl border px-1 py-2 text-center text-small font-semibold transition-all',
                                  isActive
                                    ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                )}
                              >
                                {slot}
                              </label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="detail-visit-phone" className="text-slate-500 font-semibold">
                        Contact phone number
                      </Label>
                      <PhoneInput
                        id="detail-visit-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        aria-invalid={Boolean(formErrors.phone)}
                        className={cn('rounded-xl border-slate-200', formErrors.phone && 'border-rose-400 ring-1 ring-rose-400/30')}
                        inputClassName="rounded-xl border-0 bg-slate-50 text-body md:text-small font-medium focus:bg-white"
                      />
                      {formErrors.phone && (
                        <p className="wizard-field-error mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <Alert variant="default" className="rounded-xl border-amber-200/80 bg-amber-50 text-amber-900">
                      <AlertDescription className="text-small text-amber-900">
                        Notice: Visit requests remain pending until confirmed by the responsible agent or owner.
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" size="sm" disabled={isSubmittingVisit} className="w-full rounded-2xl shadow-xs">
                      <CalendarCheck size={16} weight="bold" />
                      <span>{isSubmittingVisit ? 'Scheduling visit...' : 'Schedule Site Visit'}</span>
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="callback" className="mt-0">
                {callbackSuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <PhoneCall size={28} weight="fill" />
                    </div>
                    <h4 className="text-h4 text-brand-navy font-semibold">Callback confirmed</h4>
                    <p className="caption-2 text-slate-500 leading-relaxed">
                      A property specialist will call you at{' '}
                      <span className="font-semibold text-brand-navy">{formatPhoneDisplay(phone)}</span> during{' '}
                      {callbackTime}.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCallbackSuccess(false)}
                      className="text-brand-blue hover:text-brand-blue hover:bg-transparent font-semibold"
                    >
                      Request another callback
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="estate-form-surface space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="detail-callback-window" className="text-slate-500 font-semibold">
                        Preferred callback window
                      </Label>
                      <Select value={callbackTime} onValueChange={setCallbackTime}>
                        <SelectTrigger id="detail-callback-window" className={detailFieldClass}>
                          <SelectValue placeholder="Choose a time window" />
                        </SelectTrigger>
                        <SelectContent>
                          {CALLBACK_TIME_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="detail-callback-phone" className="text-slate-500 font-semibold">
                        Phone number
                      </Label>
                      <PhoneInput
                        id="detail-callback-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        aria-invalid={Boolean(formErrors.phone)}
                        className={cn('rounded-xl border-slate-200', formErrors.phone && 'border-rose-400 ring-1 ring-rose-400/30')}
                        inputClassName="rounded-xl border-0 bg-slate-50 text-body md:text-small font-medium focus:bg-white"
                      />
                      {formErrors.phone && (
                        <p className="wizard-field-error mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <Button type="submit" size="sm" disabled={isSubmittingCallback} className="w-full rounded-2xl shadow-xs">
                      <PhoneCall size={16} weight="bold" />
                      <span>{isSubmittingCallback ? 'Requesting...' : 'Request Callback'}</span>
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            {/* Seller Direct Guarantee Stamp */}
            <div className="p-4 rounded-2xl bg-emerald-50 text-small text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
                <span>Verified seller direct coordination</span>
              </div>
              <p className="text-small text-emerald-800/80 leading-relaxed">
                Connect directly with certified property owners and RERA registered advisors with transparent terms.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          Section J: Similar Properties (PRD 5.5)
         ========================================================================= */}
      {similarProperties.length > 0 && (
        <section className="property-detail-related">
          <div className="property-detail-related-header">
            <div className="min-w-0">
              <h2 className="property-detail-related-heading">
                Similar properties you may like
              </h2>
              <p className="property-detail-related-desc">
                Verified listings in {property.city} with comparable specifications
              </p>
            </div>
            <Link to={parentRoute} className="property-detail-related-link hidden sm:inline-flex">
              Browse all {parentLabel.toLowerCase()} listings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((simProp) => (
              <PropertyCard key={simProp.id} property={simProp} />
            ))}
          </div>
        </section>
      )}

      {/* Report Listing Modal Component */}
      <ReportListingModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        property={property}
      />

    </div>
  );
}
