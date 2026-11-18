import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Buildings, 
  CheckCircle, 
  XCircle,
  FileText, 
  Sparkle, 
  ArrowRight, 
  LockKey, 
  Scales, 
  HouseLine, 
  Info,
  CalendarCheck,
  MagnifyingGlass,
  ChatCircleDots
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import Breadcrumbs from '../components/shared/Breadcrumbs';

export default function AboutPage() {
  const whatWeDoItems = [
    {
      icon: ShieldCheck,
      title: 'Physical and document verification',
      description: 'Every represented listing undergoes rigorous on site photographic validation and state RERA registration checks before earning public display status.'
    },
    {
      icon: Scales,
      title: 'Transparent carpet area disclosures',
      description: 'We publish genuine RERA carpet area measurements and transparent maintenance schedules, eliminating inflated super built up claims.'
    },
    {
      icon: ChatCircleDots,
      title: 'Direct seller and advisor connectivity',
      description: 'We connect property seekers directly with verified title holders, master developers, and licensed advisors with zero middleman call center spam.'
    },
    {
      icon: CalendarCheck,
      title: 'Confirmed site visit scheduling',
      description: 'Prospective buyers and corporate tenants can reserve confirmed in person property walkthroughs or live guided video tours online.'
    }
  ];

  const brandValues = [
    {
      icon: ShieldCheck,
      title: 'Uncompromising authenticity',
      description: 'Zero tolerance for ghost listings, speculative pricing, or outdated availability. What you see on screen reflects real, currently available real estate.'
    },
    {
      icon: Scales,
      title: 'Radical pricing clarity',
      description: 'Full upfront disclosures on carpet area rates, society maintenance dues, and estimated registration costs without surprise broker demands.'
    },
    {
      icon: LockKey,
      title: 'Client privacy first',
      description: 'We safeguard user contact information with strict consent controls. Your phone number is never sold or shared with unsolicited call centers.'
    },
    {
      icon: Sparkle,
      title: 'Architectural distinction',
      description: 'Curating residences and commercial spaces characterized by thoughtful spatial design, superior construction quality, and prime geographic territories.'
    }
  ];

  const platformSteps = [
    {
      step: '01',
      icon: MagnifyingGlass,
      title: 'Discovery and smart filtering',
      description: 'Explore curated residential and commercial properties by city, territory, property type, or specific transaction model.'
    },
    {
      step: '02',
      icon: FileText,
      title: 'Credential and RERA inspection',
      description: 'Review verified carpet measurements, official RERA certificate IDs, floor plan drawings, and itemized society charges.'
    },
    {
      step: '03',
      icon: CalendarCheck,
      title: 'Site visit scheduling',
      description: 'Select your preferred date and time slot to tour the property in person or schedule an interactive video walkthrough.'
    },
    {
      step: '04',
      icon: ChatCircleDots,
      title: 'Direct advisory consultation',
      description: 'Connect directly with verified title owners or accredited regional advisors for confidential negotiations and closing.'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Listing authenticity',
      traditional: 'Unverified listings with ghost inventory and duplicate postings',
      estateone: '100% physically inspected and RERA verified listings only'
    },
    {
      feature: 'Pricing transparency',
      traditional: 'Vague super built up prices with hidden fees and surprise charges',
      estateone: 'Clear carpet area rates, maintenance fees, and estimated stamp duty'
    },
    {
      feature: 'Contact and privacy',
      traditional: 'Contact details sold to third party brokers leading to spam calls',
      estateone: 'Confidential advisory line with zero unsolicited marketing'
    },
    {
      feature: 'Site visit bookings',
      traditional: 'Manual coordination with uncertain agent availability',
      estateone: 'Online date and time slot booking with confirmed hosts'
    },
    {
      feature: 'Media quality',
      traditional: 'Low resolution, watermarked, or generic stock photography',
      estateone: 'High resolution architectural photography and verified floor plans'
    }
  ];

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full space-y-20">
      
      {/* =========================================================================
          1. HERO / COMPANY INTRODUCTION
         ========================================================================= */}
      <section className="space-y-6">
        <Breadcrumbs 
          items={[
            { label: 'About us' }
          ]} 
          className="mb-2" 
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
            <ShieldCheck size={15} weight="fill" />
            <span>EstateOne verified real estate standard</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <Info size={14} weight="fill" />
            <span>Platform concept demonstration</span>
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Redefining real estate discovery with verified clarity.
          </h1>
          <p className="body-2 text-slate-600 leading-relaxed max-w-3xl">
            EstateOne is a modern verified real estate marketplace designed to eliminate the frustration of ghost listings, inaccurate floor plans, and predatory broker markups. We bring institutional clarity, verified title credentials, and direct seller connectivity to India premier property markets.
          </p>
        </div>

        {/* Content Integrity Disclosure Callout */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3 max-w-3xl">
          <Info size={18} weight="fill" className="text-brand-blue shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-brand-navy block">Demonstration brand disclosure</span>
            <p className="text-slate-500 leading-relaxed">
              EstateOne is presented as a premier real estate platform concept and design system portfolio showcase. In keeping with content integrity standards, all listings, developer disclosures, and advisor profiles are curated for architectural and technological demonstration purposes.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2 & 3. MISSION & VISION
         ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <Card className="p-8 sm:p-10 rounded-3xl bg-white shadow-xs border-0 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shadow-xs">
              <Target size={26} weight="fill" />
            </div>
            <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block">
              Our mission
            </span>
            <h2 className="heading-3 text-brand-navy font-bold">
              Restoring trust to high value property transactions.
            </h2>
            <p className="body-3 text-slate-600 leading-relaxed">
              Our mission is to establish an uncompromising verification standard in Indian real estate discovery. By validating every listing against physical reality, certified carpet areas, and official state regulatory filings, we empower property seekers to make life shaping decisions without uncertainty or speculative misinformation.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <CheckCircle size={15} weight="fill" className="text-emerald-600" />
            <span>Dedicated to authenticity and zero ghost listings</span>
          </div>
        </Card>

        {/* Vision Card */}
        <Card className="p-8 sm:p-10 rounded-3xl bg-white shadow-xs border-0 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-gold flex items-center justify-center shadow-xs">
              <Eye size={26} weight="fill" className="text-brand-gold" />
            </div>
            <span className="caption-2 font-bold text-brand-gold tracking-wider uppercase block">
              Our vision
            </span>
            <h2 className="heading-3 text-brand-navy font-bold">
              The benchmark for verified luxury and commercial realty.
            </h2>
            <p className="body-3 text-slate-600 leading-relaxed">
              We envision a future where finding a luxury home or corporate headquarters is entirely transparent, seamless, and dignified. An ecosystem where buyers and tenants inspect authentic architectural plans, evaluate clear financial schedules, and tour properties with complete confidence in their legal legitimacy.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <CheckCircle size={15} weight="fill" className="text-emerald-600" />
            <span>Institutional clarity across India premier cities</span>
          </div>
        </Card>

      </section>

      {/* =========================================================================
          4. WHAT WE DO
         ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block mb-1">
            Operational pillars
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            What we do at EstateOne.
          </h2>
          <p className="body-4 text-slate-500 mt-2">
            We provide a verified technology layer connecting bona fide buyers and tenants with authentic property owners, master developers, and accredited advisors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeDoItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title} 
                className="p-6 rounded-3xl bg-white shadow-xs border-0 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-navy mb-4 shadow-xs">
                    <Icon size={24} weight="fill" className="text-brand-blue" />
                  </div>
                  <h3 className="title-2 text-brand-navy font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="caption-2 text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. WHY CHOOSE ESTATEONE (Comparison Console)
         ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block mb-1">
            Comparative advantage
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            Why choose EstateOne.
          </h2>
          <p className="body-4 text-slate-500 mt-2">
            See how our verified inspection protocol contrasts with the chaos of conventional property portals and unvetted classifieds.
          </p>
        </div>

        <Card className="rounded-3xl bg-white shadow-xs border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-4 px-6 font-bold text-brand-navy w-1/4">Evaluation criteria</th>
                  <th className="py-4 px-6 font-bold text-rose-700 w-3/8">Traditional portals</th>
                  <th className="py-4 px-6 font-bold text-emerald-700 w-3/8">EstateOne verified standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-brand-navy">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-start gap-2">
                        <XCircle size={15} weight="fill" className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-brand-navy font-medium">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={15} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.estateone}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* =========================================================================
          6. HOW THE PLATFORM WORKS
         ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block mb-1">
            Intuitive workflow
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            How the platform works.
          </h2>
          <p className="body-4 text-slate-500 mt-2">
            Four seamless steps from online exploration to your private in person site inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformSteps.map((st) => {
            const Icon = st.icon;
            return (
              <Card 
                key={st.step} 
                className="p-6 rounded-3xl bg-white shadow-xs border-0 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-extrabold text-2xl text-brand-blue/20">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-navy shadow-xs">
                      <Icon size={20} weight="fill" className="text-brand-blue" />
                    </div>
                  </div>
                  <h3 className="title-2 text-brand-navy font-bold mb-2">
                    {st.title}
                  </h3>
                  <p className="caption-2 text-slate-500 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          7. BRAND VALUES
         ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <span className="caption-2 font-bold text-brand-blue tracking-wider uppercase block mb-1">
            Our guiding principles
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            EstateOne brand values.
          </h2>
          <p className="body-4 text-slate-500 mt-2">
            Every feature, policy, and interaction on EstateOne is grounded in four foundational pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandValues.map((val) => {
            const Icon = val.icon;
            return (
              <Card 
                key={val.title} 
                className="p-6 rounded-3xl bg-white shadow-xs border-0 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/70 border border-blue-100/60 flex items-center justify-center text-brand-navy mb-4 shadow-xs">
                    <Icon size={24} weight="fill" className="text-brand-blue" />
                  </div>
                  <h3 className="title-2 text-brand-navy font-bold mb-2">
                    {val.title}
                  </h3>
                  <p className="caption-2 text-slate-500 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. CTA — EXPLORE PROPERTIES
         ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-[#142B4A] text-white p-8 md:p-14 border-0 shadow-2xl">
        {/* Subtle Architectural Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A46D]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] block flex items-center gap-2">
            <HouseLine size={18} weight="fill" />
            <span>Begin your verified property journey</span>
          </span>

          <h2 className="heading-1 text-white font-bold tracking-tight">
            Discover verified residences across premier Indian cities.
          </h2>

          <p className="body-3 text-slate-300 leading-relaxed max-w-2xl">
            Browse luxury penthouses, gated estate villas, and Grade A commercial offices with verified RERA documentation, physical site inspections, and upfront pricing schedules.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/buy"
              className="py-3.5 px-7 rounded-2xl bg-[#C5A46D] hover:bg-[#b0915d] text-brand-navy font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Explore properties</span>
              <ArrowRight size={14} weight="bold" />
            </Link>

            <Link
              to="/list-property"
              className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>List your property</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
