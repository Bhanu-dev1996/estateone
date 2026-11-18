import React from 'react';

export default function Logo({ 
  variant = 'full', 
  theme = 'light', 
  size = 'md',
  className = '' 
}) {
  const isDark = theme === 'dark';

  // Dimension presets
  const sizeConfig = {
    sm: { icon: 32, textPrimary: 'text-base', textSecondary: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 40, textPrimary: 'text-lg', textSecondary: 'text-[9.5px]', gap: 'gap-2.5' },
    lg: { icon: 52, textPrimary: 'text-2xl', textSecondary: 'text-xs', gap: 'gap-3' },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // The geometric E1 architectural monogram emblem
  const Emblem = (
    <div 
      style={{ width: currentSize.icon, height: currentSize.icon }}
      className="flex-shrink-0 relative group"
    >
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        {/* Rounded Squircle Container */}
        <rect 
          width="48" 
          height="48" 
          rx="12" 
          fill={isDark ? 'rgba(255, 255, 255, 0.08)' : '#142B4A'} 
          stroke={isDark ? '#C5A46D' : 'transparent'} 
          strokeWidth={isDark ? '1' : '0'} 
          strokeOpacity={isDark ? '0.4' : '0'}
        />
        
        {/* Architectural Roofline Apex */}
        <path d="M24 8.5L12 18.5H17L24 12.8L31 18.5H36L24 8.5Z" fill="#C5A46D"/>
        
        {/* Left Spine of E */}
        <rect x="15" y="21" width="4" height="17" rx="1.5" fill="#C5A46D"/>
        {/* Three Horizontal Rungs of E */}
        <rect x="15" y="21" width="13" height="3.5" rx="1.5" fill="#C5A46D"/>
        <rect x="15" y="27.5" width="9" height="3.5" rx="1.5" fill="#C5A46D"/>
        <rect x="15" y="34.5" width="13" height="3.5" rx="1.5" fill="#C5A46D"/>
        
        {/* Tall Standing 1 Pillar */}
        <rect x="25" y="16.5" width="4" height="21.5" rx="1.5" fill="#C5A46D"/>
        <path d="M25 18.5L21.5 21V19L25 16.5H26.5V18.5H25Z" fill="#C5A46D"/>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return Emblem;
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {Emblem}
      <div className="flex flex-col text-left">
        <span 
          className={`font-heading font-bold leading-tight tracking-tight ${currentSize.textPrimary} ${
            isDark ? 'text-white' : 'text-brand-navy'
          }`}
        >
          Estate<span className="font-extrabold text-brand-gold">One</span>
        </span>
        <span 
          className={`font-heading font-semibold uppercase tracking-[0.2em] leading-none mt-0.5 ${currentSize.textSecondary} ${
            isDark ? 'text-slate-300' : 'text-brand-muted'
          }`}
        >
          Verified Realty
        </span>
      </div>
    </div>
  );
}
