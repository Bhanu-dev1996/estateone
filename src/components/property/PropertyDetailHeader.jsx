import React from 'react';
import {
  ShieldCheck,
  MapPin,
  CalendarCheck,
  ChatCircleText,
  Scales,
  Heart,
  ShareNetwork,
  Flag,
  Clock,
} from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { getPropertyStatusBadgeClassOnPage } from '../../lib/propertyStatusBadge';

export default function PropertyDetailHeader({
  property,
  saved,
  compared,
  onRequestVisit,
  onEnquire,
  onToggleCompare,
  onToggleSave,
  onShare,
  onReport,
}) {
  if (!property) return null;

  return (
    <header className="property-detail-hero mb-8">
      <div className="property-detail-hero__content min-w-0 flex-1">
        <div className="property-detail-hero__chips">
          {property.verified && (
            <span className="property-detail-hero__chip property-detail-hero__chip--verified">
              <ShieldCheck size={14} weight="fill" aria-hidden />
              <span className="truncate max-w-[14rem] sm:max-w-none">
                RERA verified · {property.reraId}
              </span>
            </span>
          )}
          <span
            className={`property-detail-hero__chip ${getPropertyStatusBadgeClassOnPage(property.status)}`}
          >
            {property.status}
          </span>
        </div>

        <h1 className="property-detail-hero__title">{property.title}</h1>

        <div className="property-detail-hero__meta">
          <span className="property-detail-hero__location">
            <MapPin size={14} weight="fill" className="shrink-0 text-brand-gold" aria-hidden />
            <span className="truncate">{property.location}</span>
          </span>
          {property.postedDateText ? (
            <>
              <span className="property-detail-hero__meta-dot" aria-hidden />
              <span className="property-detail-hero__meta-item">
                <Clock size={12} aria-hidden />
                {property.postedDateText}
              </span>
            </>
          ) : null}
          {property.propertyId ? (
            <>
              <span className="property-detail-hero__meta-dot hidden sm:inline" aria-hidden />
              <span className="property-detail-hero__meta-item property-detail-hero__meta-id hidden sm:inline">
                {property.propertyId}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="property-detail-hero__actions shrink-0">
        <div className="property-detail-hero__actions-primary">
          <Button
            type="button"
            onClick={onRequestVisit}
            className="w-full sm:w-auto [&_svg]:text-brand-gold"
          >
            <CalendarCheck size={16} weight="bold" aria-hidden />
            Request visit
          </Button>
          <Button type="button" variant="accent" onClick={onEnquire} className="w-full sm:w-auto">
            <ChatCircleText size={16} weight="bold" aria-hidden />
            Enquire
          </Button>
        </div>

        <div className="property-detail-hero__actions-toolbar" role="toolbar" aria-label="Property actions">
          <Button
            type="button"
            variant={compared ? 'primary' : 'outline'}
            onClick={onToggleCompare}
            title={compared ? 'In comparison' : 'Add to compare'}
            className={compared ? '[&_svg]:text-brand-gold' : ''}
          >
            <Scales size={16} weight={compared ? 'fill' : 'bold'} aria-hidden />
            <span className="hidden min-[400px]:inline">{compared ? 'In comparison' : 'Compare'}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onToggleSave}
            className={
              saved
                ? 'border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100 [&_svg]:text-rose-600'
                : ''
            }
          >
            <Heart size={16} weight={saved ? 'fill' : 'bold'} aria-hidden />
            <span className="hidden min-[400px]:inline">{saved ? 'Saved' : 'Save'}</span>
          </Button>

          <Button type="button" variant="outline" onClick={onShare}>
            <ShareNetwork size={16} aria-hidden />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onReport}
            className="text-slate-500 hover:text-rose-600"
          >
            <Flag size={16} aria-hidden />
            <span className="hidden sm:inline">Report</span>
          </Button>
        </div>
      </div>
    </header>
  );
}