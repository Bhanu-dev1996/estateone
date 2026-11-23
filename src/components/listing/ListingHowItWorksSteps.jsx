import React from 'react';
import { ClipboardText, Images, ShieldCheck } from '@phosphor-icons/react';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';

const STEPS = [
  {
    id: 1,
    title: 'Property details',
    detail: 'Purpose, type, location, pricing',
    Icon: ClipboardText,
  },
  {
    id: 2,
    title: 'Photos and plans',
    detail: 'Show buyers what they will see',
    Icon: Images,
  },
  {
    id: 3,
    title: 'Verification',
    detail: 'Go live after RERA check',
    Icon: ShieldCheck,
  },
];

function StepRow({ step, compact = false }) {
  const iconBox = compact ? 'h-10 w-10' : 'h-11 w-11';
  const iconSize = compact ? 20 : 22;

  return (
    <>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white',
          iconBox
        )}
      >
        <step.Icon size={iconSize} weight="duotone" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption font-semibold text-brand-blue leading-none">Step {step.id}</p>
        <p className={cn('text-small font-semibold text-brand-navy leading-snug', compact ? 'mt-1' : 'mt-1.5')}>
          {step.title}
        </p>
        <p
          className="text-caption font-normal text-slate-500 mt-1 truncate whitespace-nowrap leading-none"
          title={step.detail}
        >
          {step.detail}
        </p>
      </div>
    </>
  );
}

export default function ListingHowItWorksSteps({ className = '' }) {
  return (
    <section className={cn('listing-how-steps w-full', className)} aria-label="How listing works">
      <p className="text-caption font-semibold text-slate-500 mb-3">How listing works</p>

      <Card className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-xs sm:block">
        <CardContent className="flex items-stretch p-0">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="listing-how-step-card flex min-w-0 flex-1 items-center gap-4 p-5">
                <StepRow step={step} />
              </div>
              {index < STEPS.length - 1 && (
                <Separator orientation="vertical" className="h-auto w-px shrink-0 self-stretch bg-slate-100" />
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <ol className="space-y-2 sm:hidden">
        {STEPS.map((step) => (
          <li key={step.id}>
            <Card className="listing-how-step-card rounded-2xl border border-slate-100 bg-white p-0 shadow-xs">
              <CardContent className="flex items-center gap-3 p-4">
                <StepRow step={step} compact />
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}