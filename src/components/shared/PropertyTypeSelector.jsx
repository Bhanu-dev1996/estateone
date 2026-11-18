import React from 'react';
import { Buildings, House, Storefront, Warehouse, CaretDown } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';

const RESIDENTIAL_TYPES = [
  'All residential',
  'Apartments',
  'Villas',
  'Independent Houses',
  'Penthouses',
  'Residential Plots'
];

const COMMERCIAL_TYPES = [
  'All commercial',
  'Office Spaces',
  'Retail Shops',
  'Warehouses',
  'Industrial Properties',
  'Commercial Land'
];

export default function PropertyTypeSelector({
  value = 'All types',
  onChange,
  intent = 'buy',
  className = ''
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-brand-navy hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2 truncate">
            {intent === 'commercial' ? (
              <Storefront size={16} className="text-[#C5A46D] shrink-0" />
            ) : (
              <House size={16} className="text-[#C5A46D] shrink-0" />
            )}
            <span className="truncate">{value}</span>
          </div>
          <CaretDown size={12} className="text-slate-400 shrink-0 ml-1.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 p-1">
        <ScrollArea className="h-64 pr-1">
          <DropdownMenuItem onClick={() => onChange?.('All types')}>
            <span>All property types</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          {intent !== 'commercial' && (
            <>
              <DropdownMenuLabel>Residential</DropdownMenuLabel>
              {RESIDENTIAL_TYPES.map((type) => (
                <DropdownMenuItem 
                  key={type} 
                  onClick={() => onChange?.(type)}
                  className={value === type ? 'font-semibold text-brand-navy bg-slate-100' : ''}
                >
                  <span>{type}</span>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {intent !== 'buy' && intent !== 'rent' && <DropdownMenuSeparator />}

          {(intent === 'commercial' || intent === 'all') && (
            <>
              <DropdownMenuLabel>Commercial</DropdownMenuLabel>
              {COMMERCIAL_TYPES.map((type) => (
                <DropdownMenuItem 
                  key={type} 
                  onClick={() => onChange?.(type)}
                  className={value === type ? 'font-semibold text-brand-navy bg-slate-100' : ''}
                >
                  <span>{type}</span>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
