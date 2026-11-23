import React from 'react';
import { Check, FloppyDisk } from '@phosphor-icons/react';
import { LISTING_WIZARD_STEPS } from './listingWizardSteps';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { APP_ICON } from '../../lib/iconScale';

export default function ListingWizardStepper({ currentStep, onSaveDraft, className = '' }) {
  const progress = Math.round((currentStep / LISTING_WIZARD_STEPS.length) * 100);

  return (
    <Card
      className={cn(
        'listing-wizard-stepper rounded-2xl border border-slate-100 bg-slate-50/80 shadow-xs lg:sticky lg:top-28',
        className
      )}
    >
      <CardHeader className="listing-wizard-stepper__progress space-y-1.5 p-4 sm:p-5 pb-2">
        <div className="listing-wizard-stepper__progress-head flex items-baseline justify-between gap-2">
          <p className="m-0 min-w-0 leading-snug">
            <span className="listing-wizard-stepper__kicker">Your progress</span>
            <span className="listing-wizard-stepper__kicker listing-wizard-stepper__kicker-sep" aria-hidden>
              {' '}
              ·{' '}
            </span>
            <span className="listing-wizard-stepper__kicker listing-wizard-stepper__kicker--step">
              Step {currentStep} of {LISTING_WIZARD_STEPS.length}
            </span>
          </p>
          <span className="listing-wizard-stepper__percent shrink-0">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        <Separator className="mb-4 hidden lg:block bg-slate-200" />
        <ol className="listing-wizard-stepper__step-list hidden lg:flex" aria-label="Listing steps">
          {LISTING_WIZARD_STEPS.map((step) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <li
                key={step.id}
                aria-current={active ? 'step' : undefined}
                aria-label={step.title}
                className={cn(
                  'listing-wizard-stepper__step',
                  active && 'is-active',
                  !active && !done && 'is-pending',
                  done && 'is-done'
                )}
              >
                <span
                  className={cn(
                    'listing-wizard-stepper__step-marker',
                    done && 'is-done',
                    active && !done && 'is-active',
                    !active && !done && 'is-pending'
                  )}
                  aria-hidden
                >
                  {done ? <Check size={APP_ICON.xs} weight="bold" /> : step.id}
                </span>
                <div className="listing-wizard-stepper__step-body">
                  <p className="listing-wizard-stepper__step-title">{step.short}</p>
                  {active && (
                    <p className="listing-wizard-stepper__step-hint" title={step.hint}>
                      {step.hint}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 sm:p-5 pt-0">
        <p className="listing-wizard-stepper__footer-note">
          Most sellers finish in about 12 minutes. You can save anytime and return later.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          className="listing-wizard-stepper__save rounded-xl border-slate-200"
        >
          <FloppyDisk size={APP_ICON.md} weight="bold" aria-hidden />
          Save draft
        </Button>
      </CardFooter>
    </Card>
  );
}