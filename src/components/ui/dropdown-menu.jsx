import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CaretRight, Check } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

/** Nav menus — match header pills (`text-small`); explicit tokens for portal rendering. */
const menuType =
  'text-[length:var(--text-small)] leading-[var(--text-small--line-height)] tracking-[var(--text-small--letter-spacing)]';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-lg px-2 py-1 font-medium outline-none focus:bg-slate-100 data-[state=open]:bg-slate-100 text-brand-navy',
      menuType,
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <CaretRight size={12} className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

export const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-xl bg-white/95 backdrop-blur-2xl p-1 text-brand-navy shadow-lg border-0 animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

export const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'estate-nav-dropdown z-50 flex min-w-[12rem] flex-col items-stretch overflow-hidden rounded-xl bg-white/95 backdrop-blur-2xl p-1 text-brand-navy shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-0 animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 [&_a]:flex [&_a]:w-full [&_a]:items-center [&_a]:gap-2 [&_a]:text-inherit [&_a]:font-medium',
        menuType,
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1 font-medium outline-none transition-colors focus:bg-slate-100 focus:text-brand-navy data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-slate-700 hover:text-brand-navy',
      menuType,
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'dropdown-menu-section-label px-2 pt-0.5 pb-1.5 text-small font-semibold text-slate-600 normal-case tracking-normal',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

export const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-black/5', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
