import React from 'react';
import { MagnifyingGlass, House, ArrowClockwise, Sparkle } from '@phosphor-icons/react';

export default function EmptyState({
  title = 'No verified properties found',
  description = 'Try broadening your budget, clearing selected filters, or searching an adjacent locality.',
  actionLabel = 'Reset all filters',
  onAction,
  icon: CustomIcon,
  className = ''
}) {
  const IconComponent = CustomIcon || MagnifyingGlass;

  return (
    <div className={`p-10 md:p-14 rounded-3xl bg-white border-0 shadow-xs flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-brand-navy mb-4">
        <IconComponent size={32} weight="duotone" className="text-brand-navy" />
      </div>

      <h3 className="heading-3 text-brand-navy font-bold mb-2">
        {title}
      </h3>

      <p className="body-4 text-slate-500 max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="py-2.5 px-5 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <ArrowClockwise size={15} weight="bold" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
