import React, { useState } from 'react';
import { 
  Funnel, 
  X, 
  ArrowClockwise, 
  ShieldCheck, 
  Bed, 
  Bathtub,
  Buildings, 
  CurrencyInr,
  ArrowsOut,
  SlidersHorizontal,
  CalendarCheck,
  Check
} from '@phosphor-icons/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useProperty } from '../../context/PropertyContext';
import { 
  CITIES, 
  RESIDENTIAL_TYPES, 
  COMMERCIAL_TYPES, 
  BEDROOM_OPTIONS, 
  BATHROOM_OPTIONS, 
  PROPERTY_STATUSES, 
  FURNISHING_OPTIONS,
  AMENITIES_LIST,
  POSTED_DATE_OPTIONS,
  RENT_BUDGET_RANGES,
  RENT_DEPOSIT_RANGES,
  TENANT_PREFERENCES,
  AVAILABILITY_TIMELINES,
  LEASE_DURATIONS,
  COMMERCIAL_CATEGORIES,
  COMMERCIAL_TRANSACTION_TYPES,
  COMMERCIAL_BUY_BUDGETS,
  COMMERCIAL_RENT_BUDGETS,
  COMMERCIAL_AREAS,
  COMMERCIAL_FURNISHING,
  COMMERCIAL_PARKING,
  COMMERCIAL_FLOORS,
  COMMERCIAL_BUILDING_TYPES,
  COMMERCIAL_AVAILABILITY
} from '../../data/properties';

const BUY_BUDGET_RANGES = [
  { id: 'all', label: 'Any budget' },
  { id: 'under-1cr', label: 'Under ₹1 Cr' },
  { id: '1cr-3cr', label: '₹1 Cr to ₹3 Cr' },
  { id: '3cr-7cr', label: '₹3 Cr to ₹7 Cr' },
  { id: '7cr-15cr', label: '₹7 Cr to ₹15 Cr' },
  { id: 'above-15cr', label: 'Above ₹15 Cr' }
];

const AREA_RANGES = [
  { id: 'all', label: 'Any area' },
  { id: 'under-1000', label: 'Under 1,000 sq ft' },
  { id: '1000-2000', label: '1,000 to 2,000 sq ft' },
  { id: '2000-3500', label: '2,000 to 3,500 sq ft' },
  { id: '3500-5000', label: '3,500 to 5,000 sq ft' },
  { id: 'above-5000', label: 'Above 5,000 sq ft' }
];

export default function FilterSidebar({ 
  totalResults = 0,
  className = '',
  intent = 'buy',
  onFilterChange,
  onReset
}) {
  const { filters, updateFilters, resetFilters } = useProperty();
  const applyFilter = onFilterChange || updateFilters;
  const applyReset = onReset || resetFilters;
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || [];
    if (current.includes(amenity)) {
      applyFilter({ amenities: current.filter((a) => a !== amenity) });
    } else {
      applyFilter({ amenities: [...current, amenity] });
    }
  };

  // Common filter content renderer
  const FilterContent = () => {
    if (intent === 'commercial') {
      const isCommercialBuy = filters.transactionType === 'buy';
      return (
        <div className="space-y-6 text-left">
          {/* 1. Location / City */}
          <div>
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              City
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => applyFilter({ city })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    filters.city === city
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Transaction Type (Buy / Rent / Lease / All modes) */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Transaction type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMERCIAL_TRANSACTION_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyFilter({ transactionType: t.id })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    (filters.transactionType || 'all') === t.id
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Property Category */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Property category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMERCIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => applyFilter({ commercialCategory: cat })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    (filters.commercialCategory || 'All categories') === cat
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Sale price or Monthly rent (Dynamic per PRD 5.4) */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              {isCommercialBuy ? 'Sale price' : 'Monthly rent or lease rate'}
            </label>
            <RadioGroup
              value={filters.priceRange || 'all'}
              onValueChange={(val) => applyFilter({ priceRange: val })}
              className="gap-2"
            >
              {(isCommercialBuy ? COMMERCIAL_BUY_BUDGETS : COMMERCIAL_RENT_BUDGETS).map((b) => (
                <label
                  key={b.id}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={b.id} id={`comm-budget-${b.id}`} />
                  <span>{b.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 5. Property Area */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Property area
            </label>
            <RadioGroup
              value={filters.areaRange || 'all'}
              onValueChange={(val) => applyFilter({ areaRange: val })}
              className="gap-2"
            >
              {COMMERCIAL_AREAS.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={a.id} id={`comm-area-${a.id}`} />
                  <span>{a.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 6. Furnishing / Fitout */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Furnishing
            </label>
            <RadioGroup
              value={filters.furnishing || 'All furnishing'}
              onValueChange={(val) => applyFilter({ furnishing: val })}
              className="gap-2"
            >
              {COMMERCIAL_FURNISHING.map((f) => (
                <label
                  key={f}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={f} id={`comm-furnish-${f}`} />
                  <span>{f}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 7. Parking */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Parking
            </label>
            <RadioGroup
              value={filters.parking || 'Any parking'}
              onValueChange={(val) => applyFilter({ parking: val })}
              className="gap-2"
            >
              {COMMERCIAL_PARKING.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={p} id={`comm-parking-${p}`} />
                  <span>{p}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 8. Floor Number */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Floor number
            </label>
            <RadioGroup
              value={filters.floorNumber || 'any'}
              onValueChange={(val) => applyFilter({ floorNumber: val })}
              className="gap-2"
            >
              {COMMERCIAL_FLOORS.map((fl) => (
                <label
                  key={fl.id}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={fl.id} id={`comm-floor-${fl.id}`} />
                  <span>{fl.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 9. Building Type */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Building type
            </label>
            <RadioGroup
              value={filters.buildingType || 'All building types'}
              onValueChange={(val) => applyFilter({ buildingType: val })}
              className="gap-2"
            >
              {COMMERCIAL_BUILDING_TYPES.map((bt) => (
                <label
                  key={bt}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={bt} id={`comm-bt-${bt}`} />
                  <span>{bt}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 10. Availability */}
          <div className="pt-4 border-t border-slate-100">
            <label className="caption-1 font-bold text-brand-navy block mb-2">
              Availability
            </label>
            <RadioGroup
              value={filters.availability || 'any'}
              onValueChange={(val) => applyFilter({ availability: val })}
              className="gap-2"
            >
              {COMMERCIAL_AVAILABILITY.map((av) => (
                <label
                  key={av.id}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
                >
                  <RadioGroupItem value={av.id} id={`comm-avail-${av.id}`} />
                  <span>{av.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 11. Verification Filter using Shadcn Checkbox */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 text-emerald-950 text-xs font-semibold cursor-pointer">
              <Checkbox
                checked={!!filters.verifiedOnly}
                onCheckedChange={(checked) => applyFilter({ verifiedOnly: !!checked })}
              />
              <ShieldCheck size={18} weight="fill" className="text-emerald-600 shrink-0" />
              <span>Show RERA verified listings only</span>
            </label>
          </div>

          {/* Reset CTA */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                applyReset();
                setMobileOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border-0 shadow-none"
            >
              <ArrowClockwise size={14} weight="bold" />
              <span>Reset all filters</span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 text-left">
      
      {/* 1. City Filter */}
      <div>
        <label className="caption-1 font-bold text-brand-navy block mb-2">
          City
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => applyFilter({ city })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filters.city === city
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Property Type Filter */}
      <div className="pt-4 border-t border-slate-100">
        <label className="caption-1 font-bold text-brand-navy block mb-2">
          Property type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(intent === 'commercial' ? COMMERCIAL_TYPES : RESIDENTIAL_TYPES).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => applyFilter({ type })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                (filters.type || 'All types') === type
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Budget Range Filter using Shadcn RadioGroup */}
      <div className="pt-4 border-t border-slate-100">
        <label className="caption-1 font-bold text-brand-navy block mb-2">
          {intent === 'rent' ? 'Monthly rent' : 'Budget range'}
        </label>
        <RadioGroup
          value={filters.priceRange || 'all'}
          onValueChange={(val) => applyFilter({ priceRange: val })}
          className="gap-2"
        >
          {(intent === 'rent' ? RENT_BUDGET_RANGES : BUY_BUDGET_RANGES).map((b) => (
            <label
              key={b.id}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
            >
              <RadioGroupItem value={b.id} id={`budget-${b.id}`} />
              <span>{b.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* 3b. Security Deposit Range for Rentals (PRD 5.3) */}
      {intent === 'rent' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Security deposit
          </label>
          <RadioGroup
            value={filters.depositRange || 'all'}
            onValueChange={(val) => applyFilter({ depositRange: val })}
            className="gap-2"
          >
            {RENT_DEPOSIT_RANGES.map((d) => (
              <label
                key={d.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
              >
                <RadioGroupItem value={d.id} id={`deposit-${d.id}`} />
                <span>{d.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* 4. Bedrooms Filter (Residential) */}
      {intent !== 'commercial' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Bedrooms
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BEDROOM_OPTIONS.map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => applyFilter({ bedrooms: bhk })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  (filters.bedrooms || 'Any rooms') === bhk
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Bathrooms Filter */}
      {intent !== 'commercial' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Bathrooms
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BATHROOM_OPTIONS.map((bath) => (
              <button
                key={bath}
                type="button"
                onClick={() => applyFilter({ bathrooms: bath })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  (filters.bathrooms || 'Any baths') === bath
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bath}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Possession Status (Sale only) */}
      {intent === 'buy' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Property status
          </label>
          <RadioGroup
            value={filters.possession || 'All statuses'}
            onValueChange={(val) => applyFilter({ possession: val })}
            className="gap-2"
          >
            {PROPERTY_STATUSES.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
              >
                <RadioGroupItem value={status} id={`status-${status}`} />
                <span>{status}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* 7. Built up Area Filter (Sale only) */}
      {intent === 'buy' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Built up area
          </label>
          <RadioGroup
            value={filters.areaRange || 'all'}
            onValueChange={(val) => applyFilter({ areaRange: val })}
            className="gap-2"
          >
            {AREA_RANGES.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
              >
                <RadioGroupItem value={a.id} id={`area-${a.id}`} />
                <span>{a.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* 8. Furnishing Status Filter using Shadcn RadioGroup */}
      <div className="pt-4 border-t border-slate-100">
        <label className="caption-1 font-bold text-brand-navy block mb-2">
          Furnishing
        </label>
        <RadioGroup
          value={filters.furnishing || 'All furnishing'}
          onValueChange={(val) => applyFilter({ furnishing: val })}
          className="gap-2"
        >
          {FURNISHING_OPTIONS.map((furnish) => (
            <label
              key={furnish}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
            >
              <RadioGroupItem value={furnish} id={`furnish-${furnish}`} />
              <span>{furnish}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Rental Tenant Preferences (PRD 5.3) */}
      {intent === 'rent' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Preferred tenant
          </label>
          <RadioGroup
            value={filters.tenantType || 'All tenants'}
            onValueChange={(val) => applyFilter({ tenantType: val })}
            className="gap-2"
          >
            {TENANT_PREFERENCES.map((tenant) => (
              <label
                key={tenant}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
              >
                <RadioGroupItem value={tenant} id={`tenant-${tenant}`} />
                <span>{tenant}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Rental Available From (PRD 5.3) */}
      {intent === 'rent' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Available from
          </label>
          <RadioGroup
            value={filters.availableFrom || 'any'}
            onValueChange={(val) => applyFilter({ availableFrom: val })}
            className="gap-2"
          >
            {AVAILABILITY_TIMELINES.map((t) => (
              <label
                key={t.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
              >
                <RadioGroupItem value={t.id} id={`avail-${t.id}`} />
                <span>{t.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Rental Lease Duration (PRD 5.3) */}
      {intent === 'rent' && (
        <div className="pt-4 border-t border-slate-100">
          <label className="caption-1 font-bold text-brand-navy block mb-2">
            Lease duration
          </label>
          <RadioGroup
            value={filters.leaseDuration || 'any'}
            onValueChange={(val) => applyFilter({ leaseDuration: val })}
            className="gap-2"
          >
            {LEASE_DURATIONS.map((ld) => (
              <label
                key={ld.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
              >
                <RadioGroupItem value={ld.id} id={`lease-${ld.id}`} />
                <span>{ld.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* 9. Amenities Filter */}
      <div className="pt-4 border-t border-slate-100">
        <label className="caption-1 font-bold text-brand-navy block mb-2">
          Amenities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {AMENITIES_LIST.map((amenity) => {
            const isChecked = (filters.amenities || []).includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isChecked && <Check size={12} weight="bold" className="text-brand-gold" />}
                <span>{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10. Posted Date Filter using Shadcn RadioGroup */}
      <div className="pt-4 border-t border-slate-100">
        <label className="caption-1 font-bold text-brand-navy block mb-2">
          Posted date
        </label>
        <RadioGroup
          value={filters.postedDate || 'any'}
          onValueChange={(val) => applyFilter({ postedDate: val })}
          className="gap-2"
        >
          {POSTED_DATE_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-navy"
            >
              <RadioGroupItem value={opt.id} id={`posted-${opt.id}`} />
              <span>{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* 11. Verification Filter using Shadcn Checkbox (PRD 4.2.12) */}
      <div className="pt-4 border-t border-slate-100">
        <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 text-emerald-950 text-xs font-semibold cursor-pointer">
          <Checkbox
            checked={!!filters.verifiedOnly}
            onCheckedChange={(checked) => applyFilter({ verifiedOnly: !!checked })}
          />
          <ShieldCheck size={18} weight="fill" className="text-emerald-600 shrink-0" />
          <span>Show RERA verified listings only</span>
        </label>
      </div>

      {/* Reset CTA using Shadcn Button */}
      <div className="pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            applyReset();
            setMobileOpen(false);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border-0 shadow-none"
        >
          <ArrowClockwise size={14} weight="bold" />
          <span>Reset all filters</span>
        </Button>
      </div>

    </div>
  );
};

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className={`hidden lg:block w-72 bg-white rounded-3xl p-6 shadow-xs border-0 shrink-0 self-start sticky top-24 ${className}`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-brand-navy">
            <SlidersHorizontal size={18} weight="bold" />
            <span className="heading-4 font-bold">Filters</span>
          </div>
          <Badge variant="neutral" className="text-slate-500 font-semibold text-[11px]">
            {totalResults} results
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-220px)] pr-2">
          <FilterContent />
        </ScrollArea>
      </aside>

      {/* Mobile Trigger Button and Bottom Sheet Drawer */}
      <div className="lg:hidden w-full mb-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-2xl bg-white shadow-xs border-0 text-brand-navy text-xs font-semibold flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} weight="bold" />
                <span>Filter properties</span>
              </div>
              <Badge variant="neutral" className="text-slate-600 text-[11px] font-bold">
                {totalResults} results
              </Badge>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="max-h-[90vh] rounded-t-3xl p-6 bg-white border-0 flex flex-col">
            <SheetHeader className="mb-4 flex flex-row items-center justify-between shrink-0">
              <SheetTitle className="heading-3 text-brand-navy font-bold">
                Filter properties
              </SheetTitle>
              <span className="caption-1 font-semibold text-slate-500">
                {totalResults} matching
              </span>
            </SheetHeader>
            <ScrollArea className="flex-1 pr-3 -mr-3">
              <FilterContent />
            </ScrollArea>
            <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
              <Button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold text-center cursor-pointer transition-colors"
              >
                Apply filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
