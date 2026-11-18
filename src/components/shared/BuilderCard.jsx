import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Buildings, MapPin, ArrowRight, CheckCircle } from '@phosphor-icons/react';

export default function BuilderCard({ builder, className = '' }) {
  if (!builder) return null;

  return (
    <article 
      className={`group flex flex-col bg-white rounded-3xl p-6 border-0 shadow-xs hover:shadow-lg transition-all duration-300 text-left ${className}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
          {builder.logo ? (
            <img src={builder.logo} alt={builder.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <Buildings size={32} className="text-brand-navy" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="heading-4 text-brand-navy font-bold hover:text-brand-blue transition-colors truncate">
              <Link to={`/builders/${builder.slug || builder.id}`}>
                {builder.name}
              </Link>
            </h3>
            {builder.verified && (
              <span title="RERA Certified Corporate Developer">
                <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <p className="caption-2 text-slate-500 mt-0.5 line-clamp-1">
            {builder.tagline || 'Leading real estate developer'}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin size={12} className="text-[#C5A46D]" />
            <span>{builder.headquarters || 'Mumbai, India'}</span>
          </div>
        </div>
      </div>

      {/* Developer Metrics */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center mb-4">
        <div>
          <span className="caption-2 text-slate-400 block">Experience</span>
          <span className="caption-1 font-bold text-brand-navy">{builder.experience || '25+ yrs'}</span>
        </div>
        <div>
          <span className="caption-2 text-slate-400 block">Delivered</span>
          <span className="caption-1 font-bold text-brand-navy">{builder.deliveredProjects || '42'}</span>
        </div>
        <div>
          <span className="caption-2 text-slate-400 block">Ongoing</span>
          <span className="caption-1 font-bold text-brand-gold">{builder.ongoingProjects || '8'}</span>
        </div>
      </div>

      {/* Description Snippet */}
      {builder.description && (
        <p className="body-5 text-slate-600 line-clamp-2 mb-4">
          {builder.description}
        </p>
      )}

      {/* Action CTA */}
      <div className="mt-auto pt-2">
        <Link
          to={`/builders/${builder.slug || builder.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-brand-navy hover:text-white text-brand-navy caption-1 font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <span>Explore developer developments</span>
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </article>
  );
}
