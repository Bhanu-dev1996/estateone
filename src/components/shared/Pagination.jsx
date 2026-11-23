import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav 
      aria-label="Pagination Navigation" 
      className={`flex items-center justify-center gap-1.5 py-8 ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="min-h-10 button-sm flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
      >
        <CaretLeft size={14} weight="bold" />
        <span>Previous</span>
      </button>

      {/* Number Buttons */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-xs text-slate-400 select-none">
                …
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${page}`}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="min-h-10 button-sm flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
      >
        <span>Next</span>
        <CaretRight size={14} weight="bold" />
      </button>
    </nav>
  );
}
