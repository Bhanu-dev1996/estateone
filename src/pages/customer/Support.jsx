import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Question, 
  Plus, 
  Flag, 
  Lifebuoy, 
  ChatCircleText, 
  CaretDown, 
  CaretUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  FileText,
  BookOpen
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import ReportListingModal from '../../components/dashboard/ReportListingModal';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function Support() {
  const { supportTickets, reportedListings } = useCustomerDashboard();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const FAQS = [
    {
      q: 'How does EstateOne verify properties before publishing?',
      a: 'Every listing on EstateOne undergoes title deed inspection, RERA registration matching, physical site photography checks, and local municipal plan verification before earning the verified badge.'
    },
    {
      q: 'How do site visit appointments work?',
      a: 'When you request a site visit, our concierge notifies the resident estate advisor to confirm building reception clearance and visitor passes. You will receive an arrival confirmation in your site visits dashboard.'
    },
    {
      q: 'Can I reschedule or cancel a walkthrough?',
      a: 'Yes. Appointments can be rescheduled or cancelled with zero charges up to 2 hours prior to arrival directly from your Site Visits tab.'
    },
    {
      q: 'How is my contact information shared with advisors?',
      a: 'Your phone number and email are shared only with the certified partner advisor handling the specific property you enquired about. Your details are never sold to external broker networks.'
    },
    {
      q: 'What should I do if a property listing contains inaccurate information?',
      a: 'Select "Report listing" from the property card or help centre. Our compliance officers will audit the listing and penalize misleading advertisers within 24 hours.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 18.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Help and support centre"
        description="Access verified real estate FAQs, track customer support tickets, or submit a confidential listing report."
        action={
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setReportModalOpen(true)}
              className="rounded-2xl min-h-10 px-4 text-rose-600 hover:bg-rose-50"
            >
              <Flag size={14} className="mr-1" />
              <span>Report a listing</span>
            </Button>
            <Link to="/dashboard/support/new">
              <Button type="button" size="sm" className="rounded-2xl min-h-10 px-4">
                <Plus size={14} className="mr-1" />
                <span>Create support request</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* =========================================================================
          2. SUPPORT TICKETS TRACKING (PRD Section 18.3)
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h4 font-bold text-brand-navy">Your support requests</h2>
          <span className="caption-2 text-slate-400 font-semibold">{supportTickets.length} active tickets</span>
        </div>

        {supportTickets.length > 0 ? (
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id} className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="caption-2 font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md">
                        {ticket.reference}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-caption font-semibold py-0.5 ${
                          ticket.status === 'In progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : ticket.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-brand-blue border-blue-200'
                        }`}
                      >
                        {ticket.status}
                      </Badge>
                      <span className="caption-2 text-slate-400">Category: {ticket.category}</span>
                    </div>

                    <h3 className="text-h4 font-bold text-brand-navy mt-1">{ticket.subject}</h3>
                    <p className="caption-2 text-slate-600 mt-1">{ticket.description}</p>
                  </div>

                  <span className="caption-2 text-slate-400 shrink-0">{ticket.submittedDate}</span>
                </div>

                {/* History response stream */}
                {ticket.history && ticket.history.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <p className="caption-2 font-bold text-slate-400 uppercase tracking-wider">Concierge updates:</p>
                    {ticket.history.map((h, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-1">
                          <span className="font-semibold text-brand-navy">{h.sender}</span>
                          <span className="text-caption">{h.time}</span>
                        </div>
                        <p className="text-slate-700">{h.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 text-center">
            <p className="text-xs text-slate-500">No active support requests logged.</p>
          </Card>
        )}
      </div>

      {/* =========================================================================
          3. GUIDES & RESOURCE CARDS (PRD Section 18.1)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link to="/blog" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h3 className="text-h4 font-bold text-brand-navy group-hover:text-brand-blue">Home buyer guide</h3>
            <p className="caption-2 text-slate-500">Essential title checklist, RERA verification rules, and financing advice.</p>
          </Card>
        </Link>

        <Link to="/blog" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-h4 font-bold text-brand-navy group-hover:text-emerald-700">RERA legal clearance</h3>
            <p className="caption-2 text-slate-500">How to inspect carpet area disclosure and municipal approvals.</p>
          </Card>
        </Link>

        <Link to="/faq" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lifebuoy size={20} />
            </div>
            <h3 className="text-h4 font-bold text-brand-navy group-hover:text-amber-700">Public help centre</h3>
            <p className="caption-2 text-slate-500">Complete documentation on listing verification and customer accounts.</p>
          </Card>
        </Link>
      </div>

      {/* =========================================================================
          4. FREQUENTLY ASKED QUESTIONS ACCORDION
         ========================================================================= */}
      <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-brand-navy">
          <Question size={20} className="text-brand-blue" />
          <h2 className="text-h4 font-bold">Frequently asked questions</h2>
        </div>

        <div className="divide-y divide-slate-100 pt-1">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-xs text-brand-navy hover:text-brand-blue transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
                </button>

                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportListingModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          property={{
            title: 'Selected property on EstateOne',
            location: 'India marketplace'
          }}
        />
      )}

    </div>
  );
}
