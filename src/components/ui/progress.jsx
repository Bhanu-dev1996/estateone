import React from 'react';
import { cn } from '../../lib/utils';

export function Progress({ className, value = 0, max = 100, ...props }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-slate-200', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-brand-navy transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}