import React from 'react';
import { WarningCircle, WifiSlash, ArrowClockwise } from '@phosphor-icons/react';
import { Button } from '../ui/button';

export default function ErrorState({
  title = 'Unable to load real estate data',
  description = 'A network or server communication error occurred. Your connection may be intermittent.',
  onRetry,
  isOffline = false,
  className = ''
}) {
  return (
    <div className={`p-10 md:p-14 rounded-3xl bg-rose-50/50 border-0 shadow-xs flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        {isOffline ? (
          <WifiSlash size={32} weight="duotone" />
        ) : (
          <WarningCircle size={32} weight="duotone" />
        )}
      </div>

      <h3 className="heading-3 text-rose-950 font-bold mb-2">
        {title}
      </h3>

      <p className="body-4 text-rose-800/80 max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {onRetry && (
        <Button type="button" size="sm" variant="destructive" onClick={onRetry} className="rounded-2xl shadow-xs">
          <ArrowClockwise size={16} weight="bold" />
          Retry connection
        </Button>
      )}
    </div>
  );
}
