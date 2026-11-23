import React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import 'react-day-picker/style.css';

const COMPACT_RDP_VARS = {
  '--rdp-day-height': '2rem',
  '--rdp-day-width': '2rem',
  '--rdp-day_button-height': '1.875rem',
  '--rdp-day_button-width': '1.875rem',
  '--rdp-day_button-border-radius': '0.5rem',
  '--rdp-nav_button-height': '1.5rem',
  '--rdp-nav_button-width': '1.5rem',
  '--rdp-nav-height': '1.75rem',
  '--rdp-weekday-padding': '0.125rem 0',
  '--rdp-months-gap': '0.5rem',
  '--rdp-disabled-opacity': '0.55',
  '--rdp-accent-color': '#142B4A',
  '--rdp-accent-background-color': '#e8eef5',
};

export function Calendar({ className, classNames, showOutsideDays = true, fullWidth = false, ...props }) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'estateone-calendar-compact p-1.5',
        fullWidth && 'estateone-calendar-fullwidth w-full',
        className
      )}
      style={COMPACT_RDP_VARS}
      classNames={{
        root: cn(fullWidth ? 'w-full' : 'w-fit', 'text-caption', defaultClassNames.root),
        months: cn('flex flex-col gap-2', fullWidth ? 'w-full max-w-none' : '', defaultClassNames.months),
        month: cn('flex flex-col gap-1.5', fullWidth && 'w-full', defaultClassNames.month),
        month_caption: cn(
          'relative mb-0.5 flex h-7 items-center justify-center text-caption font-semibold text-brand-navy',
          defaultClassNames.month_caption
        ),
        caption_label: cn('text-caption font-semibold leading-none text-brand-navy', defaultClassNames.caption_label),
        nav: cn('absolute inset-x-0 top-0 flex items-center justify-between', defaultClassNames.nav),
        button_previous: cn(
          'h-6 w-6 rounded-md border-0 bg-transparent p-0 opacity-70 hover:bg-slate-100 hover:opacity-100',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          'h-6 w-6 rounded-md border-0 bg-transparent p-0 opacity-70 hover:bg-slate-100 hover:opacity-100',
          defaultClassNames.button_next
        ),
        month_grid: cn(
          'w-full border-collapse',
          fullWidth && 'table-fixed',
          defaultClassNames.month_grid
        ),
        weekdays: cn(defaultClassNames.weekdays),
        weekday: cn(
          'text-center text-micro font-medium text-slate-500',
          defaultClassNames.weekday
        ),
        week: cn(defaultClassNames.week),
        day: cn('relative p-0 text-center', defaultClassNames.day),
        day_button: cn(
          'inline-flex items-center justify-center rounded-md p-0 font-medium text-brand-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40',
          fullWidth ? 'h-8 w-full max-w-none text-small' : 'h-8 w-8 text-caption',
          defaultClassNames.day_button
        ),
        selected: cn(
          'rounded-md bg-brand-navy !text-white text-small font-bold hover:bg-brand-navy hover:!text-white focus:bg-brand-navy',
          defaultClassNames.selected
        ),
        today: cn('rounded-md bg-slate-100 text-brand-navy font-semibold', defaultClassNames.today),
        outside: cn('text-slate-400 opacity-45', defaultClassNames.outside),
        disabled: cn('text-slate-400', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon = orientation === 'left' ? CaretLeft : CaretRight;
          return <Icon className={cn('h-3.5 w-3.5 text-brand-navy', chevronClassName)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}