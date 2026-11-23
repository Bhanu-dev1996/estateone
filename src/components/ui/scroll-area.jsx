import React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '../../lib/utils';

export const ScrollArea = React.forwardRef(
  (
    {
      className,
      children,
      viewportClassName,
      scrollbarClassName,
      thumbClassName,
      type = 'always',
      ...props
    },
    ref,
  ) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    type={type}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport 
      className={cn(
        'h-full w-full rounded-[inherit] [&>div]:!block',
        viewportClassName
      )}
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar className={scrollbarClassName} thumbClassName={thumbClassName} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
),
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export const ScrollBar = React.forwardRef(
  ({ className, thumbClassName, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors p-0.5',
        orientation === 'vertical' && 'h-full w-2',
        orientation === 'horizontal' && 'h-2 flex-col',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          'relative flex-1 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors',
          thumbClassName,
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

