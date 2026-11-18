import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  LockKey,
  FileText,
  Eye,
  Scales,
  Clock,
  Envelope,
  Phone,
  MapPin,
  Info,
  CheckCircle,
  WarningCircle,
  ShareNetwork,
  ArrowRight
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import Breadcrumbs from '../components/shared/Breadcrumbs';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('info-collected');

  const sections = [
    { id: 'info-collected', title: '1. Information we collect' },
    { id: 'purpose-collection', title: '2. Purpose of collection' },
    { id: 'contact-enquiry-use', title: '3. Use of contact and enquiry data' },
    { id: 'data-sharing', title: '4. Data sharing with advisors and owners' },
    { id: 'cookies-analytics', title: '5. Cookies and analytics' },
    { id: 'data-retention', title: '6. Data retention and storage' },
    { id: 'user-rights', title: '7. User rights and redressal process' }
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full space-y-10">

      {/* =========================================================================
          1. HEADER & BREADCRUMBS
         ========================================================================= */}
      <section className="space-y-4">
        <Breadcrumbs
          items={[
            { label: 'Privacy policy' }
          ]}
          className="mb-2"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
            <LockKey size={15} weight="fill" />
            <span>DPDP Act 2023 compliance</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck size={14} weight="fill" />
            <span>Zero broker spam standard</span>
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="heading-1 text-brand-navy tracking-tight">
            EstateOne privacy policy.
          </h1>
          <p className="body-3 text-slate-500 leading-relaxed">
            Effective date: 18 November 2026 • Formulated under Indian data protection regulations and real estate regulatory frameworks.
          </p>
        </div>

        {/* Mandatory Jurisdictional Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-3 max-w-3xl">
          <Info size={18} weight="fill" className="text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Jurisdictional notice and legal disclaimer</span>
            <p className="text-amber-800">
              This policy describes data governance standards for the EstateOne platform operating across Indian states. In accordance with platform integrity guidelines, this text must be reviewed by qualified legal counsel in the actual operating jurisdiction prior to commercial launch. Nothing herein constitutes formal legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TWO-COLUMN LAYOUT: MAIN LEGAL TEXT & STICKY NAVIGATION
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left 8 Cols: Comprehensive Legal Sections */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-6 sm:p-10 rounded-3xl bg-white shadow-xs border-0 space-y-10">

            {/* Section 1: Information Collected */}
            <section id="info-collected" className="scroll-mt-32 space-y-3">
              <h2 className="title-1 text-brand-navy font-bold">
                1. Information we collect
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  To provide verified property discovery, site visit scheduling, and seller moderation services, EstateOne collects information in the following categories:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-brand-navy">Identity and contact records:</strong> Full legal name, verified mobile telephone number, email address, and residential territory provided during account registration, consultation requests, or enquiry submissions.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Account and authentication data:</strong> Cryptographically hashed passwords, authentication tokens, communication preferences, and active session identifiers.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Search and engagement telemetry:</strong> Saved property bookmarks, side by side comparison trays, preferred price filters, selected city territories, and search criteria.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Site visit and appointment records:</strong> Preferred walkthrough dates, scheduled time windows, property references, and coordinator notes.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Seller and developer listing submissions:</strong> Property ownership deeds, state RERA registration certificates, sanctioned architectural floor plans, municipal occupancy certificates, and geographic parcel coordinates.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2: Purpose of Collection */}
            <section id="purpose-collection" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                2. Purpose of collection
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  We collect and process personal and property information strictly for legitimate business purposes under the Digital Personal Data Protection Act, 2023:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Delivering verified property recommendations matched to your declared budget, city, and asset specifications.</li>
                  <li>Facilitating confirmed site visits and connecting property seekers with title owners and accredited developer sales desks.</li>
                  <li>Conducting rigorous physical geotagged audits and RERA legal title screening to eradicate ghost inventory.</li>
                  <li>Preventing fraudulent broker duplication and protecting consumers from unverified commercial claims.</li>
                  <li>Communicating reference numbers, verification status milestones, and customer support resolutions.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Contact & Enquiry Data Use */}
            <section id="contact-enquiry-use" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                3. Use of contact and enquiry data
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  EstateOne operates on a strict single source privacy standard:
                </p>
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-brand-navy text-xs space-y-1">
                  <span className="font-bold block">Zero unsolicited broker broadcast guarantee</span>
                  <p className="text-slate-600">
                    When you submit an enquiry on EstateOne, your contact information is shared exclusively with the single verified advisor, title owner, or master developer representing that specific property. We never broadcast your telephone number to third party telemarketing lists or speculative broker groups.
                  </p>
                </div>
                <p>
                  All telephone calls and email correspondence initiated through our platform are logged for quality assurance, safety, and regulatory compliance records.
                </p>
              </div>
            </section>

            {/* Section 4: Data Sharing */}
            <section id="data-sharing" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                4. Data sharing with advisors and owners
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  We share personal information strictly under the following controlled circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-brand-navy">With verified listing representatives:</strong> When you voluntarily submit an enquiry or schedule a site visit, your name, telephone number, and message are delivered to the listing owner or designated advisor to coordinate your appointment.
                  </li>
                  <li>
                    <strong className="text-brand-navy">With authorized inspection personnel:</strong> EstateOne regional compliance officers receive property documentation solely to conduct physical verification audits.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Statutory legal obligations:</strong> We may disclose records if required by lawful subpoenas, government regulatory authorities, or judicial orders under Indian law.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Cookies & Analytics */}
            <section id="cookies-analytics" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                5. Cookies and analytics
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  EstateOne uses minimal, secure cookies and local storage mechanisms to deliver a seamless browsing experience:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-brand-navy">Essential session cookies:</strong> Maintaining login authentication, preserving temporary guest comparison sets (up to 4 properties), and saving listing draft progress.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Performance analytics:</strong> Aggregated, anonymized telemetry tracking page loading performance, search query counts, and UI error diagnostics to improve system speed.
                  </li>
                </ul>
                <p>
                  You can configure your browser to reject cookies. However, disabling essential cookies may impact authentication persistence and saved property features.
                </p>
              </div>
            </section>

            {/* Section 6: Data Retention */}
            <section id="data-retention" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                6. Data retention and storage
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  We store personal data within secure cloud data centers located in India in full compliance with data sovereignty regulations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Account profiles and preferences are retained as long as your account remains active.</li>
                  <li>Site visit and consultation logs are preserved for 24 months to support safety verifications and consumer dispute resolution.</li>
                  <li>Seller title documents and verification certificates are archived in accordance with statutory RERA and state land record retention regulations.</li>
                </ul>
              </div>
            </section>

            {/* Section 7: User Rights & Redressal */}
            <section id="user-rights" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                7. User rights and redressal process
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  Under the Digital Personal Data Protection Act, 2023, you hold comprehensive rights regarding your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-brand-navy">Right of access:</strong> Request a summary of personal data held about you and processing activities undertaken.</li>
                  <li><strong className="text-brand-navy">Right to correction:</strong> Request immediate correction of inaccurate or outdated contact information.</li>
                  <li><strong className="text-brand-navy">Right to erasure:</strong> Request complete deletion of your account, saved lists, and communication history, subject to legal compliance retentions.</li>
                  <li><strong className="text-brand-navy">Right to grievance redressal:</strong> Contact our designated Grievance Officer with any data handling concerns.</li>
                </ul>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-brand-navy space-y-2 mt-4">
                  <span className="font-bold block">Data Protection and Grievance Officer</span>
                  <p className="text-slate-600">EstateOne Legal Compliance Cell, G Block, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051, India</p>
                  <p className="text-slate-600">Email: <a href="mailto:privacy@estateone.in" className="font-bold text-brand-blue hover:underline">privacy@estateone.in</a> • Response SLA: Within 7 business days</p>
                </div>
              </div>
            </section>

          </Card>
        </div>

        {/* Right 4 Cols: Sticky Navigation & Quick Contacts */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

          {/* Table of Contents */}
          <Card className="p-6 rounded-3xl bg-white shadow-xs border-0 space-y-3">
            <span className="caption-2 font-bold text-brand-navy block">
              Policy sections
            </span>
            <nav className="space-y-1 text-xs">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left py-2 px-3 rounded-xl transition-colors cursor-pointer font-medium ${activeSection === s.id
                      ? 'bg-brand-navy text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-navy'
                    }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </Card>

          {/* Related Terms Link */}
          <Card className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
            <span className="caption-2 font-bold text-brand-navy block">
              Related agreements
            </span>
            <p className="text-slate-500 leading-relaxed">
              Review our terms of service governing listing submission responsibilities, acceptable use, and platform limitations.
            </p>
            <Link
              to="/terms-and-conditions"
              className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline"
            >
              <span>Read terms of service</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </Card>

        </aside>

      </div>

    </div>
  );
}
