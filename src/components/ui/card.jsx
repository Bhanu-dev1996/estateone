import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border-0 bg-white/75 backdrop-blur-2xl backdrop-saturate-200 text-brand-text shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
}

function hasTextSizeClass(className) {
  return typeof className === 'string' && /\btext-(h[1-4]|body|small|caption|xs|sm|base|lg)\b/.test(className);
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        'font-semibold leading-snug tracking-tight text-brand-navy text-pretty',
        !hasTextSizeClass(className) && 'text-h4',
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn(
        'text-brand-muted leading-relaxed text-pretty max-w-[65ch]',
        !hasTextSizeClass(className) && 'text-small',
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props} />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  );
}
