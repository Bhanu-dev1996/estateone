import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Question, 
  MagnifyingGlass, 
  X, 
  ShieldCheck, 
  ChatCircleDots, 
  FileText, 
  LockKey, 
  Buildings, 
  HouseLine, 
  User, 
  Phone, 
  ArrowRight,
  Scales,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import Breadcrumbs from '../components/shared/Breadcrumbs';

const FAQ_CATEGORIES = [
  'All topics',
  'Buying',
  'Renting',
  'Listing',
  'Accounts',
  'Enquiries',
  'Safety'
];

const FAQS_DATA = [
  // Buying
  {
    category: 'Buying',
    question: 'What does a verified status mean on a buy listing?',
    answer: 'Every property displaying our verified badge has undergone physical on site inspection by regional compliance officers, cross verification against official state RERA filings, and certified carpet area audits against sanctioned municipal drawings. EstateOne does not guarantee future market returns or property appreciation, but ensures the structural and legal credentials match physical reality.'
  },
  {
    category: 'Buying',
    question: 'How is carpet area computed under RERA guidelines?',
    answer: 'Under RERA guidelines, carpet area denotes the net usable floor space enclosed within the inner apartment walls, excluding external walls, common service shafts, and common terraces. EstateOne mandates that all residential sale listings quote transparent carpet area dimensions so you can evaluate true cost per square foot without distorted marketing loading.'
  },
  {
    category: 'Buying',
    question: 'Do buyers pay any platform search or discovery fees on EstateOne?',
    answer: 'Zero fees. Searching, exploring floor plans, filtering, contacting sellers, and scheduling physical or virtual walkthroughs are completely free for buyers. You negotiate directly with title owners or licensed builder sales desks without intermediary portal markups.'
  },
  {
    category: 'Buying',
    question: 'Can EstateOne assist with home loan financing?',
    answer: 'While EstateOne does not directly underwrite or issue loans, you can connect with verified lending advisors from leading commercial banks. Final loan sanctions, interest rate spreads, and eligibility benchmarks remain subject to independent banking credit underwriting and documentation.'
  },

  // Renting
  {
    category: 'Renting',
    question: 'What documentation is recommended before executing a rental lease?',
    answer: 'We strongly recommend executing a registered Leave and License agreement through official state portals. Both parties should verify government identification (PAN, Aadhaar), confirm local police intimation where required by municipal rules, and document explicit security deposit refund timelines and inventory checklists.'
  },
  {
    category: 'Renting',
    question: 'How do I know the rent and security deposit amounts are genuine?',
    answer: 'Rent and security deposit figures are submitted directly by verified property title owners or authorized managers and displayed as separate, transparent line items. Any utility, society maintenance, or lock in conditions must be explicitly stated prior to executing the license agreement.'
  },
  {
    category: 'Renting',
    question: 'What should I do if a landlord requests cash only transactions?',
    answer: 'EstateOne advises maintaining a verifiable paper and banking trail for all property transactions. Always transfer earnest money and security deposits via traceable banking channels (NEFT, RTGS, IMPS, or bank transfer) and obtain a formal signed rent receipt.'
  },

  // Listing
  {
    category: 'Listing',
    question: 'Who is eligible to list a property on EstateOne?',
    answer: 'Individual property title owners, state RERA licensed advisors, and corporate promoters or builders are eligible to submit listings. Every submission requires valid contact credentials, property proof, and RERA registration numbers where applicable for commercial brokers and promoters.'
  },
  {
    category: 'Listing',
    question: 'Does submitting a property mean it is automatically published?',
    answer: 'No. Submission does not automatically mean that a property is verified or published. All listings undergo our mandatory moderation workflow, which includes title deed inspection, RERA validation, and physical site verification within 24 to 48 hours before being displayed publicly.'
  },
  {
    category: 'Listing',
    question: 'Can I save an in progress listing draft and complete it later?',
    answer: 'Yes. Our 8 step listing wizard allows you to click "Save draft" at any step. Your progress is preserved locally in your browser, and you will be prompted to resume your draft whenever you return to the seller portal.'
  },

  // Accounts
  {
    category: 'Accounts',
    question: 'Do I need an account to browse properties or compare listings?',
    answer: 'Guests can freely explore listings, filter by price, and compare up to 4 properties during their active session. Creating an account is required to save properties permanently across sessions, submit property listings, or track moderation milestones.'
  },
  {
    category: 'Accounts',
    question: 'How do I reset my account password or update my contact phone?',
    answer: 'Click "Login / Sign Up" in the navigation bar, select "Forgot password", and enter your registered email address or phone number. You will receive a secure OTP code to verify your identity and set a new password.'
  },
  {
    category: 'Accounts',
    question: 'How does EstateOne protect my personal account data?',
    answer: 'Your account credentials and contact records are encrypted using standard protocol protections. EstateOne never sells, leases, or trades user telephone numbers or personal emails to third party telemarketers or call centers.'
  },

  // Enquiries
  {
    category: 'Enquiries',
    question: 'How are my contact details handled when I send an enquiry?',
    answer: 'When you submit an enquiry on a property card or advisor profile, your contact request is delivered exclusively to that verified owner, builder desk, or designated advisor. We maintain strict privacy controls to eliminate broker spam.'
  },
  {
    category: 'Enquiries',
    question: 'How quickly will an advisor respond to my enquiry?',
    answer: 'Verified advisors and corporate sales desks typically respond within 2 to 4 hours during active business hours (Monday to Saturday, 9 AM to 7 PM). Requests submitted after hours are addressed the next business morning.'
  },
  {
    category: 'Enquiries',
    question: 'What should I do if I need to cancel or reschedule a site visit?',
    answer: 'You can reschedule by contacting the host directly through the phone or WhatsApp contact details supplied in your confirmation email, or by reaching our client support desk at contact@estateone.in.'
  },

  // Safety
  {
    category: 'Safety',
    question: 'How does EstateOne prevent ghost and duplicate listings?',
    answer: 'We enforce a single verified listing policy for each unique property parcel. Before publishing, our regional coordinators conduct geotagged photographic audits and title checks, permanently rejecting duplicate or unverified entries.'
  },
  {
    category: 'Safety',
    question: 'How can I report an inaccurate listing or unauthorized agent?',
    answer: 'Click the "Report listing" button located on any property details page, or submit a request via our Contact Us page selecting "Report an issue". Our compliance team investigates discrepancies within 12 hours.'
  },
  {
    category: 'Safety',
    question: 'What safety precautions are recommended during physical site visits?',
    answer: 'Schedule visits during daylight hours, verify the host identity against the confirmed advisor profile, share your itinerary with family, and never transfer booking tokens prior to inspecting original title documents with a qualified legal advisor.'
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All topics');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter FAQs based on search & category
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      // 1. Category match
      if (selectedCategory !== 'All topics' && item.category !== selectedCategory) {
        return false;
      }

      // 2. Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inQuestion = item.question.toLowerCase().includes(q);
        const inAnswer = item.answer.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        if (!inQuestion && !inAnswer && !inCat) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('All topics');
    setSearchQuery('');
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full space-y-12">
      
      {/* =========================================================================
          1. HEADER & SEARCH
         ========================================================================= */}
      <section className="space-y-4">
        <Breadcrumbs 
          items={[
            { label: 'Help and FAQ' }
          ]} 
          className="mb-2" 
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
            <Question size={15} weight="bold" />
            <span>Support and knowledge base</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck size={14} weight="fill" />
            <span>Accurate and verified information</span>
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Frequently asked questions.
          </h1>
          <p className="body-3 text-slate-500 leading-relaxed">
            Everything you need to know about our verification protocols, site visit bookings, seller submissions, user privacy, and transaction safety.
          </p>
        </div>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by topic, keyword, or question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-11 rounded-2xl bg-white border-slate-200 text-xs text-brand-navy focus-visible:ring-brand-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer"
                title="Clear search"
              >
                <X size={13} weight="bold" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CATEGORY TABS
         ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="caption-3 font-bold text-slate-400 uppercase tracking-wider">
            Filter by category
          </span>
          {(selectedCategory !== 'All topics' || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-brand-blue font-semibold hover:underline cursor-pointer"
            >
              Reset active filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. EXPAND / COLLAPSE FAQ LIST
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-brand-navy">{filteredFaqs.length}</strong> questions in {selectedCategory}
          </span>
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3.5 w-full">
            {filteredFaqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`faq-${idx}`}
                className="border border-slate-200/80 rounded-2xl bg-white shadow-xs hover:border-slate-300 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 text-xs sm:text-sm font-bold text-brand-navy hover:no-underline">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 shrink-0">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border-0 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Question size={32} />
            </div>
            <h3 className="title-2 text-brand-navy font-bold">No questions found</h3>
            <p className="caption-1 text-slate-500 max-w-md mx-auto">
              We couldn't find any questions matching your query. Try searching for different keywords or explore other categories.
            </p>
            <Button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer"
            >
              Reset filters
            </Button>
          </div>
        )}
      </section>

      {/* =========================================================================
          4. POLICY PAGES QUICK ACCESS (PRD 5.13 REQUIREMENT)
         ========================================================================= */}
      <section className="space-y-4">
        <div>
          <h3 className="title-2 text-brand-navy font-bold">
            Policy guidelines and legal disclosures
          </h3>
          <p className="caption-2 text-slate-500 mt-0.5">
            Review detailed statutory documentation governing privacy, terms, and listing verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/privacy-policy"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-blue hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
                <LockKey size={20} weight="fill" />
              </div>
              <h4 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue transition-colors mb-1">
                Privacy policy
              </h4>
              <p className="caption-3 text-slate-500 leading-relaxed">
                How we protect personal data, contact information, and cookies under DPDP regulations.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-blue">
              <span>View policy</span>
              <ArrowRight size={12} weight="bold" />
            </div>
          </Link>

          <Link
            to="/terms"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-blue hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
                <FileText size={20} weight="fill" />
              </div>
              <h4 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue transition-colors mb-1">
                Terms of service
              </h4>
              <p className="caption-3 text-slate-500 leading-relaxed">
                User obligations, visitor safety guidelines, and platform intellectual property rights.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-blue">
              <span>View terms</span>
              <ArrowRight size={12} weight="bold" />
            </div>
          </Link>

          <Link
            to="/about"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-blue hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
                <ShieldCheck size={20} weight="fill" />
              </div>
              <h4 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue transition-colors mb-1">
                Verification standard
              </h4>
              <p className="caption-3 text-slate-500 leading-relaxed">
                Detailed protocol on on site inspections, title searches, and RERA registration audits.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-blue">
              <span>View protocol</span>
              <ArrowRight size={12} weight="bold" />
            </div>
          </Link>

          <Link
            to="/list-property"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-blue hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
                <HouseLine size={20} weight="fill" />
              </div>
              <h4 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue transition-colors mb-1">
                Listing moderation rules
              </h4>
              <p className="caption-3 text-slate-500 leading-relaxed">
                Submission requirements, document checklists, and 24 to 48 hour review workflows.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-blue">
              <span>View portal</span>
              <ArrowRight size={12} weight="bold" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. CONTACT SUPPORT CTA
         ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-blue">
            <ChatCircleDots size={16} weight="fill" />
            <span>Dedicated client advisory desk</span>
          </div>
          <h3 className="heading-3 text-brand-navy font-bold">
            Still have questions or need personalized guidance?
          </h3>
          <p className="body-4 text-slate-500 leading-relaxed">
            Our accredited coordinators at Bandra Kurla Complex (BKC) Mumbai are available Monday to Saturday from 9 AM to 7 PM to answer specific questions regarding listings, title verifications, or partnership inquiries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link to="/contact">
            <Button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer shadow-xs">
              Contact support desk
            </Button>
          </Link>

          <a
            href="tel:+912261204400"
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-brand-navy text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Phone size={15} weight="bold" />
            <span>Call +91 22 6120 4400</span>
          </a>
        </div>
      </section>

    </div>
  );
}
