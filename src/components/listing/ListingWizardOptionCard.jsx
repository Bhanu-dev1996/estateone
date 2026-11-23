import React from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

export default function ListingWizardOptionCard({
  selected,
  onClick,
  title,
  description,
  icon: Icon,
  layout = 'stacked',
  className,
}) {
  const isInline = layout === 'inline';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'listing-wizard-option group w-full cursor-pointer rounded-2xl text-left',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
        className
      )}
    >
      <div
        className={cn(
          'relative h-full rounded-2xl border-2 bg-white transition-all',
          isInline ? 'flex items-start gap-3 p-3.5 sm:p-4' : 'flex flex-col gap-2 p-4 sm:p-4',
          selected
            ? 'border-brand-navy bg-slate-50/90 shadow-xs'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
        )}
      >
        {selected && (
          <span
            className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy text-white"
            aria-hidden
          >
            <Check size={12} weight="bold" />
          </span>
        )}

        {Icon && (
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl border shadow-xs',
              isInline ? 'h-9 w-9' : 'h-10 w-10',
              selected
                ? 'border-brand-navy/15 bg-white text-brand-blue'
                : 'border-slate-100 bg-slate-50 text-slate-500'
            )}
          >
            <Icon size={isInline ? 18 : 20} weight={selected ? 'fill' : 'duotone'} aria-hidden />
          </div>
        )}

        <div className={cn('min-w-0 flex-1', !isInline && 'pr-5')}>
          <p className="text-small font-semibold leading-snug text-brand-navy">{title}</p>
          {description ? (
            <p className="text-caption mt-0.5 leading-snug text-slate-500 text-pretty">{description}</p>
          ) : null}
        </div>
      </div>
    </button>
  );
}