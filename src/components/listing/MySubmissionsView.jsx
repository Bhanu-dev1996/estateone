import React, { useState } from 'react';
import { 
  Buildings, 
  MapPin, 
  CalendarCheck, 
  Eye, 
  ShieldCheck, 
  PlusCircle, 
  FileText,
  Clock,
  ArrowRight,
  WarningCircle,
  XCircle,
  CheckCircle,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { getStatusBadge } from './ListingStatusTracker';

// Sample demonstration submissions illustrating all moderation decision states (PRD 6.4)
const DEMO_SUBMISSIONS = [
  {
    referenceId: 'EST-LST-892104',
    title: 'The Solitaire Penthouse, Worli',
    purpose: 'sell',
    propertyType: 'Penthouse',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    fullAddress: 'Tower B, 34th Floor, Worli Sea Face, Mumbai 400018',
    expectedPrice: '₹18.50 Cr',
    carpetArea: '4,850',
    status: 'Changes required',
    moderationNotes: 'Title search clearance missing society NOC copy. Please upload the latest building cooperative society NOC and sanctioned terrace layout plan.',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    submitterName: 'Rajesh Kumar',
    submitterRole: 'Owner',
    submitterPhone: '+91 98450 33445',
    submitterEmail: 'owner@estateone.in',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80']
  },
  {
    referenceId: 'EST-LST-743912',
    title: 'Boulevard Executive Suites, Whitefield',
    purpose: 'rent',
    propertyType: 'Apartment',
    city: 'Bengaluru',
    locality: 'Whitefield',
    fullAddress: 'E-Block, 14th Floor, ITPL Main Road, Whitefield, Bengaluru 560066',
    monthlyRent: '₹1.80 Lac',
    securityDeposit: '₹9.00 Lac',
    carpetArea: '2,600',
    status: 'Published',
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    submitterName: 'Vikram Malhotra',
    submitterRole: 'Licensed Agent',
    submitterPhone: '+91 98110 55667',
    submitterEmail: 'agent@estateone.in',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80']
  },
  {
    referenceId: 'EST-LST-610283',
    title: 'Aura Heights 4 BHK Luxury Residence',
    purpose: 'sell',
    propertyType: 'Apartment',
    city: 'Delhi NCR',
    locality: 'Golf Course Extension, Gurugram',
    fullAddress: 'Tower 3, Unit 1802, Sector 65, Gurugram 122018',
    expectedPrice: '₹7.25 Cr',
    carpetArea: '3,200',
    status: 'Rejected',
    rejectionReason: 'Discrepancy detected in RERA registration certificate. The uploaded municipal occupancy certificate belongs to Phase 1, whereas this unit is situated in uncertified Phase 2.',
    submittedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    submitterName: 'Kunal Singhania',
    submitterRole: 'Owner',
    submitterPhone: '+91 98100 22334',
    submitterEmail: 'kunal@example.com',
    images: ['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80']
  }
];

export default function MySubmissionsView({ 
  submissions = [], 
  onNewListing,
  onEditSubmission 
}) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Combine real user submissions with demonstration submissions if user has few
  const displaySubmissions = submissions.length > 0 ? submissions : DEMO_SUBMISSIONS;

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="heading-3 text-brand-navy font-bold tracking-tight">
            My property submissions
          </h2>
          <p className="caption-2 text-slate-500">
            Track moderation progress, compliance checkpoints, and administrative decisions.
          </p>
        </div>
        <Button
          type="button"
          onClick={onNewListing}
          className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <PlusCircle size={15} weight="bold" />
          <span>Submit another property</span>
        </Button>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySubmissions.map((sub) => {
          const coverImg = sub.images?.[sub.coverImageIndex || 0] || sub.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';
          const formattedDate = new Date(sub.submittedAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          const isChangesRequired = sub.status === 'Changes required';
          const isRejected = sub.status === 'Rejected';
          const isPublished = sub.status === 'Published';

          return (
            <article
              key={sub.referenceId}
              className={`group bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isChangesRequired ? 'border-orange-200 ring-1 ring-orange-100' :
                isRejected ? 'border-rose-200' : 'border-transparent'
              }`}
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={coverImg}
                    alt={sub.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(sub.status || 'Pending verification')}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-brand-navy/90 text-white font-mono text-[10px] font-bold">
                    {sub.referenceId}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-brand-blue uppercase tracking-wider text-[10px]">
                      {sub.purpose} • {sub.propertyType}
                    </span>
                    <span>Submitted {formattedDate}</span>
                  </div>

                  <h3 className="title-2 font-bold text-brand-navy line-clamp-1">
                    {sub.title || 'Untitled luxury property'}
                  </h3>

                  <p className="caption-2 text-slate-500 flex items-center gap-1">
                    <MapPin size={13} className="text-[#C5A46D] shrink-0" />
                    <span className="truncate">{sub.locality ? `${sub.locality}, ` : ''}{sub.city}</span>
                  </p>

                  <div className="py-2 border-y border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Declared price:</span>
                    <span className="font-bold text-brand-navy">
                      {sub.expectedPrice || sub.monthlyRent || 'Price on evaluation'}
                    </span>
                  </div>

                  {/* Flowchart Decision: Changes Required Notice */}
                  {isChangesRequired && (
                    <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/80 text-[11px] text-orange-900 leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-orange-800">
                        <WarningCircle size={14} weight="fill" />
                        <span>Action required by submitter</span>
                      </div>
                      <p className="line-clamp-2">{sub.moderationNotes || 'Please update property details as requested by the moderation team.'}</p>
                    </div>
                  )}

                  {/* Flowchart Decision: Rejection Notice */}
                  {isRejected && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-[11px] text-rose-900 leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-800">
                        <XCircle size={14} weight="fill" />
                        <span>Not approved for publication</span>
                      </div>
                      <p className="line-clamp-2">{sub.rejectionReason || 'Title verification could not be validated against state land registry.'}</p>
                    </div>
                  )}

                  {/* Flowchart Decision: Published State */}
                  {isPublished && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                      <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                      <span>Live and actively discoverable on marketplace</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-2 border-t border-slate-100 mt-4">
                {isChangesRequired ? (
                  /* PRD 6.4 Owner Journey: Changes Required -> Update Listing */
                  <Button
                    type="button"
                    onClick={() => onEditSubmission?.(sub)}
                    className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PencilSimple size={14} weight="bold" />
                    <span>Update listing</span>
                  </Button>
                ) : (
                  <>
                    <span className="caption-3 text-slate-400">
                      Moderation: 24 to 48 hours
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedSubmission(sub)}
                      className="rounded-xl text-xs font-semibold border-slate-200 text-brand-navy hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>View details</span>
                    </Button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 bg-white rounded-3xl border-0 shadow-2xl text-left">
            <DialogHeader className="mb-4">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-brand-navy">
                  {selectedSubmission.referenceId}
                </div>
                {getStatusBadge(selectedSubmission.status || 'Pending verification')}
              </div>
              <DialogTitle className="heading-3 text-brand-navy font-bold">
                {selectedSubmission.title}
              </DialogTitle>
              <DialogDescription className="caption-2 text-slate-500">
                Submitted on {new Date(selectedSubmission.submittedAt || Date.now()).toLocaleString('en-IN')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 text-xs">
              
              {/* Rejection / Changes Required Banner inside Modal */}
              {selectedSubmission.status === 'Changes required' && (
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-orange-900">
                    <WarningCircle size={16} weight="fill" />
                    <span>Moderation feedback (Action required)</span>
                  </div>
                  <p className="leading-relaxed text-orange-900">
                    {selectedSubmission.moderationNotes}
                  </p>
                </div>
              )}

              {selectedSubmission.status === 'Rejected' && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <XCircle size={16} weight="fill" />
                    <span>Rejection reason</span>
                  </div>
                  <p className="leading-relaxed text-rose-900">
                    {selectedSubmission.rejectionReason}
                  </p>
                </div>
              )}

              {/* Overview Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 block mb-0.5">Purpose</span>
                  <span className="font-bold text-brand-navy capitalize">{selectedSubmission.purpose}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 block mb-0.5">Type</span>
                  <span className="font-bold text-brand-navy">{selectedSubmission.propertyType}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 block mb-0.5">Area</span>
                  <span className="font-bold text-brand-navy">{selectedSubmission.carpetArea || selectedSubmission.builtUpArea || '2,400'} sq ft</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 block mb-0.5">City</span>
                  <span className="font-bold text-brand-navy">{selectedSubmission.city}</span>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                <span className="font-semibold text-brand-navy block">Full address</span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedSubmission.fullAddress || selectedSubmission.locality}, {selectedSubmission.city}, {selectedSubmission.state || 'India'}
                </p>
              </div>

              {/* Submitter details */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                <span className="font-semibold text-brand-navy block">Submitter information</span>
                <p className="text-slate-600">
                  {selectedSubmission.submitterName} ({selectedSubmission.submitterRole}) • {selectedSubmission.submitterPhone} • {selectedSubmission.submitterEmail}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                {selectedSubmission.status === 'Changes required' && (
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedSubmission(null);
                      onEditSubmission?.(selectedSubmission);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Update listing now
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-5 py-2.5 rounded-xl border-slate-200 text-brand-navy text-xs font-semibold cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
