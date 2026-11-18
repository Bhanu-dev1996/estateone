import React from 'react';
import { Question } from '@phosphor-icons/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';

export default function FAQ({ onContactClick }) {
  const faqItems = [
    {
      id: 'faq-1',
      question: 'What makes an EstateOne listing verified?',
      answer: 'Our verification process inspects state RERA registration records, verifies physical property photographs against the site location, and validates seller or builder ownership documents before publishing.'
    },
    {
      id: 'faq-2',
      question: 'Do I need to pay any fee to browse or enquire about properties?',
      answer: 'No. Browsing properties, checking floor layouts, sending inquiries, and scheduling physical or virtual site visits are completely free for buyers and tenants.'
    },
    {
      id: 'faq-3',
      question: 'Are the prices listed final or negotiable?',
      answer: 'Prices are listed directly by verified sellers or authorized builders. You can negotiate directly with the owner or authorized advisor during your scheduled site visit.'
    },
    {
      id: 'faq-4',
      question: 'How do I schedule a site visit?',
      answer: 'Select any property card, click schedule visit, choose your preferred date, and enter your phone number. The verified partner will confirm your appointment within two hours.'
    },
    {
      id: 'faq-5',
      question: 'Does EstateOne charge brokerage fees?',
      answer: 'EstateOne does not charge buyers or tenants any platform search fee. Any standard transaction brokerage is determined directly between you and the respective licensed agent.'
    },
    {
      id: 'faq-6',
      question: 'Can I list my own property for sale or rent?',
      answer: 'Yes. Property owners and RERA registered builders can submit property details through the owner portal for initial verification and document check.'
    },
    {
      id: 'faq-7',
      question: 'Which Indian cities are currently supported?',
      answer: 'Our curated active inventory covers premier residential and commercial localities across Mumbai, Bengaluru, Pune, Hyderabad, Chennai, and Delhi NCR.'
    },
    {
      id: 'faq-8',
      question: 'What if a property is already sold or taken?',
      answer: 'Listings are updated regularly. Once an owner or partner confirms a concluded transaction, the listing is marked as closed immediately.'
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 max-w-4xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <Badge variant="default" className="mb-3">
          <Question size={16} weight="bold" className="text-brand-blue" />
          <span>Got questions?</span>
        </Badge>
        <h2 className="heading-2 text-brand-navy mb-4 tracking-tight text-balance">
          Frequently asked questions
        </h2>
        <p className="body-2 text-brand-muted text-pretty">
          Everything you need to know about our verification process, visit scheduling, and property authenticity.
        </p>
      </div>

      {/* Accessible Apple Frosted Glass Accordion */}
      <Accordion type="single" collapsible defaultValue="faq-1" className="space-y-3.5">
        {faqItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Objection Reassurance Frosted Card (Borderless) */}
      <Card className="mt-12 p-6 md:p-8 bg-white/75 backdrop-blur-2xl border-0 shadow-[0_16px_40px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="title-2 text-brand-navy font-semibold">
            Have a question not answered here?
          </h4>
          <p className="caption-2 text-brand-muted mt-1">
            Our property support desk is available Monday through Saturday.
          </p>
        </div>
        <button
          type="button"
          onClick={onContactClick}
          className="button-sm py-2.5 px-5 rounded-xl bg-brand-navy text-white hover:bg-slate-800 transition-all shadow-md inline-block cursor-pointer"
        >
          Contact support
        </button>
      </Card>

    </section>
  );
}
