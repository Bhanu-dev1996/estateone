import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-white border-slate-200 text-brand-navy',
  info: 'bg-blue-50/90 border-blue-200/80 text-brand-navy',
  success: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950',
};

export function Alert({ className, variant = 'default', ...props }) {
  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-2xl border p-4', variants[variant], className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }) {
  return <h5 className={cn('text-small font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function AlertDescription({ className, ...props }) {
  return (
    <div className={cn('text-caption text-slate-600 [&_p]:leading-relaxed', className)} {...props} />
  );
}