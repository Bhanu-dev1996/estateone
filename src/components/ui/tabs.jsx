import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-slate-200/50 backdrop-blur-md border border-white/60 rounded-full shadow-inner',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'px-4 py-1.5 rounded-full text-xs font-semibold text-brand-muted hover:text-brand-navy transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      className={cn('focus-visible:outline-none', className)}
      {...props}
    />
  );
}
