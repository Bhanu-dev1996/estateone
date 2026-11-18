import React from 'react';
import { CurrencyInr, CaretDown } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';

const BUY_BUDGETS = [
  { label: 'Any purchase budget', value: 'all' },
  { label: 'Under ₹1 Cr', value: 'under-1cr', min: 0, max: 10000000 },
  { label: '₹1 Cr to ₹3 Cr', value: '1cr-3cr', min: 10000000, max: 30000000 },
  { label: '₹3 Cr to ₹7 Cr', value: '3cr-7cr', min: 30000000, max: 70000000 },
  { label: '₹7 Cr to ₹15 Cr', value: '7cr-15cr', min: 70000000, max: 150000000 },
  { label: 'Above ₹15 Cr (Ultra luxury)', value: 'above-15cr', min: 150000000, max: null }
];

const RENT_BUDGETS = [
  { label: 'Any rental budget', value: 'all' },
  { label: 'Under ₹50,000 / mo', value: 'under-50k', min: 0, max: 50000 },
  { label: '₹50,000 to ₹1.5 Lac / mo', value: '50k-1.5lac', min: 50000, max: 150000 },
  { label: '₹1.5 Lac to ₹3 Lac / mo', value: '1.5lac-3lac', min: 150000, max: 300000 },
  { label: 'Above ₹3 Lac / mo', value: 'above-3lac', min: 300000, max: null }
];

const COMMERCIAL_BUDGETS = [
  { label: 'Any commercial budget', value: 'all' },
  { label: 'Under ₹1 Lac / mo', value: 'under-1lac', min: 0, max: 100000 },
  { label: '₹1 Lac to ₹5 Lac / mo', value: '1lac-5lac', min: 100000, max: 500000 },
  { label: 'Above ₹5 Lac / mo', value: 'above-5lac', min: 500000, max: null }
];

export default function PriceRangeSelector({
  value = 'all',
  onChange,
  intent = 'buy',
  className = ''
}) {
  const options = 
    intent === 'rent' 
      ? RENT_BUDGETS 
      : intent === 'commercial' 
        ? COMMERCIAL_BUDGETS 
        : BUY_BUDGETS;

  const currentOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-brand-navy hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2 truncate">
            <CurrencyInr size={16} className="text-[#C5A46D] shrink-0" />
            <span className="truncate">{currentOption.label}</span>
          </div>
          <CaretDown size={12} className="text-slate-400 shrink-0 ml-1.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-1">
        <ScrollArea className="h-64 pr-1">
          <DropdownMenuLabel>
            {intent === 'rent' ? 'Monthly rental budget' : intent === 'commercial' ? 'Commercial budget' : 'Purchase budget'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange?.(opt)}
              className={value === opt.value ? 'font-semibold text-brand-navy bg-slate-100' : ''}
            >
              <span>{opt.label}</span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
