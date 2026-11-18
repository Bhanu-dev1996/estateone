import React, { useState, useRef, useEffect } from 'react';
import { MapPin, MagnifyingGlass, X } from '@phosphor-icons/react';
import { ScrollArea } from '../ui/scroll-area';

const SUGGESTIONS = [
  // Top Indian Cities
  { label: 'Mumbai, Maharashtra', city: 'Mumbai', type: 'City' },
  { label: 'Bengaluru, Karnataka', city: 'Bengaluru', type: 'City' },
  { label: 'Delhi NCR (Gurugram, Noida, Delhi)', city: 'Delhi NCR', type: 'City' },
  { label: 'Hyderabad, Telangana', city: 'Hyderabad', type: 'City' },
  { label: 'Pune, Maharashtra', city: 'Pune', type: 'City' },
  { label: 'Chennai, Tamil Nadu', city: 'Chennai', type: 'City' },
  { label: 'Goa', city: 'Goa', type: 'City' },
  { label: 'Kolkata, West Bengal', city: 'Kolkata', type: 'City' },

  // Top Prime Localities
  { label: 'Worli, Mumbai', city: 'Mumbai', locality: 'Worli', type: 'Locality' },
  { label: 'Bandra West, Mumbai', city: 'Mumbai', locality: 'Bandra West', type: 'Locality' },
  { label: 'Bandra Kurla Complex (BKC), Mumbai', city: 'Mumbai', locality: 'BKC', type: 'Locality' },
  { label: 'Juhu, Mumbai', city: 'Mumbai', locality: 'Juhu', type: 'Locality' },
  { label: 'Indiranagar, Bengaluru', city: 'Bengaluru', locality: 'Indiranagar', type: 'Locality' },
  { label: 'Whitefield, Bengaluru', city: 'Bengaluru', locality: 'Whitefield', type: 'Locality' },
  { label: 'Koramangala, Bengaluru', city: 'Bengaluru', locality: 'Koramangala', type: 'Locality' },
  { label: 'Golf Course Road, Gurugram', city: 'Delhi NCR', locality: 'Golf Course Road', type: 'Locality' },
  { label: 'Cyber City, Gurugram', city: 'Delhi NCR', locality: 'Cyber City', type: 'Locality' },
  { label: 'Hitec City, Hyderabad', city: 'Hyderabad', locality: 'Hitec City', type: 'Locality' },
  { label: 'Jubilee Hills, Hyderabad', city: 'Hyderabad', locality: 'Jubilee Hills', type: 'Locality' },
  { label: 'Koregaon Park, Pune', city: 'Pune', locality: 'Koregaon Park', type: 'Locality' }
];

export default function LocationAutocomplete({ 
  value = '', 
  onChange, 
  onSelect,
  placeholder = 'Search city, locality, or landmark...',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const query = (value || '').trim().toLowerCase();

  const filteredSuggestions = query
    ? SUGGESTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query) ||
          (s.locality && s.locality.toLowerCase().includes(query))
      )
    : SUGGESTIONS.slice(0, 8);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        handleSelectItem(filteredSuggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectItem = (item) => {
    if (onSelect) {
      onSelect(item);
    } else if (onChange) {
      onChange(item.locality ? `${item.locality}, ${item.city}` : item.city);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    if (onChange) onChange('');
    if (onSelect) onSelect({ label: '', city: 'All cities' });
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative text-left ${className}`}>
      <div className="relative flex items-center">
        <MapPin size={18} className="absolute left-3.5 text-brand-gold shrink-0 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-brand-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear location input"
            className="absolute right-3 text-slate-400 hover:text-brand-navy cursor-pointer transition-colors"
          >
            <X size={14} weight="bold" />
          </button>
        ) : (
          <MagnifyingGlass size={16} className="absolute right-3 text-slate-300 pointer-events-none" />
        )}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white rounded-2xl shadow-xl border border-slate-100 z-50">
          <ScrollArea className="h-60 pr-1.5" type="always">
            <ul role="listbox" className="space-y-0.5">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item, idx) => {
                  const isSelected = highlightedIndex === idx;
                  return (
                    <li
                      key={`${item.label}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`px-3.5 py-2.5 text-xs rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-100 text-brand-navy' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin size={14} className="text-[#C5A46D] shrink-0" />
                        <span className="font-medium truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 shrink-0 ml-2">
                        {item.type}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-3 text-xs text-slate-400 text-center">
                  No matching Indian cities or localities found
                </li>
              )}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
