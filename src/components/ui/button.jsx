import React from 'react';
import { cn } from '../../lib/utils';

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold transition-brand-fast active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-brand-navy text-white hover:bg-slate-800 focus-visible:ring-brand-gold shadow-sm',
    secondary: 'bg-white border border-brand-border text-brand-navy hover:bg-slate-50 focus-visible:ring-brand-blue shadow-sm',
    accent: 'bg-brand-gold text-brand-navy font-bold hover:bg-amber-300 focus-visible:ring-white shadow-md',
    ghost: 'text-brand-navy hover:bg-slate-100 focus-visible:ring-brand-blue',
    outline: 'border border-brand-border text-brand-navy hover:bg-slate-50 focus-visible:ring-brand-blue',
  };

  const sizes = {
    sm: 'button-sm py-2 px-3 rounded-lg',
    md: 'button-md py-2 px-3 rounded-lg',
    lg: 'button-lg py-2.5 px-5 rounded-xl',
    icon: 'p-2 rounded-full',
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
