import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  WarningCircle, 
  FileText, 
  Eye, 
  XCircle, 
  ArrowClockwise 
} from '@phosphor-icons/react';
import { Badge } from '../ui/badge';

export const LISTING_STATUSES = [
  {
    status: 'Draft',
    label: 'Draft',
    meaning: 'Not yet submitted',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock
  },
  {
    status: 'Pending verification',
    label: 'Pending verification',
    meaning: 'Submitted and awaiting review',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Clock
  },
  {
    status: 'Under review',
    label: 'Under review',
    meaning: 'Being reviewed',
    color: 'bg-blue-50 text-brand-blue border-blue-200',
    icon: ArrowClockwise
  },
  {
    status: 'Changes required',
    label: 'Changes required',
    meaning: 'Submitter must update information',
    color: 'bg-orange-50 text-orange-800 border-orange-200',
    icon: WarningCircle
  },
  {
    status: 'Approved',
    label: 'Approved',
    meaning: 'Passed review',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle
  },
  {
    status: 'Published',
    label: 'Published',
    meaning: 'Visible on public website',
    color: 'bg-emerald-600 text-white border-emerald-600',
    icon: Eye
  },
  {
    status: 'Rejected',
    label: 'Rejected',
    meaning: 'Not approved for publication',
    color: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: XCircle
  },
  {
    status: 'Unpublished',
    label: 'Unpublished',
    meaning: 'Previously published but no longer publicly visible',
    color: 'bg-slate-200 text-slate-600 border-slate-300',
    icon: FileText
  }
];

export function getStatusBadge(status) {
  const match = LISTING_STATUSES.find((s) => s.status === status) || LISTING_STATUSES[1];
  const Icon = match.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${match.color}`}>
      <Icon size={13} weight="fill" />
      <span>{match.label}</span>
    </span>
  );
}

export default function ListingStatusTracker({ currentStatus = 'Pending verification', referenceId }) {
  const steps = [
    {
      title: 'Submission registered',
      desc: 'Listing details and media stored securely',
      status: 'completed'
    },
    {
      title: 'Document and RERA check',
      desc: 'Title verification and regulatory clearance',
      status: currentStatus === 'Pending verification' ? 'current' : 'completed'
    },
    {
      title: 'Site inspection',
      desc: 'Physical validation or virtual walkthrough confirmation',
      status: 'pending'
    },
    {
      title: 'Compliance review',
      desc: 'Legal moderation and pricing authenticity check',
      status: 'pending'
    },
    {
      title: 'Live publication',
      desc: 'Display on public discovery feed and search',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Moderation Stages Roadmap */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="caption-1 font-bold text-brand-navy">Moderation progress</h3>
            <p className="caption-3 text-slate-500">
              Reference code: <span className="font-mono font-semibold text-brand-navy">{referenceId}</span>
            </p>
          </div>
          {getStatusBadge(currentStatus)}
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {steps.map((st, idx) => {
            const isCompleted = st.status === 'completed';
            const isCurrent = st.status === 'current';
            return (
              <div key={st.title} className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 border-amber-500 ring-4 ring-amber-100 text-white'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  {isCompleted && <CheckCircle size={10} weight="bold" />}
                </div>
                <div>
                  <p className={`caption-1 font-bold ${isCurrent ? 'text-amber-700' : isCompleted ? 'text-brand-navy' : 'text-slate-400'}`}>
                    Step {idx + 1}: {st.title}
                  </p>
                  <p className="caption-3 text-slate-500">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory PRD Regulatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <ShieldCheck size={20} weight="fill" className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-0.5">Important verification notice</p>
          <p className="text-amber-800">
            Submission does not automatically mean that a property is verified or published. Verification and publication must follow the moderation process. Our compliance desk completes preliminary document reviews within 24 to 48 hours.
          </p>
        </div>
      </div>

      {/* Status Glossary */}
      <div className="p-5 rounded-2xl bg-white border border-slate-100 space-y-3">
        <h4 className="caption-1 font-bold text-brand-navy">EstateOne listing lifecycle states</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {LISTING_STATUSES.map((item) => (
            <div key={item.status} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80">
              <span className="font-semibold text-brand-navy block">{item.label}</span>
              <span className="text-slate-500 text-[11px]">{item.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
