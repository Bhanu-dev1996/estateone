import React from 'react';
import { House } from '@phosphor-icons/react';
import { Button } from './ui/button';

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
        <Button type="button" size="sm" onClick={onBackHome} className="rounded-2xl shadow-xs">
          <House size={16} weight="bold" />
          Return home
        </Button>
      </div>
    </div>
  );
}
