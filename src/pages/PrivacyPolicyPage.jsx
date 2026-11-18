import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">Privacy policy</span>
      </nav>

      <div className="mb-8">
        <Badge variant="default" className="mb-3">
          <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
          <span>Compliance and disclosures</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight mb-2">
          EstateOne privacy policy
        </h1>
        <p className="caption-1 text-brand-muted">
          Last updated: 18 November 2026 • Valid for operations across Indian jurisdictions
        </p>
      </div>

      <Card className="p-8 md:p-12 rounded-3xl bg-white/80 backdrop-blur-2xl border-0 shadow-xs space-y-8 text-brand-navy">
        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">1. Information we collect</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            When you explore properties, schedule site visits, or submit listings on EstateOne, we collect contact details (full name, verified phone number, email address), search preferences, and geolocation identifiers strictly necessary to deliver property matching and scheduling services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">2. How your data is utilized</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            Your contact information is shared solely with the verified property owner, authorized developer representative, or licensed RERA advisor responsible for the specific listing you inquire about. We enforce strict non solicitation agreements preventing unverified broker distribution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">3. Land records and RERA verification data</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            Property ownership documents and state RERA registration numbers submitted by sellers or builders are audited against official land registry portals (such as MahaRERA, Karnataka RERA, and HRERA) and encrypted in compliance with Indian information technology regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">4. Data retention and user rights</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            You may request deletion of your saved shortlists, account credentials, or consultation history at any time by contacting our BKC Mumbai data compliance desk at <span className="font-semibold text-brand-blue">privacy@estateone.in</span>.
          </p>
        </section>
      </Card>
    </div>
  );
}
