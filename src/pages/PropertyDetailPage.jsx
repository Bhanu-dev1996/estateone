import React, { useState, useMemo, useEffect } from 'react';
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
import PropertyGallery from '../components/shared/PropertyGallery';
import PropertyCard from '../components/shared/PropertyCard';
import ReportListingModal from '../components/shared/ReportListingModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

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
      videoTourUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      floorPlanImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
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
    if (!phone.trim() || phone.trim().length < 8) errors.phone = 'Please enter a valid phone number.';
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
    if (!phone.trim()) errors.phone = 'Please enter your contact phone number.';

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
    if (!phone.trim()) {
      setFormErrors({ phone: 'Please enter your phone number for callback.' });
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
          { label: 'Home', href: '/' },
          { label: parentLabel, href: parentRoute },
          { label: property.city, href: `${parentRoute}?city=${encodeURIComponent(property.city)}` },
          { label: property.title }
        ]} 
        className="mb-4" 
      />

      {/* =========================================================================
          Section C: Property Overview Header (Title, Location, Pricing, Overview Actions)
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {property.verified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <ShieldCheck size={14} weight="fill" className="text-emerald-600" />
                <span>RERA verified: {property.reraId}</span>
              </span>
            )}
            <span className="caption-2 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full font-semibold">
              {property.status}
            </span>
            <span className="caption-2 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full font-medium">
              ID: {property.propertyId}
            </span>
            <span className="caption-2 text-slate-400 font-medium">
              {property.postedDateText}
            </span>
          </div>

          <h1 className="heading-2 text-brand-navy tracking-tight">
            {property.title}
          </h1>
          <p className="body-4 text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin size={16} className="text-brand-gold shrink-0" />
            <span>{property.location}</span>
          </p>
        </div>

        {/* Overview Actions: Share, Compare, Save, Report */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-semibold text-brand-navy flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
            title="Share property"
          >
            <ShareNetwork size={16} />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={() => toggleCompare(property)}
            className={`px-3.5 py-2.5 rounded-2xl border shadow-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              compared 
                ? 'bg-brand-navy text-brand-gold border-brand-navy' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Add to compare"
          >
            <Scales size={16} weight={compared ? 'fill' : 'bold'} />
            <span>{compared ? 'In comparison' : 'Compare'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSave(property)}
            className={`px-3.5 py-2.5 rounded-2xl border shadow-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              saved 
                ? 'bg-rose-50 text-rose-600 border-rose-200' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Save to favorites"
          >
            <Heart size={16} weight={saved ? 'fill' : 'bold'} className={saved ? 'text-rose-600' : ''} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-xs font-semibold text-slate-500 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Report this listing"
          >
            <Flag size={14} />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

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
          <section className="p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <h2 className="heading-4 text-brand-navy font-bold mb-6">
              Property specifications
            </h2>

            {/* Residential Specifications */}
            {!property.isCommercial && property.type !== 'Residential Plot' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Bedrooms</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.bedrooms || '3 BHK'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Bathrooms</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.bathrooms || '3 Baths'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Carpet area</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.carpetArea}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Super built up area</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.superBuiltUpArea}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Property type</span>
                  <span className="title-3 text-brand-navy font-bold">{property.type}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Floor number</span>
                  <span className="title-3 text-brand-navy font-bold">{property.floorLevel}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Total floors</span>
                  <span className="title-3 text-brand-navy font-bold">{property.totalFloors}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Furnishing</span>
                  <span className="title-3 text-brand-navy font-bold">{property.furnishing || 'Furnished'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Facing</span>
                  <span className="title-3 text-brand-navy font-bold">{property.facingDirection}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Property age</span>
                  <span className="title-3 text-brand-navy font-bold">{property.ageOfProperty}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Possession status</span>
                  <span className="title-3 text-brand-blue font-bold">{property.status}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Rate estimate</span>
                  <span className="title-3 text-brand-navy font-bold">{property.pricePerSqFt || 'Market price'}</span>
                </div>
              </div>
            )}

            {/* Commercial Specifications (PRD 5.4 & 5.5: No Bedrooms/Bathrooms) */}
            {property.isCommercial && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Super built up area</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.superBuiltUpArea}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Carpet area</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.carpetArea}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Category</span>
                  <span className="title-3 text-brand-navy font-bold">{property.commercialCategory || 'Office spaces'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Building type</span>
                  <span className="title-3 text-brand-navy font-bold">{property.buildingType || 'Grade A tech park'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Floor number</span>
                  <span className="title-3 text-brand-navy font-bold">{property.floorLevel}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Fitout state</span>
                  <span className="title-3 text-brand-navy font-bold">{property.furnishing || 'Warm shell'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Parking allocation</span>
                  <span className="title-3 text-brand-navy font-bold">{property.parkingCount || 'Reserved slots'}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Power load capacity</span>
                  <span className="title-3 text-brand-navy font-bold">{property.powerLoad || '100% DG backup'}</span>
                </div>
              </div>
            )}

            {/* Plot Specifications */}
            {property.type === 'Residential Plot' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Plot area</span>
                  <span className="heading-3 text-brand-navy font-bold">{property.superBuiltUpArea}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Dimensions</span>
                  <span className="title-3 text-brand-navy font-bold">50 ft x 100 ft</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Zoning status</span>
                  <span className="title-3 text-brand-navy font-bold">Freehold residential</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Facing</span>
                  <span className="title-3 text-brand-navy font-bold">{property.facingDirection}</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Road width</span>
                  <span className="title-3 text-brand-navy font-bold">40 feet asphalt road</span>
                </div>
                <div>
                  <span className="caption-2 text-slate-400 block mb-1">Possession</span>
                  <span className="title-3 text-brand-blue font-bold">Immediate registration</span>
                </div>
              </div>
            )}
          </section>

          {/* =========================================================================
              Section E: Description and Key Highlights
             ========================================================================= */}
          <section className="p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs space-y-6">
            <div>
              <h2 className="heading-4 text-brand-navy font-bold mb-3">
                About this property
              </h2>
              <p className="body-4 text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="caption-1 font-bold text-brand-navy uppercase tracking-wider mb-3">
                Key property highlights
              </h3>
              <ul className="space-y-2.5">
                {property.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle size={16} weight="fill" className="text-brand-blue shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Title Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-500 leading-relaxed">
              Official RERA registration validated under certificate <span className="font-semibold text-brand-navy">{property.reraId}</span>. Legal deed verification, sanctioned municipal layout, and encumbrance checks cleared.
            </div>
          </section>

          {/* =========================================================================
              Section F: Amenities
             ========================================================================= */}
          <section className="p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs">
            <h2 className="heading-4 text-brand-navy font-bold mb-4">
              Verified amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(property.amenities || []).map((amenity) => (
                <div key={amenity} className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50">
                  <CheckCircle size={16} weight="fill" className="text-brand-blue shrink-0" />
                  <span className="text-xs font-semibold text-brand-navy">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              Section G: Location & Neighbourhood Points of Interest
             ========================================================================= */}
          <section className="p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="heading-4 text-brand-navy font-bold">
                  Location & neighbourhood
                </h2>
                <p className="caption-2 text-slate-500 mt-0.5">
                  {property.location}
                </p>
              </div>
              <Badge variant="neutral" className="text-xs font-semibold text-brand-navy">
                GPS Verified
              </Badge>
            </div>

            {/* Styled Map Preview Card */}
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                alt="Locality map overview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-brand-navy/50 flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center shadow-lg mb-2">
                  <MapPin size={22} weight="fill" />
                </div>
                <p className="text-xs font-bold text-white tracking-tight">{property.location}</p>
                <p className="text-[11px] text-slate-200 mt-0.5">Verified prime neighbourhood corridor</p>
              </div>
            </div>

            {/* Verified Nearby Places Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Schools */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                  <GraduationCap size={16} className="text-brand-blue" />
                  <span>Nearby schools</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {property.nearbyPlaces.schools.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="font-semibold text-brand-navy">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                  <FirstAid size={16} className="text-rose-600" />
                  <span>Healthcare & hospitals</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {property.nearbyPlaces.hospitals.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="font-semibold text-brand-navy">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                  <AirplaneTilt size={16} className="text-brand-gold" />
                  <span>Transit & transport</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {property.nearbyPlaces.transport.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="font-semibold text-brand-navy">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                  <ShoppingBag size={16} className="text-emerald-600" />
                  <span>Shopping & lifestyle</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {property.nearbyPlaces.shopping.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="font-semibold text-brand-navy">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </section>

          {/* =========================================================================
              Section H: Floor Plans
             ========================================================================= */}
          <section className="p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="heading-4 text-brand-navy font-bold">
                  Sanctioned floor plans
                </h2>
                <p className="caption-2 text-slate-500 mt-0.5">
                  Architectural layout and area breakdown
                </p>
              </div>
              <Badge variant="neutral" className="text-xs font-semibold text-brand-navy">
                Scale 1:100
              </Badge>
            </div>

            {/* Floor Plan Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 text-center">
              <div>
                <span className="caption-2 text-slate-400 block mb-0.5">Carpet area</span>
                <span className="caption-1 font-bold text-brand-navy">{property.carpetArea}</span>
              </div>
              <div>
                <span className="caption-2 text-slate-400 block mb-0.5">Balcony area</span>
                <span className="caption-1 font-bold text-brand-navy">{property.balconyArea}</span>
              </div>
              <div>
                <span className="caption-2 text-slate-400 block mb-0.5">Super built up</span>
                <span className="caption-1 font-bold text-brand-navy">{property.superBuiltUpArea}</span>
              </div>
            </div>

            {/* Floor Plan Graphic Display */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-4">
              <img
                src={property.floorPlanImage}
                alt={`${property.title} architectural floor plan layout`}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          </section>

          {/* =========================================================================
              Section I: Agent / Owner Details
             ========================================================================= */}
          {property.agent && (
            <section className="p-6 md:p-8 bg-white rounded-3xl border-0 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                  {property.agent.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="heading-4 text-brand-navy font-bold">{property.agent.name}</h3>
                    <ShieldCheck size={18} weight="fill" className="text-emerald-600" />
                  </div>
                  <p className="caption-2 text-slate-500">
                    {property.agent.role} • EstateOne Certified Partner
                  </p>
                  <p className="caption-2 text-brand-navy font-medium mt-1">
                    {property.agent.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/agents"
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-semibold text-center transition-colors"
                >
                  View profile
                </Link>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold text-center transition-colors"
                >
                  Call advisor
                </a>
              </div>
            </section>
          )}

          {/* Legal Diligence Notice (PRD 4.2.14) */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/50 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
            <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Independent diligence notice</span>
              <p>
                EstateOne provides verified platform listing information and RERA disclosures. EstateOne does not guarantee future financial returns or third party titles. Prospective purchasers and tenants are advised to conduct independent legal verification prior to financial settlement.
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
              <div className="flex items-baseline gap-2">
                <span className="heading-2 text-brand-navy font-bold">{property.priceDisplay}</span>
                {property.isRental && <span className="caption-1 text-slate-500 font-normal">/ month</span>}
              </div>
              {property.pricePerSqFt && (
                <p className="caption-2 text-brand-blue font-semibold mt-1">{property.pricePerSqFt}</p>
              )}
            </div>

            {/* Separate Security Deposit / Extra Fees (PRD 4.2.13) */}
            {property.isRental && (property.depositDisplay || property.deposit) && (
              <div className="p-3 rounded-2xl bg-slate-50 text-xs space-y-1 text-slate-600">
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
            <div className="space-y-4 pt-2 border-t border-slate-100">
              
              {/* Funnel Mode Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl text-[11px] font-semibold text-center">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('enquiry')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeFormTab === 'enquiry'
                      ? 'bg-white text-brand-navy shadow-xs font-bold'
                      : 'text-slate-500 hover:text-brand-navy'
                  }`}
                >
                  Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('visit')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeFormTab === 'visit'
                      ? 'bg-white text-brand-navy shadow-xs font-bold'
                      : 'text-slate-500 hover:text-brand-navy'
                  }`}
                >
                  Site visit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('callback')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeFormTab === 'callback'
                      ? 'bg-white text-brand-navy shadow-xs font-bold'
                      : 'text-slate-500 hover:text-brand-navy'
                  }`}
                >
                  Callback
                </button>
              </div>

              {/* Mode 1: Send Direct Enquiry Form */}
              {activeFormTab === 'enquiry' && (
                <div>
                  {enquirySuccess ? (
                    <div className="py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle size={28} weight="fill" />
                      </div>
                      <h4 className="title-3 text-brand-navy font-bold">Enquiry transmitted</h4>
                      <p className="caption-2 text-slate-500 leading-relaxed">
                        The advisor for {property.title} will review your request and contact you via phone or email shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setEnquirySuccess(false)}
                        className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
                      >
                        Send another enquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-3">
                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue font-medium"
                        />
                        {formErrors.fullName && (
                          <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue font-medium"
                        />
                        {formErrors.phone && (
                          <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue font-medium"
                        />
                        {formErrors.email && (
                          <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Message
                        </label>
                        <textarea
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue font-medium"
                        />
                      </div>

                      <label className="flex items-start gap-2 text-[11px] text-slate-500 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 rounded text-brand-navy focus:ring-brand-blue"
                        />
                        <span>I consent to EstateOne and the verified advisor contacting me regarding this property.</span>
                      </label>
                      {formErrors.consent && (
                        <p className="text-[11px] text-rose-600">{formErrors.consent}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmittingEnquiry}
                        className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <PaperPlaneTilt size={16} weight="bold" />
                        <span>{isSubmittingEnquiry ? 'Sending enquiry...' : 'Send Enquiry'}</span>
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* Mode 2: Schedule Site Visit Form */}
              {activeFormTab === 'visit' && (
                <div>
                  {visitSuccess ? (
                    <div className="py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <CalendarCheck size={28} weight="fill" />
                      </div>
                      <h4 className="title-3 text-brand-navy font-bold">Visit requested</h4>
                      <p className="caption-2 text-slate-500 leading-relaxed">
                        Your inspection request for <span className="font-semibold text-brand-navy">{visitDate}</span> at <span className="font-semibold text-brand-navy">{visitSlot}</span> is pending agent confirmation.
                      </p>
                      <button
                        type="button"
                        onClick={() => setVisitSuccess(false)}
                        className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
                      >
                        Schedule another slot
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleVisitSubmit} className="space-y-3">
                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Select date
                        </label>
                        <input
                          type="date"
                          value={visitDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy focus:outline-none focus:border-brand-blue font-medium"
                        />
                        {formErrors.visitDate && (
                          <p className="text-[11px] text-rose-600 mt-1">{formErrors.visitDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Select available time slot
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['10:00 AM', '02:30 PM', '05:00 PM'].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setVisitSlot(slot)}
                              className={`py-2 px-1 text-[11px] rounded-xl font-semibold border transition-all cursor-pointer ${
                                visitSlot === slot
                                  ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Contact phone number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue font-medium"
                        />
                        {formErrors.phone && (
                          <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-[11px] leading-relaxed">
                        Notice: Visit requests remain pending until confirmed by the responsible agent or owner.
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingVisit}
                        className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <CalendarCheck size={16} weight="bold" />
                        <span>{isSubmittingVisit ? 'Scheduling visit...' : 'Schedule Site Visit'}</span>
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* Mode 3: Request Callback Form */}
              {activeFormTab === 'callback' && (
                <div>
                  {callbackSuccess ? (
                    <div className="py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <PhoneCall size={28} weight="fill" />
                      </div>
                      <h4 className="title-3 text-brand-navy font-bold">Callback confirmed</h4>
                      <p className="caption-2 text-slate-500 leading-relaxed">
                        A property specialist will call you at <span className="font-semibold text-brand-navy">{phone}</span> during {callbackTime}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCallbackSuccess(false)}
                        className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
                      >
                        Request another callback
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCallbackSubmit} className="space-y-3">
                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Preferred callback window
                        </label>
                        <select
                          value={callbackTime}
                          onChange={(e) => setCallbackTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy focus:outline-none focus:border-brand-blue font-medium cursor-pointer"
                        >
                          <option value="Morning (10:00 AM to 01:00 PM)">Morning (10:00 AM to 01:00 PM)</option>
                          <option value="Afternoon (02:00 PM to 05:00 PM)">Afternoon (02:00 PM to 05:00 PM)</option>
                          <option value="Evening (05:00 PM to 08:00 PM)">Evening (05:00 PM to 08:00 PM)</option>
                        </select>
                      </div>

                      <div>
                        <label className="caption-2 font-semibold text-slate-500 block mb-1">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue font-medium"
                        />
                        {formErrors.phone && (
                          <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingCallback}
                        className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <PhoneCall size={16} weight="bold" />
                        <span>{isSubmittingCallback ? 'Requesting...' : 'Request Callback'}</span>
                      </Button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Seller Direct Guarantee Stamp */}
            <div className="p-4 rounded-2xl bg-emerald-50 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
                <span>Verified seller direct coordination</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
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
        <section className="mt-20 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-3 text-brand-navy font-bold">
                Similar properties you may like
              </h2>
              <p className="caption-1 text-slate-500 mt-1">
                Verified listings in {property.city} with comparable specifications
              </p>
            </div>
            <Link
              to={parentRoute}
              className="text-xs font-semibold text-brand-blue hover:underline hidden sm:inline"
            >
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
