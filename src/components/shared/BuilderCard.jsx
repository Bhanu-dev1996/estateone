import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Buildings, MapPin, ArrowRight, CheckCircle, ChatCircleText } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { getRealBuilderListings } from '../../data/agents';

export default function BuilderCard({ builder, className = '' }) {
  if (!builder) return null;

  // Real data listing count per PRD 5.8
  const realListings = getRealBuilderListings(builder, SAMPLE_PROPERTIES);
  const listingsCount = realListings.length;

  return (
    <article 
      className={`group flex flex-col bg-white rounded-3xl p-6 border-0 shadow-xs hover:shadow-lg transition-all duration-300 text-left ${className}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
          {builder.logo ? (
            <img 
              src={builder.logo} 
              alt={builder.name} 
              className="max-h-full max-w-full object-contain" 
              loading="lazy"
            />
          ) : (
            <Buildings size={32} className="text-brand-navy" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="heading-4 text-brand-navy font-bold hover:text-brand-blue transition-colors truncate">
              <Link to={`/builders/${builder.slug || builder.id}`}>
                {builder.name}
              </Link>
            </h3>
            {/* Verified status, only when verified per PRD 5.8 */}
            {builder.verified && (
              <span title="RERA Certified Corporate Developer">
                <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <p className="caption-2 text-slate-500 mt-0.5 line-clamp-1 font-medium">
            {builder.tagline || 'Leading real estate developer'}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin size={12} className="text-[#C5A46D]" />
            <span className="truncate">{builder.headquarters || `${builder.city}, India`}</span>
          </div>
        </div>
      </div>

      {/* Developer Metrics */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center mb-4 text-xs">
        {/* Experience, when supplied per PRD 5.8 */}
        <div>
          <span className="caption-2 text-slate-400 block">Experience</span>
          <span className="caption-1 font-bold text-brand-navy">{builder.experience || `${builder.established ? `Est. ${builder.established}` : 'Established'}`}</span>
        </div>
        <div>
          <span className="caption-2 text-slate-400 block">Delivered</span>
          <span className="caption-1 font-bold text-brand-navy">{builder.completedProjectsCount || '40'}+</span>
        </div>
        <div>
          <span className="caption-2 text-slate-400 block">Listings</span>
          <span className="caption-1 font-bold text-emerald-700">{listingsCount} active</span>
        </div>
      </div>

      {/* Description Snippet */}
      {builder.description && (
        <p className="body-5 text-slate-600 line-clamp-2 mb-4">
          {builder.description}
        </p>
      )}

      {/* Action CTA Buttons */}
      <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
        <Link
          to={`/builders/${builder.slug || builder.id}`}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy caption-1 font-semibold text-center transition-colors flex items-center justify-center gap-1"
        >
          <span>View profile</span>
          <ArrowRight size={13} weight="bold" />
        </Link>

        <Link
          to={`/builders/${builder.slug || builder.id}#enquire`}
          className="py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white caption-1 font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChatCircleText size={14} weight="bold" />
          <span>Contact</span>
        </Link>
      </div>
    </article>
  );
}
