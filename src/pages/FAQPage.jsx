import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Question, MagnifyingGlass, ShieldCheck } from '@phosphor-icons/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const allFaqs = [
    {
      q: 'What makes an EstateOne listing verified?',
      a: 'Every verified listing undergoes RERA registry validation, physical property location inspection, carpet area measurement audit, and direct authorization by title owners or licensed builder advisors.'
    },
    {
      q: 'Do buyers or tenants pay any platform search fee?',
      a: 'No. Searching, exploring floor plans, filtering, contacting sellers, and scheduling physical or virtual walkthroughs are completely free for buyers and tenants.'
    },
    {
      q: 'How does site visit scheduling work?',
      a: 'Select any listing, choose an available date within the next fourteen days, pick a morning, afternoon, or evening slot, and submit your phone number. The verified partner confirms your appointment within two hours.'
    },
    {
      q: 'How can owners and builders list their property?',
      a: 'Property owners and RERA registered builders can click List Property to launch our structured submission wizard, submit title documents, and schedule on site photography.'
    },
    {
      q: 'Are the prices listed negotiable?',
      a: 'Prices are listed directly by verified sellers or authorized builders. You can negotiate directly with the owner or authorized advisor during your scheduled site visit.'
    },
    {
      q: 'Which Indian cities are currently covered?',
      a: 'Our verified inventory currently spans premier residential and commercial corridors in Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, and Goa.'
    }
  ];

  const filteredFaqs = allFaqs.filter(
    (item) => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">Help and FAQ</span>
      </nav>

      <div className="mb-8 text-center max-w-2xl mx-auto">
        <Badge variant="default" className="mb-3">
          <Question size={16} weight="bold" className="text-brand-blue" />
          <span>Support and knowledge base</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight mb-3">
          Frequently asked questions
        </h1>
        <p className="body-4 text-brand-muted">
          Everything you need to know about our verification protocol, visit scheduling, fees, and safety policies.
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-md mx-auto">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue shadow-xs"
          />
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3.5 mb-12">
        {filteredFaqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger className="text-sm font-semibold text-brand-navy">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="body-4 text-brand-muted leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="p-8 rounded-3xl bg-blue-50/60 text-center space-y-3">
        <h2 className="title-2 text-brand-navy font-bold">Still have questions?</h2>
        <p className="body-4 text-brand-muted max-w-md mx-auto">
          Our client support specialists in BKC Mumbai are available seven days a week to assist you.
        </p>
        <div className="pt-2">
          <Link to="/contact">
            <Button>Contact support desk</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
