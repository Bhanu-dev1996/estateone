import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Buildings } from '@phosphor-icons/react';
import { SAMPLE_BUILDERS } from '../data/agents';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function BuilderDetailPage() {
  const { slug } = useParams();
  const builder = SAMPLE_BUILDERS.find((b) => b.slug === slug || b.id === slug) || SAMPLE_BUILDERS[0];

  const projects = SAMPLE_PROPERTIES.slice(0, 2);

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <Link to="/builders" className="hover:text-brand-navy">Builders</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">{builder.name}</span>
      </nav>

      <Card className="p-8 mb-10 rounded-3xl bg-white/75 backdrop-blur-2xl border-0 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">
                <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
                <span>RERA ID: {builder.reraRegistration}</span>
              </Badge>
              <span className="caption-2 text-brand-muted">Established {builder.established}</span>
            </div>
            <h1 className="heading-2 text-brand-navy font-bold">{builder.name}</h1>
            <p className="body-3 text-brand-blue font-medium mt-1">{builder.tagline}</p>
            <p className="body-4 text-brand-muted mt-3 max-w-2xl leading-relaxed">{builder.description}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 shrink-0">
            <p><span className="font-semibold text-brand-navy">Headquarters:</span> {builder.headquarters}</p>
            <p><span className="font-semibold text-brand-navy">Active projects:</span> {builder.ongoingProjectsCount}</p>
            <p><span className="font-semibold text-brand-navy">Delivered units:</span> {builder.completedProjectsCount}+</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="heading-2 text-brand-navy font-bold mb-6">Featured developments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <Card key={p.id} className="overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border-0 shadow-xs">
              <img src={p.images[0]} alt={p.title} className="w-full aspect-[16/10] object-cover" />
              <div className="p-5">
                <p className="caption-2 text-brand-muted mb-1">{p.location}</p>
                <h3 className="title-2 text-brand-navy font-semibold line-clamp-1 mb-2">{p.title}</h3>
                <p className="title-2 text-brand-blue font-bold">{p.priceDisplay}</p>
                <Link
                  to={`/property/${p.slug || p.id}`}
                  className="mt-4 block text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-brand-navy"
                >
                  Explore project units
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
