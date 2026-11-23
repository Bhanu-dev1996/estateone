import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, HouseLine, ArrowRight } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getStatusBadge } from './ListingStatusTracker';

const NEXT_STEPS = [
  {
    title: 'Document pre-screen',
    body: 'Compliance reviews ownership papers and RERA filings against your submission.',
  },
  {
    title: 'Verification call',
    body: 'An officer may contact you on the number provided to confirm listing details.',
  },
  {
    title: 'Publication decision',
    body: 'Approved listings appear on Buy, Rent, and discovery feeds.',
  },
];

export default function ListingSubmissionSuccess({
  referenceId,
  submitterName,
  listingTitle,
  purpose,
  propertyType,
  city,
  locality,
  onTrackSubmissions,
  onSubmitAnother,
}) {
  const locationLine = [locality, city].filter(Boolean).join(', ') || city || '—';

  return (
    <Card className="listing-submission-success overflow-hidden rounded-3xl border border-slate-100 bg-white p-0 shadow-xs w-full text-left">
      <div className="listing-submission-success__grid">
        <div className="listing-submission-success__main">
          <div className="listing-submission-success__hero">
            <div className="listing-submission-success__icon" aria-hidden>
              <CheckCircle size={32} weight="fill" />
            </div>
            <div className="listing-submission-success__badges">
              <span className="listing-submission-success__status-pill">Submission received</span>
              {getStatusBadge('Pending verification')}
            </div>
          </div>

          <h2 className="listing-submission-success__title">Property submitted for verification</h2>
          <p className="listing-submission-success__lead">
            Thank you, <span className="text-brand-navy font-semibold">{submitterName || 'submitter'}</span>.
            Your listing is queued for moderation. Keep this reference for support and status updates.
          </p>

          <div className="listing-submission-success__ref-block">
            <span className="wizard-review-label">Listing reference</span>
            <p className="listing-submission-success__ref">{referenceId}</p>
          </div>

          <p className="listing-submission-success__sla">
            <Clock size={16} weight="duotone" className="shrink-0 text-brand-muted" aria-hidden />
            <span>Typical document review completes within 24 to 48 hours.</span>
          </p>

          <div className="listing-submission-success__actions">
            <Button type="button" size="sm" onClick={onTrackSubmissions} className="rounded-xl px-5">
              Track my submissions
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onSubmitAnother} className="rounded-xl px-5">
              Submit another property
            </Button>
            <Link to="/" className="listing-submission-success__home">
              Return to home
            </Link>
          </div>
        </div>

        <aside className="listing-submission-success__aside">
          <div className="wizard-review-card listing-submission-success__snapshot">
            <div className="wizard-review-card__body wizard-review-card__body--stack">
              <span className="wizard-review-label">Submitted listing</span>
              <p className="wizard-review-value wizard-review-value--title">{listingTitle || 'Untitled property'}</p>
              <p className="wizard-review-meta">
                {purpose ? String(purpose).toUpperCase() : '—'} • {propertyType || '—'}
              </p>
              <p className="wizard-review-meta wizard-review-meta--muted flex items-center gap-1">
                <HouseLine size={14} className="text-brand-gold shrink-0" aria-hidden />
                <span>{locationLine}</span>
              </p>
            </div>
          </div>

          <div className="listing-submission-success__steps">
            <h3 className="listing-submission-success__steps-heading">What happens next</h3>
            <ul className="listing-submission-success__step-list">
              {NEXT_STEPS.map((step) => (
                <li key={step.title} className="listing-submission-success__step">
                  <span className="listing-submission-success__step-dot" aria-hidden />
                  <div>
                    <p className="listing-submission-success__step-title">{step.title}</p>
                    <p className="listing-submission-success__step-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="wizard-review-notice listing-submission-success__notice">
            <CheckCircle size={20} weight="fill" className="text-amber-700 shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="wizard-review-notice__title">Not published yet</p>
              <p className="wizard-review-notice__body">
                Submission does not automatically verify or publish a property. Moderation must complete first.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Card>
  );
}