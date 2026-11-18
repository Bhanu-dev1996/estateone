import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Envelope, 
  Star, 
  Buildings, 
  CalendarCheck, 
  ChatCircleText, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  Eye,
  Bed,
  Bathtub,
  ArrowsOut
} from '@phosphor-icons/react';
import { SAMPLE_AGENTS, getRealAgentListings } from '../data/agents';
import { SAMPLE_PROPERTIES } from '../data/properties';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import AgentEnquiryModal from '../components/shared/AgentEnquiryModal';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useProperty } from '../context/PropertyContext';

export default function AgentDetailPage() {
  const { slug } = useParams();
  const { openSiteVisit } = useProperty();

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedPropertyContext, setSelectedPropertyContext] = useState(null);

  // Find agent by slug or id
  const agent = useMemo(() => {
    return SAMPLE_AGENTS.find((a) => a.slug === slug || a.id === slug) || SAMPLE_AGENTS[0];
  }, [slug]);

  // Real active listings matching this agent
  const activeListings = useMemo(() => {
    return getRealAgentListings(agent, SAMPLE_PROPERTIES);
  }, [agent]);

  const handleOpenEnquiry = (property = null) => {
    setSelectedPropertyContext(property);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Verified advisors', href: '/agents' },
          { label: agent.name }
        ]} 
        className="mb-4" 
      />

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 mb-10 rounded-3xl bg-white shadow-xs border-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Avatar, Name, Role, Credentials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="relative shrink-0">
            <img
              src={agent.photo || agent.avatar}
              alt={agent.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-sm"
            />
            {/* Verified status, only when verified per PRD 5.8 */}
            {agent.verified && (
              <span 
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-2 ring-white"
                title="RERA Verified Property Consultant"
              >
                <ShieldCheck size={16} weight="fill" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="heading-2 text-brand-navy font-bold tracking-tight">
                {agent.name}
              </h1>
              {agent.verified && (
                <Badge variant="default" className="text-xs px-2.5 py-0.5 font-semibold gap-1">
                  <ShieldCheck size={13} weight="fill" className="text-brand-blue" />
                  <span>Verified advisor</span>
                </Badge>
              )}
            </div>

            <p className="body-3 text-brand-navy font-semibold">
              {agent.role} • <span className="text-slate-600">{agent.company}</span>
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1 font-medium">
                <MapPin size={14} className="text-[#C5A46D]" />
                <span>{agent.city}</span>
              </span>

              {/* Experience, where verified per PRD 5.8 */}
              {agent.experience && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-brand-navy">{agent.experience}</span>
                </>
              )}

              {agent.reraNumber && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-600 font-medium">RERA: {agent.reraNumber}</span>
                </>
              )}

              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-[#C5A46D] font-bold">
                <Star size={14} weight="fill" />
                <span>{agent.rating || '4.95'}</span>
                <span className="text-slate-400 font-normal">({agent.reviewCount || '28'} reviews)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Contact & Enquiry CTAs with Privacy Rule Enforcement */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          {/* PRD 5.8 Rule: Do not expose private agent contact details unless configured for public display */}
          {agent.publicContact ? (
            <>
              <a
                href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
                className="py-2.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Phone size={15} weight="bold" />
                <span>Call {agent.phone}</span>
              </a>

              <Button
                type="button"
                onClick={() => handleOpenEnquiry()}
                className="py-2.5 px-6 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChatCircleText size={15} weight="bold" />
                <span>Send enquiry</span>
              </Button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="caption-3 text-slate-400 flex items-center gap-1">
                <Lock size={13} />
                <span>Confidential advisory line</span>
              </span>
              <Button
                type="button"
                onClick={() => handleOpenEnquiry()}
                className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChatCircleText size={15} weight="bold" />
                <span>Send enquiry to advisor</span>
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Profile Overview & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left 2 Cols: Biography & Territory Specializations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Biography Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0">
            <h2 className="heading-4 text-brand-navy font-bold mb-3">
              About {agent.name}
            </h2>
            <p className="body-3 text-slate-600 leading-relaxed">
              {agent.bio}
            </p>
          </div>

          {/* Territory & Specialization Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-5">
            <h2 className="heading-4 text-brand-navy font-bold">
              Professional credentials and coverage
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-3 text-slate-400 block mb-1">Areas served</span>
                <span className="font-semibold text-brand-navy leading-relaxed block">
                  {agent.areasServed}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-3 text-slate-400 block mb-1">Asset specialization</span>
                <span className="font-semibold text-brand-navy leading-relaxed block">
                  {agent.specialization}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-3 text-slate-400 block mb-1">Property categories</span>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  {(agent.propertyCategories || ['Apartment', 'Residential buy']).map((cat) => (
                    <span key={cat} className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-brand-navy text-[11px] font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-3 text-slate-400 block mb-1">Active verified listings</span>
                <span className="font-bold text-emerald-700 text-sm block">
                  {activeListings.length} {activeListings.length === 1 ? 'property' : 'properties'} represented
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Enquiry Widget */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white shadow-xs border-0 sticky top-24">
            <h3 className="title-2 text-brand-navy font-bold mb-1">
              Direct consultation
            </h3>
            <p className="caption-2 text-slate-500 mb-5">
              Submit your contact details and preferred consultation window for private guidance on {agent.city} properties.
            </p>

            <Button
              type="button"
              onClick={() => handleOpenEnquiry()}
              className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors mb-3"
            >
              <ChatCircleText size={16} weight="bold" />
              <span>Request callback from {agent.name.split(' ')[0]}</span>
            </Button>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" weight="fill" />
                <span>Zero broker spam or unsolicited marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" weight="fill" />
                <span>RERA verified contract documentation</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Active Listings Represented by this Agent */}
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-3 text-brand-navy font-bold tracking-tight">
              Active verified listings
            </h2>
            <p className="caption-2 text-slate-500 mt-0.5">
              Current properties represented by {agent.name}
            </p>
          </div>
          <Badge variant="neutral" className="text-xs font-semibold text-slate-700">
            {activeListings.length} listings
          </Badge>
        </div>

        {activeListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeListings.map((property) => (
              <article
                key={property.id}
                className="group bg-white rounded-3xl overflow-hidden border-0 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col text-left"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={property.images?.[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pointer-events-none">
                    {property.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold shadow-xs">
                        <ShieldCheck size={12} weight="fill" />
                        <span>Verified</span>
                      </span>
                    )}
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-brand-navy/90 text-brand-gold text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {property.intent === 'rent' ? 'Rent' : property.transactionType || 'Buy'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="heading-3 text-brand-navy font-bold tracking-tight block mb-1">
                      {property.intent === 'rent' 
                        ? (property.monthlyRentDisplay || property.priceDisplay) 
                        : property.priceDisplay}
                    </span>

                    <h4 className="title-2 font-bold text-brand-navy mb-1 line-clamp-1">
                      <Link to={`/property/${property.slug}`} className="hover:text-brand-blue transition-colors">
                        {property.title}
                      </Link>
                    </h4>

                    <p className="caption-2 text-slate-500 flex items-center gap-1.5 mb-3">
                      <MapPin size={14} className="text-brand-gold shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </p>

                    <div className="flex items-center gap-3 text-slate-600 py-2 border-y border-slate-100 mb-4 text-xs">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed size={14} className="text-slate-400" />
                          <span className="font-semibold">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bathtub size={14} className="text-slate-400" />
                          <span className="font-semibold">{property.bathrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <ArrowsOut size={14} className="text-slate-400" />
                        <span className="font-semibold">{property.area}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to={`/property/${property.slug}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={14} />
                      <span>View details</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(property)}
                      className="py-2 px-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ChatCircleText size={14} weight="bold" />
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border-0 shadow-xs">
            <p className="title-3 text-brand-navy font-bold">No active listings currently displayed</p>
            <p className="caption-2 text-slate-500 mt-1 max-w-sm mx-auto">
              This advisor manages private and off market mandates. Contact directly to view confidential properties.
            </p>
            <Button
              type="button"
              onClick={() => handleOpenEnquiry()}
              className="mt-4 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer"
            >
              Contact advisor
            </Button>
          </div>
        )}
      </div>

      {/* Agent Enquiry Modal */}
      <AgentEnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        agent={agent}
        propertyContext={selectedPropertyContext}
        availableProperties={activeListings}
      />
    </div>
  );
}
