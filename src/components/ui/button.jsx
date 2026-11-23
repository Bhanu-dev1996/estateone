import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Canonical control — matches login / auth CTAs:
 * size="sm", rounded-2xl, shadow-xs, text-small (button-sm), min-h-10.
 */
export function Button({
  className,
  variant = 'primary',
  size = 'sm',
  children,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 font-heading font-semibold leading-tight transition-brand-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-brand-navy text-white hover:bg-brand-navy-hover focus-visible:ring-brand-gold/50 shadow-xs',
    secondary:
      'bg-white border border-brand-border text-brand-navy hover:bg-slate-50 focus-visible:ring-brand-blue/40 shadow-xs',
    accent:
      'bg-brand-gold text-brand-navy font-bold hover:bg-amber-300 focus-visible:ring-amber-200/80 shadow-xs',
    ghost: 'text-brand-navy hover:bg-slate-100 focus-visible:ring-brand-blue/30 shadow-none',
    outline:
      'border border-brand-border text-brand-navy hover:bg-slate-50 focus-visible:ring-brand-blue/30 bg-white shadow-xs',
    destructive:
      'bg-rose-700 text-white hover:bg-rose-800 focus-visible:ring-rose-300/50 shadow-xs',
  };

  const sizes = {
    sm: 'button-sm min-h-10 py-2 px-3.5 rounded-2xl shadow-xs',
    md: 'button-sm min-h-10 py-2 px-3.5 rounded-2xl shadow-xs',
    lg: 'button-lg min-h-11 py-2.5 px-4 rounded-2xl shadow-xs',
    icon: 'button-sm p-2 rounded-xl min-h-10 min-w-10 shadow-xs',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}