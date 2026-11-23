import React from 'react';
import { MagnifyingGlass, FileText, CalendarCheck, ArrowRight } from '@phosphor-icons/react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function HowItWorks({ onExploreClick }) {
  const steps = [
    {
      number: '01',
      icon: MagnifyingGlass,
      title: 'Discover and filter',
      description: 'Filter by city, property type, and budget with high resolution photography and authentic floor plans.'
    },
    {
      number: '02',
      icon: FileText,
      title: 'Review verified credentials',
      description: 'Inspect RERA registration numbers, society approvals, and carpet area measurements with complete transparency.'
    },
    {
      number: '03',
      icon: CalendarCheck,
      title: 'Schedule your site visit',
      description: 'Pick your preferred date and time to tour the property in person or request a guided video walkthrough.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center max-w-[65ch] mx-auto mb-16">
        <Badge variant="default" className="mb-3">
          Simple and transparent
        </Badge>
        <h2 className="text-h2 text-brand-navy mb-4 tracking-tight text-balance">
          How EstateOne works
        </h2>
        <p className="mkt-section-desc text-brand-muted mx-auto">
          Three simple steps to move from discovery to your private site visit without friction or unnecessary paperwork.
        </p>
      </div>

      {/* Steps Grid using Apple Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card 
              key={step.number}
              className="flex flex-col justify-between hover:scale-[1.02] hover:bg-white/85"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <span className="mkt-step-index" aria-hidden>
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border-0 flex items-center justify-center text-brand-navy shadow-xs">
                    <Icon size={24} weight="fill" className="text-brand-blue" />
                  </div>
                </div>

                <CardTitle className="mb-2">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>

              <CardFooter className="border-t border-black/5 pt-4 flex items-center justify-between mkt-inline-stat text-brand-navy">
                <span className="font-semibold">Step {idx + 1} of 3</span>
                <div className="w-6 h-6 rounded-full bg-slate-200/50 flex items-center justify-center text-brand-muted">
                  <ArrowRight size={14} />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* CTA Bar with Frosted Button */}
      <div className="mt-12 text-center">
        <Button
          type="button"
          onClick={onExploreClick}
          size="md"
          className="min-h-11 inline-flex items-center gap-2 rounded-xl shadow-[0_4px_16px_rgba(20,43,74,0.25)]"
        >
          <span>Explore properties now</span>
          <ArrowRight size={16} weight="bold" />
        </Button>
      </div>

    </section>
  );
}
