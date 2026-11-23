import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Star, Buildings, MapPin, ArrowRight, ChatCircleText } from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { getRealAgentListings } from '../../data/agents';
import { MKT_ICON } from '../../lib/iconScale';

export default function AgentCard({ agent, onContact, className = '' }) {
  if (!agent) return null;

  const realListings = getRealAgentListings(agent, SAMPLE_PROPERTIES);
  const listingsCount = realListings.length;

  return (
    <article className={`directory-card agent-card group ${className}`.trim()}>
      <div className="flex items-start gap-4 mb-4">
        <div className="relative shrink-0">
          <img
            src={agent.photo || agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={agent.name}
            className="w-16 h-16 rounded-2xl object-cover"
            loading="lazy"
          />
          {agent.verified && (
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs"
              title="Verified RERA Certified Advisor"
            >
              <ShieldCheck size={MKT_ICON.xs} weight="fill" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="directory-card__title truncate">
            <Link to={`/agents/${agent.slug || agent.id}`}>{agent.name}</Link>
          </h3>
          <p className="directory-card__subtitle truncate">
            {agent.role || 'Licensed Real Estate Advisor'}
          </p>
          <p className="directory-card__company truncate">{agent.company}</p>
          <div className="directory-card__rating">
            <Star size={MKT_ICON.sm} weight="fill" aria-hidden />
            <span>{agent.rating || '4.95'}</span>
            <span className="directory-card__rating-meta">({agent.reviewCount || '28'} reviews)</span>
          </div>
        </div>
      </div>

      <div className="directory-card__facts space-y-2">
        {agent.experience && (
          <div className="directory-card__fact">
            <span className="directory-card__fact-label">Experience</span>
            <span className="directory-card__fact-value">{agent.experience}</span>
          </div>
        )}

        {agent.city && (
          <div className="directory-card__fact">
            <span className="directory-card__fact-label">Territory</span>
            <span className="directory-card__fact-value inline-flex items-center gap-1">
              <MapPin size={MKT_ICON.xs} className="text-brand-gold shrink-0" aria-hidden />
              <span>{agent.city}</span>
            </span>
          </div>
        )}

        <div className="directory-card__fact">
          <span className="directory-card__fact-label">Active listings</span>
          <span className="directory-card__fact-value directory-card__fact-value--accent inline-flex items-center gap-1">
            <Buildings size={MKT_ICON.xs} aria-hidden />
            <span>
              {listingsCount} {listingsCount === 1 ? 'property' : 'properties'}
            </span>
          </span>
        </div>

        {agent.specialization && (
          <p className="pt-1 line-clamp-1">
            <span className="directory-card__fact-label">Focus </span>
            <span className="text-small font-medium text-brand-text">{agent.specialization}</span>
          </p>
        )}
      </div>

      <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
        <Link
          to={`/agents/${agent.slug || agent.id}`}
          className="directory-card__cta directory-card__cta--secondary"
        >
          <span>View profile</span>
          <ArrowRight size={MKT_ICON.sm} weight="bold" aria-hidden />
        </Link>

        {agent.publicContact ? (
          <a
            href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
            className="directory-card__cta directory-card__cta--primary"
          >
            <Phone size={MKT_ICON.sm} weight="bold" aria-hidden />
            <span>Call agent</span>
          </a>
        ) : (
          <Link
            to={`/agents/${agent.slug || agent.id}#enquire`}
            className="directory-card__cta directory-card__cta--primary"
          >
            <ChatCircleText size={MKT_ICON.sm} weight="bold" aria-hidden />
            <span>Contact</span>
          </Link>
        )}
      </div>
    </article>
  );
}