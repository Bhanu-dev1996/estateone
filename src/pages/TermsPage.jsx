import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">Terms and conditions</span>
      </nav>

      <div className="mb-8">
        <Badge variant="default" className="mb-3">
          <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
          <span>User agreement</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight mb-2">
          Terms of service and marketplace standards
        </h1>
        <p className="caption-1 text-brand-muted">
          Last updated: 18 November 2026 • Governing platform usage across all Indian states
        </p>
      </div>

      <Card className="p-8 md:p-12 rounded-3xl bg-white/80 backdrop-blur-2xl border-0 shadow-xs space-y-8 text-brand-navy">
        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">1. Acceptance of terms</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            By accessing or browsing EstateOne, searching verified listings, scheduling physical site visits, or submitting property details for publication, you agree to comply with and be bound by these marketplace terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">2. Listing verification and moderation authority</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            EstateOne reserves the right to review, audit, request supporting title deeds, or reject any property submission that fails state RERA validation, exhibits pricing discrepancies, or displays unverified photographs. Submission does not constitute automatic publication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">3. Platform fee and zero brokerage commitments</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            EstateOne provides discovery and scheduling tools to buyers and tenants free of platform fee. Any formal transaction advisory or legal conveyance contracts executed between property owners, developers, and prospective buyers are governed by their respective bilateral agreements under applicable state real estate laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="title-2 font-bold text-brand-navy">4. Intellectual property and photo rights</h2>
          <p className="body-4 text-brand-muted leading-relaxed">
            All architectural photography, high resolution floor plans, and editorial content generated during EstateOne on site inspections are protected under intellectual property statutes and may not be reproduced without written platform consent.
          </p>
        </section>
      </Card>
    </div>
  );
}
