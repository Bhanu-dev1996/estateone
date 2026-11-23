import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Buildings, 
  MapPin, 
  Phone, 
  Envelope, 
  CalendarCheck, 
  ChatCircleText, 
  CheckCircle, 
  Eye, 
  Bed, 
  Bathtub, 
  ArrowsOut,
  Lock,
  ArrowRight
} from '@phosphor-icons/react';
import { SAMPLE_BUILDERS, getRealBuilderListings } from '../data/agents';
import { SAMPLE_PROPERTIES } from '../data/properties';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import AgentEnquiryModal from '../components/shared/AgentEnquiryModal';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function BuilderDetailPage() {
  const { slug } = useParams();
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProjectContext, setSelectedProjectContext] = useState(null);

  const builder = useMemo(() => {
    return SAMPLE_BUILDERS.find((b) => b.slug === slug || b.id === slug) || SAMPLE_BUILDERS[0];
  }, [slug]);

  // Real active listings matching builder
  const activeProjects = useMemo(() => {
    return getRealBuilderListings(builder, SAMPLE_PROPERTIES);
  }, [builder]);

  const handleOpenEnquiry = (project = null) => {
    setSelectedProjectContext(project);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs 
        items={[
          { label: 'Builders and developers', href: '/builders' },
          { label: builder.name }
        ]} 
        className="mb-4" 
      />

      {/* Main Builder Header Card */}
      <div className="p-6 sm:p-8 mb-10 rounded-3xl bg-white shadow-xs border-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Logo, Name, Tagline, Credentials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shrink-0 overflow-hidden shadow-xs">
            {builder.logo ? (
              <img 
                src={builder.logo} 
                alt={builder.name} 
                className="max-h-full max-w-full object-contain" 
              />
            ) : (
              <Buildings size={40} className="text-brand-navy" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="heading-2 text-brand-navy font-bold tracking-tight">
                {builder.name}
              </h1>
              {builder.verified && (
                <Badge variant="default" className="text-xs px-2.5 py-0.5 font-semibold gap-1">
                  <ShieldCheck size={14} weight="fill" className="text-brand-blue" />
                  <span>RERA developer</span>
                </Badge>
              )}
            </div>

            <p className="body-3 text-brand-navy font-semibold">
              {builder.tagline}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1 font-medium">
                <MapPin size={14} className="text-[#C5A46D]" />
                <span>{builder.headquarters}</span>
              </span>

              {builder.experience && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-brand-navy">{builder.experience}</span>
                </>
              )}

              {builder.reraRegistration && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-600 font-medium">RERA: {builder.reraRegistration}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Contact & Direct Desk CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          {builder.publicContact ? (
            <>
              <a
                href={`tel:${builder.phone.replace(/[^0-9+]/g, '')}`}
                className="min-h-10 button-sm py-2.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-brand-navy flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Phone size={16} weight="bold" />
                <span>Call developer desk</span>
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
              <span className="caption-3 text-slate-400 flex items-center gap-1">
                <Lock size={14} />
                <span>Private developer desk</span>
              </span>
              <Button size="sm"
                type="button"
                onClick={() => handleOpenEnquiry()}
                className="min-h-10 w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-brand-navy hover:bg-brand-navy-hover text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChatCircleText size={16} weight="bold" />
                <span>Send project enquiry</span>
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Developer Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left 2 Cols: Description & Metrics */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0">
            <h2 className="heading-4 text-brand-navy font-bold mb-3">
              Corporate profile
            </h2>
            <p className="body-3 text-slate-600 leading-relaxed">
              {builder.description}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-5">
            <h2 className="heading-4 text-brand-navy font-bold">
              Development track record and disclosures
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-2 text-slate-400 block mb-1">Established</span>
                <span className="heading-3 text-brand-navy font-bold block">{builder.established}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-2 text-slate-400 block mb-1">Completed</span>
                <span className="heading-3 text-brand-navy font-bold block">{builder.completedProjectsCount}+</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-2 text-slate-400 block mb-1">Ongoing</span>
                <span className="heading-3 text-brand-gold font-bold block">{builder.ongoingProjectsCount}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="caption-2 text-slate-400 block mb-1">Active units</span>
                <span className="heading-3 text-emerald-700 font-bold block">{activeProjects.length}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Enquiry */}
        <div>
          <div className="p-6 rounded-3xl bg-white shadow-xs border-0 sticky top-24">
            <h3 className="title-2 text-brand-navy font-bold mb-1">
              Direct developer enquiry
            </h3>
            <p className="caption-2 text-slate-500 mb-5">
              Connect with institutional sales executives for direct pricing schedules and floor plan availability.
            </p>

            <Button
              type="button"
              size="sm"
              onClick={() => handleOpenEnquiry()}
              className="w-full rounded-2xl shadow-xs mb-3"
            >
              <ChatCircleText size={16} weight="bold" />
              <span>Contact sales office</span>
            </Button>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-small text-slate-400 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" weight="fill" />
                <span>Zero brokerage on builder direct inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" weight="fill" />
                <span>Direct possession agreement documentation</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Featured Projects / Units Represented */}
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-3 text-brand-navy font-bold tracking-tight">
              Featured project developments
            </h2>
            <p className="caption-2 text-slate-500 mt-0.5">
              Available residential and commercial inventory by {builder.name}
            </p>
          </div>
          <Badge variant="neutral" className="text-xs font-semibold text-slate-700">
            {activeProjects.length} projects
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map((property) => (
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-small font-semibold shadow-xs">
                      <ShieldCheck size={12} weight="fill" />
                      <span>Verified</span>
                    </span>
                  )}
                  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-brand-navy/90 text-brand-gold text-label font-bold shadow-xs">
                    {property.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="heading-3 text-brand-navy font-bold tracking-tight block mb-1">
                    {property.priceDisplay}
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
                    <span>View project</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenEnquiry(property)}
                    className="min-h-10 button-sm py-2 px-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChatCircleText size={14} weight="bold" />
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Builder Enquiry Modal */}
      <AgentEnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        agent={{
          id: builder.id,
          name: builder.name,
          role: 'Master Developer Sales Desk',
          company: builder.name,
          city: builder.city,
          photo: builder.logo,
          verified: builder.verified,
          publicContact: builder.publicContact
        }}
        propertyContext={selectedProjectContext}
        availableProperties={activeProjects}
      />
    </div>
  );
}
