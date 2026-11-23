import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scales, X, ArrowRight, CaretUp, CaretDown, Trash, Plus } from '@phosphor-icons/react';
import { useProperty } from '../../context/PropertyContext';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { Button } from '../ui/button';

export default function CompareTray() {
  const location = useLocation();
  const { comparePropertyIds, removeCompare, clearCompare } = useProperty();
  const [isMinimized, setIsMinimized] = useState(false);

  if (location.pathname === '/compare' || comparePropertyIds.length === 0) {
    return null;
  }

  const comparedProperties = SAMPLE_PROPERTIES.filter((p) => comparePropertyIds.includes(p.id));
  const totalSlots = 4;
  const emptySlotsCount = Math.max(0, totalSlots - comparedProperties.length);

  return (
    <aside
      aria-label="Property comparison tray"
      className={`compare-tray transition-all duration-300 ${isMinimized ? 'compare-tray--minimized' : ''}`}
    >
      <div className="compare-tray__shell text-left">
        <div className="compare-tray__inner">
          <div className="compare-tray__header">
            <div className="compare-tray__brand">
              <span className="compare-tray__icon" aria-hidden>
                <Scales size={15} weight="fill" />
              </span>
              <div className="min-w-0">
                <span className="compare-tray__title">
                  Compare properties
                  <span className="compare-tray__count" aria-live="polite">
                    {comparedProperties.length} / {totalSlots}
                  </span>
                </span>
                {!isMinimized && (
                  <p className="compare-tray__meta hidden sm:block">
                    Shortlist up to {totalSlots} residences for side-by-side review
                  </p>
                )}
              </div>
            </div>

            <div className="compare-tray__toolbar">
              <button
                type="button"
                onClick={clearCompare}
                className="compare-tray__text-btn cursor-pointer"
                title="Clear all compared properties"
              >
                <Trash size={14} aria-hidden />
                <span className="hidden sm:inline">Clear</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                aria-label={isMinimized ? 'Expand comparison tray' : 'Collapse comparison tray'}
                aria-expanded={!isMinimized}
                className="compare-tray__icon-btn cursor-pointer"
              >
                {isMinimized ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="compare-tray__body">
              <div className="compare-tray__slots" role="list" aria-label="Properties selected for comparison">
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="compare-tray__slot" role="listitem">
                    <img
                      src={prop.images?.[0]}
                      alt=""
                      className="compare-tray__thumb"
                      loading="lazy"
                    />
                    <div className="compare-tray__slot-text">
                      <p className="compare-tray__slot-title" title={prop.title}>
                        {prop.title}
                      </p>
                      <p className="compare-tray__slot-price">{prop.priceDisplay}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCompare(prop.id)}
                      aria-label={`Remove ${prop.title} from comparison`}
                      className="compare-tray__remove cursor-pointer"
                    >
                      <X size={11} weight="bold" aria-hidden />
                    </button>
                  </div>
                ))}

                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <Link
                    key={`empty-${idx}`}
                    to="/compare"
                    className="compare-tray__empty hover:border-brand-blue/40 hover:text-brand-blue transition-colors"
                    role="listitem"
                    title="Add another property on the compare page"
                  >
                    <Plus size={14} weight="bold" aria-hidden />
                    <span>Add property</span>
                  </Link>
                ))}
              </div>

              <div className="compare-tray__actions">
                <Link to="/compare" className="w-full lg:w-auto">
                  <Button size="sm" className="compare-tray__cta w-full gap-2">
                    Compare side by side
                    <ArrowRight size={16} weight="bold" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}