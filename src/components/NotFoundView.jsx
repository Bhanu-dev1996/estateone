import React from 'react';
import { House, MagnifyingGlass } from '@phosphor-icons/react';

export default function NotFoundView({ onBackHome }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
        <House size={36} weight="fill" />
      </div>
      <span className="caption-3 font-semibold uppercase tracking-wider text-brand-blue mb-2">
        Error 404
      </span>
      <h1 className="heading-3 text-brand-navy mb-4">
        Property or page not found
      </h1>
      <p className="body-4 text-brand-muted max-w-md mb-8">
        The property address or page URL you requested might have been removed, archived, or is temporarily unavailable.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="button-md py-2 px-4 rounded-lg bg-brand-navy text-white hover:bg-slate-800 transition-brand-fast flex items-center gap-2"
        >
          <House size={18} />
          <span>Return home</span>
        </button>
      </div>
    </div>
  );
}
