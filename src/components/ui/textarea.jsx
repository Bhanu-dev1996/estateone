import React from 'react';
import { cn } from '../../lib/utils';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy placeholder:text-brand-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 transition-brand-fast resize-none',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
