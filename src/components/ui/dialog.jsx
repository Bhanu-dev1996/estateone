import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white/90 backdrop-blur-2xl backdrop-saturate-200 border border-white/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/60 p-6 focus:outline-none transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 p-1.5 rounded-full text-brand-muted hover:text-brand-navy hover:bg-white/70 transition-brand-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue cursor-pointer">
          <X size={20} weight="bold" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4 border-b border-black/5 mb-4', className)} {...props} />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title className={cn('title-1 text-brand-navy font-semibold', className)} {...props} />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description className={cn('caption-2 text-brand-muted', className)} {...props} />
  );
}
