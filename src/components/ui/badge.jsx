import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full caption-4 font-semibold transition-all duration-300';

  const variants = {
    default: 'bg-blue-50/70 backdrop-blur-md text-brand-navy border border-blue-200/60 shadow-xs',
    verified: 'bg-white/80 backdrop-blur-xl text-brand-navy border border-white/90 shadow-xs',
    accent: 'bg-brand-navy/85 backdrop-blur-xl text-white border border-white/20 shadow-xs',
    neutral: 'bg-slate-200/50 backdrop-blur-md text-brand-navy border border-white/40 shadow-xs',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
