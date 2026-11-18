import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Scales, 
  LockKey, 
  Buildings, 
  WarningCircle, 
  CheckCircle, 
  Info,
  ArrowRight,
  User,
  Gavel
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import Breadcrumbs from '../components/shared/Breadcrumbs';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptable-use');

  const sections = [
    { id: 'acceptable-use', title: '1. Acceptable use standards' },
    { id: 'listing-responsibilities', title: '2. Listing submission responsibilities' },
    { id: 'accuracy-disclosures', title: '3. Accuracy of listing information' },
    { id: 'moderation-removal', title: '4. Moderation and removal rights' },
    { id: 'third-party-relationships', title: '5. Third party agent and owner relationships' },
    { id: 'disclaimer-limitations', title: '6. Disclaimer and limitations of liability' },
    { id: 'account-responsibilities', title: '7. User account responsibilities' }
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
            { label: 'Terms and conditions' }
          ]} 
          className="mb-2" 
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
            <Gavel size={15} weight="fill" />
            <span>Marketplace operating agreement</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck size={14} weight="fill" />
            <span>RERA compliance standards</span>
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Terms of service and marketplace standards.
          </h1>
          <p className="body-3 text-slate-500 leading-relaxed">
            Effective date: 18 November 2026 • Governing platform access, seller verification protocols, and visitor safety across Indian real estate markets.
          </p>
        </div>

        {/* Mandatory Jurisdictional Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-3 max-w-3xl">
          <Info size={18} weight="fill" className="text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Jurisdictional notice and legal disclaimer</span>
            <p className="text-amber-800">
              These terms govern the EstateOne technology platform concept. In accordance with platform integrity rules, this legal agreement must be formally reviewed and tailored by qualified legal counsel in the applicable operating jurisdiction prior to commercial deployment. Nothing herein constitutes formal legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TWO-COLUMN LAYOUT: MAIN TERMS & STICKY NAVIGATION
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 8 Cols: Comprehensive Terms Sections */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-6 sm:p-10 rounded-3xl bg-white shadow-xs border-0 space-y-10">
            
            {/* Section 1: Acceptable Use */}
            <section id="acceptable-use" className="scroll-mt-32 space-y-3">
              <h2 className="title-1 text-brand-navy font-bold">
                1. Acceptable use standards
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  EstateOne grants users a limited, non exclusive, revocable license to access our platform solely for bona fide residential and commercial property discovery, scheduling site visits, and managing legitimate property listings.
                </p>
                <p>Users expressly agree not to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Harvest, crawl, scrape, or extract property data, photography, or advisor contact information through automated scripts, bots, or software.</li>
                  <li>Post misleading, fictitious, speculative, or unverified property specifications, prices, or occupancy dates.</li>
                  <li>Impersonate legal title owners, developers, or accredited brokers without written legal mandate.</li>
                  <li>Use telephone numbers or email addresses obtained from EstateOne for unsolicited marketing, spam, or telemarketing lists.</li>
                  <li>Attempt to bypass or defeat platform moderation checkpoints, access controls, or security filters.</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Listing Submission Responsibilities */}
            <section id="listing-responsibilities" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                2. Listing submission responsibilities
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  Any individual or corporate entity submitting a property for publication on EstateOne warrants and represents that:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>They are the sole legal title owner, an authorized family member holding valid power of attorney, a state RERA licensed broker holding an active developer mandate, or an authorized corporate promoter.</li>
                  <li>They possess all necessary municipal approvals, non agricultural sanctions, and society NOCs required to market the asset legally.</li>
                  <li>They agree to facilitate physical on site verification audits by EstateOne regional compliance coordinators and provide original documentation for inspection when requested.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Accuracy of Listing Information */}
            <section id="accuracy-disclosures" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                3. Accuracy of listing information
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  In compliance with state real estate regulatory acts, submitters must maintain strict accuracy across all published data:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-brand-navy">Carpet area mandate:</strong> All residential properties must be priced and described strictly on RERA certified net usable carpet area. Marketing super built up loadings must not be used to inflate physical living space.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Transparent pricing:</strong> Quoted prices must reflect genuine owner expectations. Upfront disclosure of mandatory society maintenance dues and estimated registration fees is required.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Timely status updates:</strong> Submitters must notify EstateOne within 24 hours of executing a sale deed, allotment letter, or lease agreement to unpublish or update listing status.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Moderation & Removal Rights */}
            <section id="moderation-removal" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                4. Moderation and removal rights
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block">Important moderation checkpoint</span>
                  <p className="text-amber-800">
                    Submission does not automatically mean that a property is verified or published. Verification and publication must follow the moderation process.
                  </p>
                </div>
                <p>
                  EstateOne retains absolute discretionary authority to hold, review, audit, request further documentation, reject, or unpublish any listing that fails legal scrutiny, exhibits pricing discrepancies, displays unauthorized photography, or attracts credible consumer complaints. Unpublishing may occur without prior notice if title legitimacy is questioned.
                </p>
              </div>
            </section>

            {/* Section 5: Third Party Relationships */}
            <section id="third-party-relationships" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                5. Third party agent and owner relationships
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  EstateOne operates as an independent verified technology marketplace connecting property seekers directly with owners, master developers, and accredited advisors.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>EstateOne is not an escrow depository, banking intermediary, title insurer, or legal conveyance attorney.</li>
                  <li>Any contract for sale, allotment letter, conveyance deed, or leave and license agreement executed between parties constitutes an independent, bilateral contract governed by state property statutes.</li>
                  <li>Buyers and tenants must conduct independent legal title diligence and structural surveys through certified legal counsel before transferring booking earnest money.</li>
                </ul>
              </div>
            </section>

            {/* Section 6: Disclaimer & Limitations */}
            <section id="disclaimer-limitations" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                6. Disclaimer and limitations of liability
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  The EstateOne platform is provided on an "as is" and "as available" basis without unsupported warranties:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-brand-navy">No financial or investment guarantee:</strong> EstateOne makes no representation or warranty regarding future capital appreciation, rental yield forecasts, or economic performance of any real estate asset.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Limitation of liability:</strong> To the maximum extent permitted by applicable Indian law, EstateOne shall not be liable for indirect, incidental, punitive, or consequential damages resulting from transaction negotiations, advisor advice, or temporary service interruptions.
                  </li>
                  <li>
                    <strong className="text-brand-navy">Force majeure:</strong> EstateOne is not liable for failures caused by natural disasters, telecommunications outages, or statutory regulatory amendments.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7: User Account Responsibilities */}
            <section id="account-responsibilities" className="scroll-mt-32 space-y-3 border-t border-slate-100 pt-8">
              <h2 className="title-1 text-brand-navy font-bold">
                7. User account responsibilities
              </h2>
              <div className="space-y-3 body-4 text-slate-600 leading-relaxed">
                <p>
                  When registering an account on EstateOne, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Maintain strict confidentiality of your authentication credentials and one time passwords (OTPs).</li>
                  <li>Accept full legal responsibility for all listings, messages, and enquiries generated under your verified account.</li>
                  <li>Notify EstateOne immediately at <span className="font-semibold text-brand-blue">support@estateone.in</span> if you detect unauthorized access or compromised security credentials.</li>
                </ul>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-brand-navy mt-4 space-y-1">
                  <span className="font-bold block">Governing law and jurisdiction</span>
                  <p className="text-slate-600">
                    These marketplace terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
                  </p>
                </div>
              </div>
            </section>

          </Card>
        </div>

        {/* Right 4 Cols: Sticky Navigation & Quick Policy Links */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
          {/* Table of Contents */}
          <Card className="p-6 rounded-3xl bg-white shadow-xs border-0 space-y-3">
            <span className="caption-2 font-bold text-brand-navy block">
              Agreement sections
            </span>
            <nav className="space-y-1 text-xs">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left py-2 px-3 rounded-xl transition-colors cursor-pointer font-medium ${
                    activeSection === s.id
                      ? 'bg-brand-navy text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-navy'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </Card>

          {/* Related Privacy Link */}
          <Card className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
            <span className="caption-2 font-bold text-brand-navy block">
              Data governance policy
            </span>
            <p className="text-slate-500 leading-relaxed">
              Understand how your contact information, search preferences, and inquiry data are protected under DPDP Act regulations.
            </p>
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline"
            >
              <span>Read privacy policy</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </Card>

        </aside>

      </div>

    </div>
  );
}
