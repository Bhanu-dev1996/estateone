import React from 'react';
import {
  WarningCircle,
  XCircle,
  MapPin,
  User,
  Buildings,
  Ruler,
  Envelope,
  Phone,
  Tag,
} from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { getStatusBadge } from './ListingStatusTracker';

const SITE_VISIT_MODAL_SHELL =
  'w-[min(40rem,95vw)] max-w-[40rem] max-h-[92vh] grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-0 rounded-3xl bg-white border-0 shadow-2xl text-left';

const SITE_VISIT_CLOSE =
  'right-5 top-5 text-slate-300 hover:text-white hover:bg-white/10 focus-visible:ring-white/40';

function formatSubmittedAt(iso) {
  return new Date(iso || Date.now()).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatTile({ icon: Icon, label, value, valueClassName = '' }) {
  return (
    <div className="listing-submission-detail__stat">
      <span className="listing-submission-detail__stat-icon" aria-hidden>
        <Icon size={16} weight="duotone" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="listing-submission-detail__stat-label">{label}</span>
        <p className={`listing-submission-detail__stat-value ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ListingSubmissionDetailDialog({ submission, open, onOpenChange, onEditSubmission }) {
  const status = submission?.status || 'Pending verification';

  const handleEdit = () => {
    onOpenChange?.(false);
    onEditSubmission?.(submission);
  };

  if (!submission) return null;

  const locationLine = [submission.locality, submission.city].filter(Boolean).join(', ') || submission.city || '—';
  const addressLine =
    submission.fullAddress ||
    `${submission.locality}, ${submission.city}, ${submission.state || 'India'}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeClassName={SITE_VISIT_CLOSE} className={SITE_VISIT_MODAL_SHELL}>
        <div className="shrink-0 bg-[#142B4A] text-white p-6 relative pr-14">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D]">Listing submission</span>
            {getStatusBadge(status)}
          </div>
          <DialogTitle className="text-h4 text-white font-semibold tracking-tight text-balance">
            {submission.title || 'Untitled listing'}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-slate-300 mt-2">
            <span className="font-mono text-slate-200">{submission.referenceId}</span>
            <span aria-hidden className="hidden sm:inline text-slate-500">
              ·
            </span>
            <span>Submitted {formatSubmittedAt(submission.submittedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-small text-slate-300 mt-2">
            <MapPin size={14} className="text-[#C5A46D] shrink-0" aria-hidden />
            <span className="truncate">{locationLine}</span>
          </div>
        </div>

        <ScrollArea
          type="always"
          className="h-full min-h-0 overflow-hidden"
          scrollbarClassName="w-2.5 py-1"
          thumbClassName="bg-slate-400/90"
        >
          <div className="listing-submission-detail estate-form-surface p-6 md:p-8 pb-6 space-y-6 bg-slate-50/60">
            {status === 'Changes required' && (
              <div className="listing-submission-detail__alert listing-submission-detail__alert--warning">
                <p className="listing-submission-detail__alert-title">
                  <WarningCircle size={18} weight="fill" aria-hidden />
                  <span>Moderation feedback (action required)</span>
                </p>
                <p className="listing-submission-detail__alert-body">{submission.moderationNotes}</p>
              </div>
            )}

            {status === 'Rejected' && (
              <div className="listing-submission-detail__alert listing-submission-detail__alert--danger">
                <p className="listing-submission-detail__alert-title">
                  <XCircle size={18} weight="fill" aria-hidden />
                  <span>Rejection reason</span>
                </p>
                <p className="listing-submission-detail__alert-body">{submission.rejectionReason}</p>
              </div>
            )}

            <section aria-labelledby="submission-overview-heading">
              <h3 id="submission-overview-heading" className="listing-submission-detail__section-title">
                Property overview
              </h3>
              <div className="listing-submission-detail__stat-grid">
                <StatTile icon={Tag} label="Purpose" value={submission.purpose} valueClassName="capitalize" />
                <StatTile icon={Buildings} label="Property type" value={submission.propertyType} />
                <StatTile
                  icon={Ruler}
                  label="Carpet area"
                  value={`${submission.carpetArea || submission.builtUpArea || '2,400'} sq ft`}
                />
                <StatTile icon={MapPin} label="City" value={submission.city} />
              </div>
            </section>

            <section aria-labelledby="submission-address-heading" className="listing-submission-detail__panel">
              <div className="listing-submission-detail__panel-head">
                <span className="listing-submission-detail__panel-icon" aria-hidden>
                  <MapPin size={18} weight="duotone" />
                </span>
                <h3 id="submission-address-heading" className="listing-submission-detail__panel-title">
                  Full address
                </h3>
              </div>
              <p className="listing-submission-detail__panel-body">{addressLine}</p>
            </section>

            <section aria-labelledby="submission-submitter-heading" className="listing-submission-detail__panel">
              <div className="listing-submission-detail__panel-head">
                <span className="listing-submission-detail__panel-icon" aria-hidden>
                  <User size={18} weight="duotone" />
                </span>
                <h3 id="submission-submitter-heading" className="listing-submission-detail__panel-title">
                  Submitter information
                </h3>
              </div>
              <p className="listing-submission-detail__submitter-name">
                {submission.submitterName}
                <span className="listing-submission-detail__submitter-role">({submission.submitterRole})</span>
              </p>
              <ul className="listing-submission-detail__contact-list">
                <li>
                  <Phone size={14} className="text-[#C5A46D] shrink-0" aria-hidden />
                  <span>{submission.submitterPhone}</span>
                </li>
                <li>
                  <Envelope size={14} className="text-[#C5A46D] shrink-0" aria-hidden />
                  <span className="break-all">{submission.submitterEmail}</span>
                </li>
              </ul>
            </section>

            <div className="listing-submission-detail__footer flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end border-t border-slate-200/90 pt-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                className="min-h-10 w-full rounded-2xl border-slate-200 shadow-none sm:w-auto sm:min-w-[8.5rem]"
              >
                Close
              </Button>
              {status === 'Changes required' && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleEdit}
                  className="min-h-10 w-full rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs sm:w-auto sm:min-w-[11rem]"
                >
                  Update listing now
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}