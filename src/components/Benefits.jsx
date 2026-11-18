import React from 'react';
import { ShieldCheck, Receipt, ChatCircleDots, CalendarCheck } from '@phosphor-icons/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export default function Benefits() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Verified ownership records',
      description: 'Physical inspection and title checks confirm genuine listings before they appear on your screen, eliminating ghost properties.',
      badge: 'Zero fake listings'
    },
    {
      icon: Receipt,
      title: 'Transparent price breakdowns',
      description: 'Review complete upfront costs including carpet area rates, society maintenance, and estimated registration without surprise fees.',
      badge: 'Zero hidden fees'
    },
    {
      icon: ChatCircleDots,
      title: 'Direct seller connections',
      description: 'Connect directly with verified owners, developers, and licensed advisors through phone or WhatsApp without third party call centers.',
      badge: 'Direct access'
    },
    {
      icon: CalendarCheck,
      title: 'Guaranteed site visit slots',
      description: 'Select your preferred date and time online for in person property walkthroughs or live guided video tours with confirmed hosts.',
      badge: 'Free visit bookings'
    }
  ];

  return (
    <section id="why-us" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <Badge variant="default" className="mb-3">
          Why choose EstateOne
        </Badge>
        <h2 className="heading-2 text-brand-navy mb-4 tracking-tight text-balance">
          Real estate discovery built on authenticity
        </h2>
        <p className="body-2 text-brand-muted text-pretty">
          Finding your next property should be transparent. Here is how we remove the uncertainty of traditional property portals.
        </p>
      </div>

      {/* Benefits Grid using Apple Glass Cards (Borderless) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((item) => {
          const Icon = item.icon;
          return (
            <Card 
              key={item.title}
              className="flex flex-col justify-between hover:scale-[1.02] hover:bg-white/85 border-0"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border-0 flex items-center justify-center text-brand-blue shadow-xs">
                    <Icon size={24} weight="fill" />
                  </div>
                  <Badge variant="neutral">
                    {item.badge}
                  </Badge>
                </div>

                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="pt-2">{item.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="pt-4 border-t border-black/5 flex items-center gap-1.5 text-xs text-brand-navy font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  <span>Verified buyer standard</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Problem to Solution Comparison Glass Console (Borderless) */}
      <Card className="mt-16 p-6 md:p-8 bg-white/75 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-0">
        <h3 className="heading-5 text-brand-navy mb-6 text-center">
          Traditional classifieds compared to EstateOne
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy Portals Glass Dock */}
          <div className="p-5 rounded-2xl bg-rose-50/50 backdrop-blur-md border-0 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-rose-600 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Traditional classifieds</span>
            </div>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">×</span>
                <span>Unverified listings with duplicate entries across multiple agents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">×</span>
                <span>Misleading pricing that omits parking and society maintenance charges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">×</span>
                <span>Intrusive spam calls from unverified intermediaries</span>
              </li>
            </ul>
          </div>

          {/* EstateOne Standards Glass Dock */}
          <div className="p-5 rounded-2xl bg-blue-50/50 backdrop-blur-md border-0 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-brand-navy font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
              <span>EstateOne standard</span>
            </div>
            <ul className="space-y-2.5 text-sm text-brand-navy">
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold">✓</span>
                <span>RERA verified documentation and physical address confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold">✓</span>
                <span>Transparent all inclusive price breakdowns shown upfront</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold">✓</span>
                <span>Direct communication with verified listing owners and licensed advisors</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

    </section>
  );
}
