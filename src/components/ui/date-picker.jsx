import React, { useMemo, useState } from 'react';
import { format, isValid, parse, startOfDay } from 'date-fns';
import { CalendarBlank } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';

function parseIsoDate(value) {
  if (!value?.trim()) return undefined;
  const parsed = parse(value.trim(), 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function DatePickerField({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
  minDate,
  disabled,
  className,
  'aria-invalid': ariaInvalid,
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseIsoDate(value), [value]);
  const minDay = useMemo(() => (minDate ? startOfDay(minDate) : startOfDay(new Date())), [minDate]);

  const displayLabel = selected ? format(selected, 'dd MMM yyyy') : placeholder;

  const handleSelect = (date) => {
    if (!date) {
      onChange?.('');
      setOpen(false);
      return;
    }
    onChange?.(format(date, 'yyyy-MM-dd'));
    setOpen(false);
  };

  return (
    <div className="w-full">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className={cn(
          'listing-wizard-field-control flex h-10 w-full min-w-0 items-center justify-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 font-medium text-brand-navy',
          'hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50',
          selected ? 'text-body' : 'text-small text-slate-400',
          ariaInvalid && 'border-rose-400 ring-1 ring-rose-400/30',
          className
        )}
      >
        <CalendarBlank size={18} className={cn('shrink-0', selected ? 'text-brand-blue' : 'text-slate-400')} />
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-left',
            selected && 'font-semibold tracking-tight text-brand-navy'
          )}
        >
          {displayLabel}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-1 shadow-md"
        align="start"
        sideOffset={2}
      >
        <Calendar
          fullWidth
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={{ before: minDay }}
          defaultMonth={selected || minDay}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    </div>
  );
}