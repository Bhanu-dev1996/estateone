import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scales, 
  X, 
  CalendarCheck, 
  ChatCircleText, 
  ShieldCheck, 
  Trash, 
  Check, 
  Bed, 
  Bathtub, 
  ArrowsOut 
} from '@phosphor-icons/react';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { useProperty } from '../context/PropertyContext';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import EmptyState from '../components/shared/EmptyState';

export default function ComparePage() {
  const { 
    comparePropertyIds, 
    removeCompare, 
    clearCompare, 
    openConfirm, 
    openSiteVisit, 
    openEnquiry 
  } = useProperty();

  const comparedProperties = SAMPLE_PROPERTIES.filter((p) =>
    comparePropertyIds.includes(p.id)
  );

  const handleClear = () => {
    openConfirm({
      title: 'Clear comparison list?',
      message: 'This will remove all shortlisted properties from the comparison table.',
      confirmText: 'Clear comparison',
      isDestructive: true,
      onConfirm: clearCompare
    });
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <Breadcrumbs items={[{ label: 'Compare properties' }]} className="mb-4" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-3">
            <Scales size={15} weight="fill" />
            <span>Decision support</span>
          </span>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Compare verified residences
          </h1>
          <p className="body-4 text-slate-500 mt-2 max-w-2xl">
            Side by side architectural specifications, RERA registrations, and pricing breakdowns for up to 4 shortlisted homes.
          </p>
        </div>

        {comparedProperties.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-auto py-2.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold border-0 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash size={15} />
            <span>Clear comparison table</span>
          </button>
        )}
      </div>

      {/* Comparison Matrix */}
      {comparedProperties.length > 0 ? (
        <div className="overflow-x-auto rounded-3xl bg-white p-6 shadow-xs border-0">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-4 w-48 text-xs font-bold text-slate-400 uppercase tracking-wider align-top">
                  Property preview
                </th>
                {comparedProperties.map((p) => (
                  <th key={p.id} className="p-4 w-64 align-top">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-50 p-3">
                      <button
                        type="button"
                        onClick={() => removeCompare(p.id)}
                        aria-label={`Remove ${p.title} from comparison`}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                      >
                        <X size={12} weight="bold" />
                      </button>

                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-36 object-cover rounded-xl mb-3"
                      />

                      <h3 className="heading-4 text-brand-navy font-bold line-clamp-1 mb-1">
                        <Link to={`/property/${p.slug}`} className="hover:text-brand-blue transition-colors">
                          {p.title}
                        </Link>
                      </h3>
                      <p className="caption-2 text-slate-500 line-clamp-1 mb-3">{p.location}</p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openSiteVisit(p)}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <CalendarCheck size={13} weight="bold" />
                          <span>Visit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEnquiry(p)}
                          className="py-1.5 px-2.5 rounded-xl bg-[#C5A46D] hover:bg-[#b0915d] text-brand-navy text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ChatCircleText size={13} weight="bold" />
                          <span>Enquire</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Listed Price Row */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Price</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-brand-navy text-sm">
                    {p.priceDisplay}
                    {p.intent === 'rent' && <span className="text-xs text-slate-500 font-normal"> / mo</span>}
                  </td>
                ))}
              </tr>

              {/* Rate per Sq Ft */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Rate per sq ft</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    {p.pricePerSqFt || 'Market pricing'}
                  </td>
                ))}
              </tr>

              {/* Carpet Area */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Carpet area</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700 font-medium">
                    {p.area}
                  </td>
                ))}
              </tr>

              {/* Bedrooms & Bathrooms */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Bedrooms and baths</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    {p.bedrooms || 'Commercial space'} • {p.bathrooms || 'Standard baths'}
                  </td>
                ))}
              </tr>

              {/* Possession Status */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Possession status</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-brand-navy">
                      {p.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* RERA Registration */}
              <tr>
                <td className="p-4 font-bold text-slate-500">RERA verification</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-mono font-medium text-emerald-700">
                    {p.reraId ? `RERA: ${p.reraId}` : 'Exempted category'}
                  </td>
                ))}
              </tr>

              {/* Key Amenities */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Key amenities</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    <ul className="space-y-1 text-slate-600">
                      {(p.amenities || []).slice(0, 4).map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check size={12} weight="bold" className="text-[#C5A46D] shrink-0" />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Assigned Advisor */}
              <tr>
                <td className="p-4 font-bold text-slate-500">Assigned advisor</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    <p className="font-semibold text-brand-navy">{p.agent?.name || 'Verified Advisor'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.agent?.phone || '+91 22 6120 4400'}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Scales}
          title="No properties in comparison table"
          description="You haven't added any residences to compare. Tap the balance scale icon on any property card to compare up to 4 homes side by side."
          actionLabel="Browse verified homes"
          onAction={() => {
            window.location.href = '/buy';
          }}
        />
      )}
    </div>
  );
}
