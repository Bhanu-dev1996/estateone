import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Envelope, Star, Buildings, MapPin, ArrowRight, ChatCircleText } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { getRealAgentListings } from '../../data/agents';

export default function AgentCard({ agent, onContact, className = '' }) {
  if (!agent) return null;

  // Real data listing count per PRD 5.8
  const realListings = getRealAgentListings(agent, SAMPLE_PROPERTIES);
  const listingsCount = realListings.length;

  return (
    <article 
      className={`group flex flex-col bg-white rounded-3xl p-6 border-0 shadow-xs hover:shadow-lg transition-all duration-300 text-left ${className}`}
    >
      {/* Top Header: Avatar, Name, Verified Badge, Rating */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative shrink-0">
          <img
            src={agent.photo || agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={agent.name}
            className="w-16 h-16 rounded-2xl object-cover"
            loading="lazy"
          />
          {/* Verified status, only when verified per PRD 5.8 */}
          {agent.verified && (
            <span 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs" 
              title="Verified RERA Certified Advisor"
            >
              <ShieldCheck size={12} weight="fill" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="heading-4 text-brand-navy font-bold hover:text-brand-blue transition-colors truncate">
              <Link to={`/agents/${agent.slug || agent.id}`}>
                {agent.name}
              </Link>
            </h3>
          </div>
          <p className="caption-2 text-slate-500 truncate mt-0.5 font-medium">
            {agent.role || 'Licensed Real Estate Advisor'}
          </p>
          <p className="caption-3 text-brand-navy font-semibold truncate">
            {agent.company}
          </p>
          <div className="flex items-center gap-1 text-[#C5A46D] caption-2 font-semibold mt-1">
            <Star size={13} weight="fill" />
            <span>{agent.rating || '4.95'}</span>
            <span className="text-slate-400 font-normal">({agent.reviewCount || '28'} reviews)</span>
          </div>
        </div>
      </div>

      {/* Specialization & Experience */}
      <div className="space-y-2 py-3 border-y border-slate-100 text-slate-600 caption-2 mb-4">
        {/* Experience, only when supplied per PRD 5.8 */}
        {agent.experience && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Experience:</span>
            <span className="font-semibold text-brand-navy">{agent.experience}</span>
          </div>
        )}
        
        {agent.city && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Territory:</span>
            <span className="font-medium text-brand-navy flex items-center gap-1">
              <MapPin size={12} className="text-[#C5A46D]" />
              <span>{agent.city}</span>
            </span>
          </div>
        )}

        {/* Listed properties count, based on real data per PRD 5.8 */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Active listings:</span>
          <span className="font-semibold text-emerald-700 flex items-center gap-1">
            <Buildings size={12} />
            <span>{listingsCount} {listingsCount === 1 ? 'property' : 'properties'}</span>
          </span>
        </div>

        {agent.specialization && (
          <div className="pt-1 text-slate-500 line-clamp-1">
            <span className="text-slate-400">Focus: </span>
            <span className="text-slate-700 font-medium">{agent.specialization}</span>
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
        <Link
          to={`/agents/${agent.slug || agent.id}`}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy caption-1 font-semibold text-center transition-colors flex items-center justify-center gap-1"
        >
          <span>View profile</span>
          <ArrowRight size={13} weight="bold" />
        </Link>

        {agent.publicContact ? (
          <a
            href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
            className="py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white caption-1 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Phone size={14} weight="bold" />
            <span>Call agent</span>
          </a>
        ) : (
          <Link
            to={`/agents/${agent.slug || agent.id}#enquire`}
            className="py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white caption-1 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChatCircleText size={14} weight="bold" />
            <span>Contact</span>
          </Link>
        )}
      </div>
    </article>
  );
}
