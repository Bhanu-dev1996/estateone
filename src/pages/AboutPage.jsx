import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Buildings, CheckCircle, MapPin, Handshake } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function AboutPage() {
  const values = [
    {
      title: 'Zero fake listings',
      description: 'Every property is matched against state land records and verified by on site inspection before earning publication status.'
    },
    {
      title: 'Direct seller connectivity',
      description: 'We connect buyers and tenants directly with title owners and licensed developer advisors with zero middleman markups.'
    },
    {
      title: 'Complete pricing transparency',
      description: 'Upfront carpet area rates, maintenance charges, and estimated registration costs without surprise broker demands.'
    }
  ];

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">About us</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-12 max-w-3xl">
        <Badge variant="default" className="mb-3">
          <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
          <span>Our heritage and mission</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight mb-4">
          Redefining real estate discovery with uncompromising trust
        </h1>
        <p className="body-2 text-brand-muted leading-relaxed">
          EstateOne was created to eliminate the frustration of ghost listings, inaccurate photos, and predatory broker markups. We are building India most trusted verified real estate marketplace.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {values.map((v) => (
          <Card key={v.title} className="p-8 rounded-3xl bg-white/75 backdrop-blur-md border-0 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold mb-6">
              <CheckCircle size={24} weight="fill" />
            </div>
            <h2 className="title-2 text-brand-navy font-semibold mb-2">{v.title}</h2>
            <p className="body-4 text-brand-muted leading-relaxed">{v.description}</p>
          </Card>
        ))}
      </div>

      {/* 3 Tier Architecture Card */}
      <Card className="p-8 md:p-12 mb-16 rounded-3xl bg-brand-navy text-white border-0 shadow-xl">
        <div className="max-w-2xl">
          <Badge className="bg-white/10 text-brand-gold border-white/20 mb-3">
            <span>RERA inspection standard</span>
          </Badge>
          <h2 className="heading-2 font-bold mb-4">The EstateOne verification promise</h2>
          <p className="body-3 text-slate-200 leading-relaxed mb-6">
            We physically visit properties, record high definition geotagged media, verify carpet measurements, and examine legal title clearance documents against state portals.
          </p>
          <Link to="/buy">
            <Button size="lg" className="bg-white text-brand-navy hover:bg-slate-100 rounded-full font-semibold">
              Explore verified properties
            </Button>
          </Link>
        </div>
      </Card>

      {/* Portfolio Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-100/70 text-xs text-brand-muted max-w-2xl">
        <p className="font-semibold text-brand-navy mb-1">Demonstration brand note</p>
        <p>EstateOne is a demonstration real estate platform portfolio concept. Sample listings, agent profiles, and statistics are presented for architectural and interface demonstration purposes.</p>
      </div>
    </div>
  );
}
