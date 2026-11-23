import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Buildings, MapPin, ArrowRight, ChatCircleText } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { getRealBuilderListings } from '../../data/agents';
import { MKT_ICON } from '../../lib/iconScale';

export default function BuilderCard({ builder, className = '' }) {
  if (!builder) return null;

  const realListings = getRealBuilderListings(builder, SAMPLE_PROPERTIES);
  const listingsCount = realListings.length;

  return (
    <article className={`directory-card builder-card group ${className}`.trim()}>
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
            <Buildings size={MKT_ICON.xl} className="text-brand-navy" aria-hidden />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="directory-card__title truncate">
              <Link to={`/builders/${builder.slug || builder.id}`}>{builder.name}</Link>
            </h3>
            {builder.verified && (
              <span title="RERA Certified Corporate Developer">
                <ShieldCheck size={MKT_ICON.md} weight="fill" className="text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <p className="directory-card__subtitle mt-0.5 line-clamp-1">
            {builder.tagline || 'Leading real estate developer'}
          </p>
          <div className="directory-card__subtitle flex items-center gap-1.5 mt-1">
            <MapPin size={MKT_ICON.xs} className="text-brand-gold shrink-0" aria-hidden />
            <span className="truncate">{builder.headquarters || `${builder.city}, India`}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center mb-4">
        <div>
          <span className="directory-card__fact-label block">Experience</span>
          <span className="text-small font-semibold text-brand-navy block">
            {builder.experience || (builder.established ? `Est. ${builder.established}` : 'Established')}
          </span>
        </div>
        <div>
          <span className="directory-card__fact-label block">Delivered</span>
          <span className="text-small font-semibold text-brand-navy block">
            {builder.completedProjectsCount || '40'}+
          </span>
        </div>
        <div>
          <span className="directory-card__fact-label block">Listings</span>
          <span className="text-small font-semibold text-emerald-700 block">{listingsCount} active</span>
        </div>
      </div>

      {builder.description && (
        <p className="text-small text-slate-600 line-clamp-2 mb-4 text-pretty">{builder.description}</p>
      )}

      <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
        <Link
          to={`/builders/${builder.slug || builder.id}`}
          className="directory-card__cta directory-card__cta--secondary"
        >
          <span>View profile</span>
          <ArrowRight size={MKT_ICON.sm} weight="bold" aria-hidden />
        </Link>

        <Link
          to={`/builders/${builder.slug || builder.id}#enquire`}
          className="directory-card__cta directory-card__cta--primary"
        >
          <ChatCircleText size={MKT_ICON.sm} weight="bold" aria-hidden />
          <span>Contact</span>
        </Link>
      </div>
    </article>
  );
}