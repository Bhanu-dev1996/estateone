import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lifebuoy, 
  ShieldCheck, 
  CheckCircle, 
  PaperPlaneRight,
  FileText
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function CreateSupportTicket() {
  const { createSupportTicket, enquiries } = useCustomerDashboard();
  const navigate = useNavigate();

  const [category, setCategory] = useState('Enquiry issue');
  const [relatedEntity, setRelatedEntity] = useState('None');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState('Email');
  const [submittedRef, setSubmittedRef] = useState(null);

  const CATEGORIES = [
    'Enquiry issue',
    'Site visit query',
    'Account and verification',
    'Technical glitch or display issue',
    'Other concern'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const res = createSupportTicket({
      category,
      relatedEntity,
      subject,
      description,
      preferredContact
    });

    setSubmittedRef(res.reference);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* =========================================================================
          1. HEADER (PRD Section 18.2)
         ========================================================================= */}
      <DashboardPageHeader
        prefix={
          <Link
            to="/dashboard/support"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
            aria-label="Back to support"
          >
            <ArrowLeft size={16} />
          </Link>
        }
        title="Create support request"
        description="Submit a formal ticket to our customer concierge and legal support team."
      />

      {/* =========================================================================
          2. FORM OR CONFIRMATION
         ========================================================================= */}
      {submittedRef ? (
        <Card className="p-8 rounded-3xl bg-white border border-slate-100 shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle size={32} weight="fill" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-brand-navy">Support ticket submitted</h2>
            <p className="caption-2 text-slate-500 mt-1">
              Ticket tracking reference: <span className="font-mono font-bold text-brand-blue">{submittedRef}</span>
            </p>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Our concierge team has received your inquiry. We will contact you via {preferredContact} within 4 business hours.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button size="sm"
              onClick={() => navigate('/dashboard/support')}
              className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white"
            >
              Back to support centre
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category */}
            <div>
              <label className="caption-2 font-bold text-slate-700 block mb-1">Inquiry category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-small p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Related Entity */}
            <div>
              <label className="caption-2 font-bold text-slate-700 block mb-1">Related property or enquiry (optional)</label>
              <select
                value={relatedEntity}
                onChange={(e) => setRelatedEntity(e.target.value)}
                className="w-full text-small p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="None">None / General request</option>
                {enquiries.map((enq) => (
                  <option key={enq.id} value={`${enq.propertyTitle} (${enq.reference})`}>
                    {enq.reference} • {enq.propertyTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="caption-2 font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of your question or issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-small p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="caption-2 font-bold text-slate-700 block mb-1">Detailed description</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your issue or request in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-small p-3 rounded-xl border border-slate-200 resize-none"
              />
            </div>

            {/* Preferred contact */}
            <div>
              <label className="caption-2 font-bold text-slate-700 block mb-1">Preferred response channel</label>
              <div className="flex items-center gap-4 text-xs text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredChannel"
                    value="Email"
                    checked={preferredContact === 'Email'}
                    onChange={() => setPreferredContact('Email')}
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredChannel"
                    value="Phone call"
                    checked={preferredContact === 'Phone call'}
                    onChange={() => setPreferredContact('Phone call')}
                  />
                  <span>Phone call</span>
                </label>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck size={16} className="text-brand-blue shrink-0 mt-0.5" weight="fill" />
              <span>
                Verified support promise: Tickets are logged directly in our concierge queue with formal audit logs.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button size="sm"
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/support')}
                className="rounded-2xl min-h-10 px-4 font-semibold border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button size="sm"
                type="submit"
                className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white hover:bg-slate-900 flex items-center gap-1.5"
              >
                <PaperPlaneRight size={14} weight="bold" />
                <span>Submit ticket</span>
              </Button>
            </div>

          </form>
        </Card>
      )}

    </div>
  );
}
