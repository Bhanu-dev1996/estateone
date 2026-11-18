import React from 'react';
import { Link } from 'react-router-dom';
import { CaretRight, House } from '@phosphor-icons/react';

export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-left py-3 ${className}`}>
      <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-brand-navy transition-colors"
            title="Return to homepage"
          >
            <House size={14} className="text-[#C5A46D]" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li aria-hidden="true" className="text-slate-300">
                <CaretRight size={11} weight="bold" />
              </li>
              <li>
                {isLast || !item.href ? (
                  <span 
                    aria-current="page" 
                    className="font-semibold text-brand-navy truncate max-w-[220px] sm:max-w-xs inline-block"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.href} 
                    className="hover:text-brand-navy transition-colors truncate max-w-[180px] inline-block"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
