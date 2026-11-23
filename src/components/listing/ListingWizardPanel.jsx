import React from 'react';
import { Card, CardContent } from '../ui/card';
import { getWizardStepMeta } from './listingWizardSteps';
import { cn } from '../../lib/utils';

export default function ListingWizardPanel({ currentStep, totalSteps = 8, className, children, footer }) {
  const meta = getWizardStepMeta(currentStep);

  return (
    <Card
      className={cn(
        'listing-wizard-panel relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-0 shadow-xs',
        className
      )}
    >
      <header className="listing-wizard-panel__header border-b border-slate-100 bg-slate-50/35">
        <div className="listing-wizard-panel__header-row">
          <div className="listing-wizard-panel__header-copy min-w-0">
            <h2 className="listing-wizard-panel__title text-h4 text-balance">{meta.title}</h2>
            <p className="listing-wizard-panel__hint text-pretty">{meta.hint}</p>
          </div>
          <p
            className="listing-wizard-panel__step-meta"
            aria-label={`Step ${currentStep} of ${totalSteps}, ${meta.short}`}
          >
            <span className="listing-wizard-panel__step-count">
              {currentStep}/{totalSteps}
            </span>
            <span className="listing-wizard-panel__step-sep" aria-hidden>
              ·
            </span>
            <span className="listing-wizard-panel__step-short">{meta.short}</span>
          </p>
        </div>
      </header>

      <CardContent className="listing-wizard-panel__body space-y-6 p-0">{children}</CardContent>

      {footer}
    </Card>
  );
}