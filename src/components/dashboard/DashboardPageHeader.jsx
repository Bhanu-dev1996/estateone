import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Standard dashboard workspace header (dense typography: h3-scale title, small body, sm buttons).
 */
export function DashboardPageHeader({
  title,
  description,
  action,
  leading,
  prefix,
  titleClassName,
  className,
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {leading}
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className={cn('flex items-start gap-3', prefix ? 'items-center' : undefined)}>
          {prefix}
          <div className="min-w-0">
        <h1 className={cn('text-dashboard-title text-brand-navy tracking-tight', titleClassName)}>{title}</h1>
        {description ? (
          <p className="text-small text-slate-500 mt-1.5 max-w-2xl text-pretty">{description}</p>
        ) : null}
          </div>
        </div>
      </div>
      {action ? <div className="shrink-0 self-start sm:self-center flex flex-wrap items-center gap-2">{action}</div> : null}
    </div>
    </div>
  );
}

export function DashboardHeaderButton({ className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center min-h-10 px-4 py-2 rounded-2xl',
        'button-sm text-white bg-brand-navy hover:bg-slate-900',
        'font-heading font-semibold transition-brand-fast cursor-pointer shadow-xs',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold',
        className
      )}
      {...props}
    />
  );
}