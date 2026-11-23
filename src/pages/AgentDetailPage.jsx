import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Star, ChatCircleText, CheckCircle, Lock } from '@phosphor-icons/react';
import { SAMPLE_AGENTS, getRealAgentListings } from '../data/agents';
import { SAMPLE_PROPERTIES } from '../data/properties';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import AgentEnquiryModal from '../components/shared/AgentEnquiryModal';
import PropertyCard from '../components/shared/PropertyCard';
import { MKT_ICON } from '../lib/iconScale';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function AgentDetailPage() {
  const { slug } = useParams();
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
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs 
        items={[
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
              <h1 className="agent-detail-hero__name">{agent.name}</h1>
              {agent.verified && (
                <Badge variant="default" className="gap-1">
                  <ShieldCheck size={MKT_ICON.sm} weight="fill" className="text-brand-blue" aria-hidden />
                  <span>Verified advisor</span>
                </Badge>
              )}
            </div>

            <p className="agent-detail-hero__role">
              {agent.role} • <span className="text-slate-600 font-normal">{agent.company}</span>
            </p>

            <div className="agent-detail-hero__meta">
              <span className="inline-flex items-center gap-1">
                <MapPin size={MKT_ICON.sm} className="text-brand-gold shrink-0" aria-hidden />
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
              <span className="inline-flex items-center gap-1 text-brand-gold font-semibold">
                <Star size={MKT_ICON.sm} weight="fill" aria-hidden />
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
                className="min-h-10 button-sm py-2.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-brand-navy flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Phone size={16} weight="bold" />
                <span>Call {agent.phone}</span>
              </a>

              <Button size="sm"
                type="button"
                onClick={() => handleOpenEnquiry()}
                className="min-h-10 py-2.5 px-6 rounded-2xl bg-brand-navy hover:bg-brand-navy-hover text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChatCircleText size={16} weight="bold" />
                <span>Send enquiry</span>
              </Button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-small text-slate-400 inline-flex items-center gap-1">
                <Lock size={MKT_ICON.sm} aria-hidden />
                <span>Confidential advisory line</span>
              </span>
              <Button size="sm"
                type="button"
                onClick={() => handleOpenEnquiry()}
                className="min-h-10 w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-brand-navy hover:bg-brand-navy-hover text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChatCircleText size={16} weight="bold" />
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
            <h2 className="agent-detail-section__title">About {agent.name}</h2>
            <p className="agent-detail-prose">{agent.bio}</p>
          </div>

          {/* Territory & Specialization Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-5">
            <h2 className="agent-detail-section__title">Professional credentials and coverage</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="agent-detail-stat__label">Areas served</span>
                <span className="agent-detail-stat__value block">{agent.areasServed}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="agent-detail-stat__label">Asset specialization</span>
                <span className="agent-detail-stat__value block">{agent.specialization}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="agent-detail-stat__label">Property categories</span>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  {(agent.propertyCategories || ['Apartment', 'Residential buy']).map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-brand-navy text-small font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="agent-detail-stat__label">Active verified listings</span>
                <span className="agent-detail-stat__value block text-emerald-700">
                  {activeListings.length} {activeListings.length === 1 ? 'property' : 'properties'} represented
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Enquiry Widget */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white shadow-xs border-0 sticky top-24">
            <h3 className="agent-detail-sidebar__title">Direct consultation</h3>
            <p className="agent-detail-sidebar__desc">
              Submit your contact details and preferred consultation window for private guidance on {agent.city}{' '}
              properties.
            </p>

            <Button
              type="button"
              size="sm"
              onClick={() => handleOpenEnquiry()}
              className="w-full rounded-2xl shadow-xs mb-3"
            >
              <ChatCircleText size={16} weight="bold" />
              <span>Request callback from {agent.name.split(' ')[0]}</span>
            </Button>

            <div className="agent-detail-trust space-y-2 pt-3 border-t border-slate-100 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle size={MKT_ICON.sm} className="text-emerald-600 shrink-0" weight="fill" aria-hidden />
                <span>Zero broker spam or unsolicited marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={MKT_ICON.sm} className="text-emerald-600 shrink-0" weight="fill" aria-hidden />
                <span>RERA verified contract documentation</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Active Listings Represented by this Agent */}
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="agent-detail-listings__title">Active verified listings</h2>
            <p className="agent-detail-section__lead mt-0.5">
              Current properties represented by {agent.name}
            </p>
          </div>
          <Badge variant="neutral">{activeListings.length} listings</Badge>
        </div>

        {activeListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border-0 shadow-xs">
            <p className="text-h4 text-brand-navy font-semibold">No active listings currently displayed</p>
            <p className="text-small text-slate-500 mt-1 max-w-sm mx-auto">
              This advisor manages private and off market mandates. Contact directly to view confidential properties.
            </p>
            <Button size="sm"
              type="button"
              onClick={() => handleOpenEnquiry()}
              className="min-h-10 mt-4 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white cursor-pointer"
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
