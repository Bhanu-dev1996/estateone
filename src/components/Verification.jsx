import React from 'react';
import { ShieldCheck, FileText, CheckCircle, MapPin } from '@phosphor-icons/react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

export default function Verification() {
  const steps = [
    {
      step: '1',
      title: 'Legal and RERA registry check',
      description: 'We validate state RERA certificates, sanctioned building layout plans, and title deed records against official land portals.'
    },
    {
      step: '2',
      title: 'Geotagged physical inspection',
      description: 'Field coordinators inspect the physical property, confirm actual carpet measurements, and record high resolution photographs on site.'
    },
    {
      step: '3',
      title: 'Direct owner authorization',
      description: 'We obtain written consent from verified title holders or licensed developer representatives, preventing unverified broker reposts.'
    }
  ];

  return (
    <section id="verification" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
      <Card className="p-8 md:p-12 bg-white/75 backdrop-blur-2xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-left">
        
        {/* Section Header */}
        <div className="max-w-[65ch] mx-auto text-center mb-12">
          <Badge variant="default" className="mb-3">
            <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
            <span>Trust architecture</span>
          </Badge>
          <h2 className="text-h2 text-brand-navy mb-4 tracking-tight text-balance">
            Our three tier property verification protocol
          </h2>
          <p className="mkt-section-desc text-brand-muted">
            Every property undergoes physical and legal checks before earning the EstateOne verified badge.
          </p>
        </div>

        {/* 3 Step Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border-0 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-brand-blue flex items-center justify-center text-h4 font-bold mb-4 shadow-xs tabular-nums">
                {item.step}
              </div>
              <h3 className="text-h4 text-brand-navy font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-small text-brand-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-black/5" />

        {/* Footer Authority Bar */}
        <div className="flex flex-wrap items-center justify-between mkt-inline-stat text-brand-muted gap-3">
          <span>Official RERA registries covered: MahaRERA, Karnataka RERA, Telengana RERA, HRERA</span>
          <span className="font-semibold text-brand-navy">Sample verification methodology</span>
        </div>

      </Card>
    </section>
  );
}
