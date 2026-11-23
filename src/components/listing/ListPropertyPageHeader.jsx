import React from 'react';
import { ListBullets, PlusCircle, ShieldCheck } from '@phosphor-icons/react';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import ListingHowItWorksSteps from './ListingHowItWorksSteps';

const tabTriggerClass =
  'min-h-10 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-caption font-semibold leading-none whitespace-nowrap data-[state=active]:bg-brand-navy data-[state=active]:text-white data-[state=active]:shadow-xs data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-50 data-[state=inactive]:hover:text-brand-navy';

export default function ListPropertyPageHeader({
  activeTab,
  submissionsCount,
  showWizardTab,
  onTabChange,
}) {
  return (
    <header className="listing-page-header mb-8 space-y-6">
      <div className="listing-page-header__row">
        <div className="listing-page-header__copy">
          <Badge variant="default" className="gap-1.5 text-caption font-semibold">
            <ShieldCheck size={14} weight="fill" aria-hidden />
            Verified seller portal
          </Badge>
          <h1 className="listing-page-header__title">List your property</h1>
          <p className="listing-page-header__desc">
            Share your property details once. Our team checks RERA and title papers before your
            listing appears to buyers on EstateOne.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="self-start">
          <TabsList className="inline-flex h-auto flex-row items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
            {showWizardTab && (
              <TabsTrigger value="wizard" className={tabTriggerClass}>
                <PlusCircle size={16} weight="bold" aria-hidden />
                <span>New listing</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="submissions" className={tabTriggerClass}>
              <ListBullets size={16} weight="bold" aria-hidden />
              <span>My listings ({submissionsCount})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {showWizardTab && activeTab === 'wizard' && <ListingHowItWorksSteps />}
    </header>
  );
}