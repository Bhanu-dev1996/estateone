import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        'border-0 rounded-2xl overflow-hidden bg-white/75 backdrop-blur-xl shadow-xs transition-all duration-300 hover:bg-white/90',
        className
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between p-5 text-left text-body-lg text-brand-navy font-semibold hover:bg-white/40 transition-brand-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue cursor-pointer [&[data-state=open]>div>svg]:rotate-180 [&[data-state=open]>div>svg]:text-brand-blue',
          className
        )}
        {...props}
      >
        {children}
        <div className="p-1.5 rounded-full text-brand-muted bg-slate-200/40 backdrop-blur-sm">
          <CaretDown size={20} weight="bold" className="transition-transform duration-300" />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('px-5 pb-5 pt-1 text-body text-brand-text border-t border-black/5 bg-white/40 max-w-[65ch]', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
