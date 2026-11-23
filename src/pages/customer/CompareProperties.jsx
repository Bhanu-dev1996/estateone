import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scales, 
  Trash, 
  Heart, 
  CalendarPlus, 
  ChatCircleText, 
  ArrowRight, 
  Check, 
  X, 
  ShieldCheck, 
  MapPin, 
  Buildings,
  Plus
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useProperty } from '../../context/PropertyContext';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function CompareProperties() {
  const { comparePropertyIds, removeCompare, clearCompare, toggleSave, isSaved } = useProperty();
  const navigate = useNavigate();

  // Matched properties
  const comparedList = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => comparePropertyIds.includes(p.id));
  }, [comparePropertyIds]);

  const COMPARISON_ROWS = [
    { label: 'Price and value', key: 'priceDisplay' },
    { label: 'Location and locality', key: 'location' },
    { label: 'Property type', key: 'type' },
    { label: 'Bedrooms (BHK)', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Super built area', key: 'area' },
    { label: 'Furnishing status', key: 'furnishing' },
    { label: 'RERA verification ID', key: 'reraId' },
    { label: 'Possession status', key: 'status' }
  ];

  const COMMON_AMENITIES = [
    'Private pool',
    'Sea view',
    'Concierge',
    'High speed lift',
    'EV charger',
    'Parking',
    'Gym',
    '24x7 Security'
  ];

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 11.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Compare properties side by side"
        description="Evaluate specifications, pricing, RERA clearance, and amenities across your shortlisted properties (up to 4)."
        action={
          <>
            {comparedList.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={clearCompare}
                className="rounded-2xl min-h-10 px-4 text-rose-600 hover:bg-rose-50"
              >
                <Trash size={14} className="mr-1" />
                <span>Clear comparison</span>
              </Button>
            )}
            <Button type="button" size="sm" onClick={() => navigate('/dashboard/discover')} className="rounded-2xl min-h-10 px-4">
              <Plus size={14} className="mr-1" />
              <span>Add property</span>
            </Button>
          </>
        }
      />

      {/* =========================================================================
          2. COMPARISON MATRIX (PRD Section 11.3 & 11.4)
         ========================================================================= */}
      {comparedList.length > 0 ? (
        <Card className="rounded-3xl bg-white border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Header row: Property cards */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-4 sm:p-5 w-48 type-table-header text-slate-400 align-bottom">
                    Specifications
                  </th>
                  {comparedList.map((prop) => (
                    <th key={prop.id} className="p-4 sm:p-5 w-64 align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-100">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeCompare(prop.id)}
                            title="Remove from comparison"
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-600 hover:bg-white transition-all shadow-xs cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div>
                          <span className="text-base font-extrabold text-brand-navy">{prop.priceDisplay}</span>
                          <h4 className="text-h4 font-bold text-brand-navy mt-0.5 line-clamp-1">{prop.title}</h4>
                          <p className="caption-2 text-slate-500 line-clamp-1">{prop.location}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSave(prop)}
                            className={`rounded-xl text-small h-7 border-slate-200 ${
                              isSaved(prop.id) ? 'text-rose-500 bg-rose-50' : 'text-slate-700'
                            }`}
                          >
                            <Heart size={12} weight={isSaved(prop.id) ? 'fill' : 'regular'} className="mr-1" />
                            <span>{isSaved(prop.id) ? 'Saved' : 'Save'}</span>
                          </Button>

                          <Link to={`/property/${prop.slug}`}>
                            <Button
                              size="sm"
                              className="w-full rounded-xl text-small h-7 bg-brand-navy text-white"
                            >
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* Empty slots if less than 4 */}
                  {Array.from({ length: 4 - comparedList.length }).map((_, idx) => (
                    <th key={idx} className="p-4 sm:p-5 w-64 align-middle text-center bg-slate-50/20">
                      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center space-y-2">
                        <Scales size={24} className="text-slate-300 mx-auto" />
                        <p className="caption-2 font-bold text-slate-400">Empty comparison slot</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate('/dashboard/discover')}
                          className="text-xs text-brand-blue hover:underline cursor-pointer"
                        >
                          Select listing
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Data rows */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">
                      {row.label}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 text-brand-navy font-medium">
                        {prop[row.key] || 'N/A'}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedList.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-slate-300 text-center">-</td>
                    ))}
                  </tr>
                ))}

                {/* Amenities section heading */}
                <tr className="bg-slate-100/60 font-bold text-brand-navy">
                  <td colSpan={5} className="p-3 px-4 type-table-header text-slate-600">
                    Amenities and features checklist
                  </td>
                </tr>

                {COMMON_AMENITIES.map((amenity) => (
                  <tr key={amenity} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 px-4 font-semibold text-slate-500">
                      {amenity}
                    </td>
                    {comparedList.map((prop) => {
                      const hasAmenity = prop.amenities && prop.amenities.includes(amenity);
                      return (
                        <td key={prop.id} className="p-3.5 px-4">
                          {hasAmenity ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check size={14} weight="bold" />
                              <span>Included</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">Not listed</span>
                          )}
                        </td>
                      );
                    })}
                    {Array.from({ length: 4 - comparedList.length }).map((_, idx) => (
                      <td key={idx} className="p-3.5 px-4 text-slate-300 text-center">-</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Empty State (PRD Section 11.5) */
        <Card className="p-12 rounded-3xl bg-white border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mx-auto">
            <Scales size={32} />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-brand-navy">Start comparing properties</h3>
            <p className="caption-2 text-slate-500 max-w-md mx-auto mt-1">
              Select "Compare" on any property card to view technical configurations, square footage, price breakdowns, and amenities side by side.
            </p>
          </div>
          <Button size="sm"
            onClick={() => navigate('/dashboard/discover')}
            className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white cursor-pointer"
          >
            Discover properties
          </Button>
        </Card>
      )}

    </div>
  );
}
