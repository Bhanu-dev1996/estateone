import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

/** Page chrome */
export { DashboardPageHeader, DashboardHeaderButton } from './DashboardPageHeader';

export function DashboardSectionTitle({ children, className, ...props }) {
  return (
    <h2 className={cn('text-h4 text-brand-navy font-semibold tracking-tight', className)} {...props}>
      {children}
    </h2>
  );
}

/** Primary / secondary actions in dashboard */
export const dashboardBtnPrimary =
  'rounded-2xl min-h-10 px-4 button-sm font-heading font-semibold';

export const dashboardBtnOutline =
  'rounded-2xl min-h-10 px-4 button-sm font-heading font-semibold border border-slate-200';

export function DashboardPrimaryButton({ className, size = 'sm', ...props }) {
  return <Button size={size} className={cn(dashboardBtnPrimary, className)} {...props} />;
}

export function DashboardOutlineButton({ className, size = 'sm', variant = 'outline', ...props }) {
  return <Button variant={variant} size={size} className={cn(dashboardBtnOutline, className)} {...props} />;
}

/** Modal typography (product density) */
export function DashboardDialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn('text-h4 text-brand-navy font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

export function DashboardDialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn('text-small text-slate-500 mt-1 text-pretty', className)}
      {...props}
    />
  );
}

/** Inline panel title (reschedule, create alert, etc.) */
export function DashboardPanelTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-h4 text-brand-navy font-semibold', className)} {...props}>
      {children}
    </h3>
  );
}