import React from 'react';
import { cn } from '../../lib/utils';

export default function ListingWizardStepIntro({ title, description, className }) {
  if (!title && !description) return null;

  return (
    <div className={cn('wizard-step-intro space-y-1', className)}>
      {title && <h3 className="wizard-step-heading text-h4 font-semibold text-brand-navy text-balance">{title}</h3>}
      {description && (
        <p className="wizard-step-lead text-caption font-normal text-slate-500 text-pretty max-w-[65ch]">
          {description}
        </p>
      )}
    </div>
  );
}