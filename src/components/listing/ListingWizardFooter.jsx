import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { Button } from '../ui/button';

export default function ListingWizardFooter({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
}) {
  const isFirst = currentStep <= 1;
  const isLast = currentStep >= totalSteps;

  return (
    <div
      className="listing-wizard-footer sticky bottom-0 z-10 mt-0 flex flex-col-reverse items-stretch justify-between gap-2 rounded-b-3xl border-t border-slate-100 bg-white py-3.5 sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="flex min-h-9 flex-1 items-center sm:justify-start">
        {!isFirst ? (
          <Button type="button" variant="outline" size="sm" onClick={onPrev} className="px-5 border-slate-200">
            <ArrowLeft size={16} />
            Back
          </Button>
        ) : (
          <p className="text-caption leading-none text-slate-400">
            You can change answers on later steps
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center sm:justify-end">
        {isLast ? (
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="w-full rounded-2xl px-6 shadow-xs sm:w-auto sm:min-w-[12rem]"
          >
            <ShieldCheck size={16} weight="bold" />
            {isSubmitting ? 'Submitting...' : 'Submit for verification'}
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={onNext} className="w-full px-6 shadow-xs sm:w-auto sm:min-w-[9.5rem]">
            Continue
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}