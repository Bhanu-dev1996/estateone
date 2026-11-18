import React from 'react';

export default function Loader({ size = 'md', text = 'Loading verified properties', fullScreen = false }) {
  const sizeMap = {
    sm: { box: 'w-6 h-6', border: 'border-2', icon: 16 },
    md: { box: 'w-10 h-10', border: 'border-3', icon: 24 },
    lg: { box: 'w-14 h-14', border: 'border-4', icon: 32 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Outer Champagne Gold Orbit Ring */}
        <div 
          className={`${currentSize.box} rounded-full border-t-brand-gold border-r-transparent border-b-brand-navy border-l-transparent animate-spin`}
          style={{ animationDuration: '0.9s' }}
        />
        {/* Inner Soft Blue Ambient Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
      </div>

      {text && (
        <span className="caption-3 font-semibold text-brand-navy tracking-tight animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
