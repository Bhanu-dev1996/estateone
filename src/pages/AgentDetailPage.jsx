import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Envelope } from '@phosphor-icons/react';
import { SAMPLE_AGENTS } from '../data/agents';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function AgentDetailPage({ onScheduleVisit }) {
  const { slug } = useParams();
  const agent = SAMPLE_AGENTS.find((a) => a.slug === slug || a.id === slug) || SAMPLE_AGENTS[0];

  // Get active listings for this agent
  const agentListings = SAMPLE_PROPERTIES.filter(
    (p) => p.agent.name.toLowerCase().includes(agent.name.toLowerCase().split(' ')[0]) || p.city === agent.city
  ).slice(0, 3);

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <Link to="/agents" className="hover:text-brand-navy">Agents</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">{agent.name}</span>
      </nav>

      {/* Profile Header Card */}
      <Card className="p-8 mb-10 rounded-3xl bg-white/75 backdrop-blur-2xl border-0 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img src={agent.photo} alt={agent.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="heading-2 text-brand-navy font-bold">{agent.name}</h1>
              <ShieldCheck size={20} weight="fill" className="text-brand-blue" />
            </div>
            <p className="body-4 text-brand-blue font-semibold">{agent.role} • {agent.company}</p>
            <p className="caption-1 text-brand-muted mt-1">{agent.city} • RERA License: {agent.reraNumber}</p>
            <p className="caption-2 text-emerald-700 font-medium mt-1">{agent.experience} • Rating {agent.rating} / 5.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
            className="px-5 py-2.5 rounded-full bg-brand-navy text-white text-xs font-semibold hover:bg-slate-900 transition-all flex items-center gap-2 shadow-xs"
          >
            <Phone size={16} weight="bold" />
            <span>Call agent</span>
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-brand-navy text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Envelope size={16} weight="bold" />
            <span>Send email</span>
          </a>
        </div>
      </Card>

      {/* Bio Section */}
      <div className="mb-12">
        <h2 className="title-2 text-brand-navy font-semibold mb-3">About {agent.name}</h2>
        <p className="body-3 text-brand-muted leading-relaxed max-w-3xl">
          {agent.bio}
        </p>
        <p className="body-4 text-brand-muted leading-relaxed max-w-3xl mt-2">
          Areas served: <span className="font-semibold text-brand-navy">{agent.areasServed}</span>. Specializing in {agent.specialization}.
        </p>
      </div>

      {/* Active Listings by Agent */}
      <div>
        <h2 className="heading-2 text-brand-navy font-bold mb-6">Active verified listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agentListings.map((property) => (
            <Card key={property.id} className="overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border-0 shadow-xs">
              <img src={property.images[0]} alt={property.title} className="w-full aspect-[16/10] object-cover" />
              <div className="p-5">
                <p className="caption-2 text-brand-muted mb-1">{property.location}</p>
                <h3 className="title-3 text-brand-navy font-semibold line-clamp-1 mb-2">{property.title}</h3>
                <p className="title-2 text-brand-blue font-bold">{property.priceDisplay}</p>
                <Link
                  to={`/property/${property.slug || property.id}`}
                  className="mt-4 block text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-brand-navy"
                >
                  View property
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
