import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'listing-wizard-field-control flex h-10 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-small text-brand-navy placeholder:text-caption placeholder:font-normal placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 transition-brand-fast',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
