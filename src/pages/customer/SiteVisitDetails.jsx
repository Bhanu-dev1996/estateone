import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CalendarCheck, 
  VideoCamera, 
  Buildings, 
  Phone, 
  ChatCircleText, 
  ArrowsClockwise, 
  XCircle, 
  ArrowRight,
  CheckCircle,
  WarningCircle,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function SiteVisitDetails() {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const { siteVisits, rescheduleVisit, cancelVisit } = useCustomerDashboard();

  const visit = siteVisits.find((v) => v.id === visitId) || siteVisits[0];

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('2026-11-28');
  const [newSlot, setNewSlot] = useState('11:30 AM');
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [cancelReason, setCancelReason] = useState('Personal schedule conflict');

  if (!visit) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Visit record not found.</p>
        <Link to="/dashboard/site-visits">
          <Button variant="outline" size="sm" className="rounded-xl min-h-10 px-4 ">Back to visits</Button>
        </Link>
      </div>
    );
  }

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    rescheduleVisit(visit.id, newDate, newSlot, rescheduleNote);
    setRescheduleModalOpen(false);
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    cancelVisit(visit.id, cancelReason);
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER & ACTIONS (PRD Section 9.5)
         ========================================================================= */}
      <DashboardPageHeader
        leading={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="caption-2 font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {visit.bookingRef}
            </span>
            <Badge
              variant="outline"
              className={`text-caption font-semibold py-0.5 ${
                visit.status === 'Upcoming'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : visit.status === 'Pending confirmation'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : visit.status === 'Completed'
                  ? 'bg-blue-50 text-brand-blue border-blue-200'
                  : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}
            >
              {visit.status === 'Upcoming' ? 'Confirmed appointment' : visit.status}
            </Badge>
          </div>
        }
        prefix={
          <Link
            to="/dashboard/site-visits"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
            aria-label="Back to site visits"
          >
            <ArrowLeft size={16} />
          </Link>
        }
        title="Site visit inspection details"
        action={
          <>
            {(visit.status === 'Upcoming' || visit.status === 'Pending confirmation') && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setRescheduleModalOpen(true)}
                  className="rounded-2xl min-h-10 px-4"
                >
                  <ArrowsClockwise size={14} className="mr-1 text-brand-blue" />
                  <span>Reschedule</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setCancelModalOpen(true)}
                  className="rounded-2xl min-h-10 px-4 text-rose-600 hover:bg-rose-50"
                >
                  <XCircle size={14} className="mr-1" />
                  <span>Cancel visit</span>
                </Button>
              </>
            )}
            <Link to={`/properties/${visit.propertyId}`}>
              <Button type="button" size="sm" className="rounded-2xl min-h-10 px-4">
                <span>View property</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </>
        }
      />

      {/* =========================================================================
          2. TWO-COLUMN LAYOUT: TIMELINE & DETAILS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Timeline & Meeting Instructions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Appointment Spotlight Card */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-bold text-brand-navy">Appointment time and mode</h2>
              <span className="caption-2 font-mono text-slate-400">{visit.bookingRef}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                <span className="caption-2 font-bold text-slate-500 uppercase tracking-wider">Scheduled date</span>
                <p className="text-base font-extrabold text-brand-navy flex items-center gap-1.5">
                  <Clock size={16} className="text-brand-blue" />
                  <span>{visit.visitDate}</span>
                </p>
                <p className="caption-2 text-slate-500">Slot: {visit.timeSlot}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="caption-2 font-bold text-slate-500 uppercase tracking-wider">Inspection mode</span>
                <p className="text-base font-extrabold text-brand-navy flex items-center gap-1.5">
                  {visit.visitType === 'Virtual' ? <VideoCamera size={16} className="text-brand-blue" /> : <Buildings size={16} className="text-emerald-600" />}
                  <span>{visit.visitType}</span>
                </p>
                <p className="caption-2 text-slate-500">
                  {visit.visitType === 'Virtual' ? '3D live walkthrough stream' : 'Private on site inspection'}
                </p>
              </div>
            </div>

            {/* Meeting Instructions */}
            <div className="space-y-2">
              <h3 className="caption-2 font-bold text-slate-500 uppercase tracking-wider">Meeting and gate instructions</h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {visit.meetingInstructions}
              </div>
            </div>

            {/* Virtual Meeting link if virtual */}
            {visit.virtualLink && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-small font-bold text-brand-navy">Virtual walkthrough link</h4>
                  <p className="caption-2 text-slate-500">Join online session directly with your advisor</p>
                </div>
                <a 
                  href={visit.virtualLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl min-h-9 px-3 button-sm font-semibold text-small bg-brand-navy text-white hover:bg-slate-900 cursor-pointer"
                >
                  <span>Launch tour</span>
                  <ArrowSquareOut size={14} />
                </a>
              </div>
            )}
          </Card>

          {/* Status Timeline Card */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-5">
            <h3 className="text-h4 font-bold text-brand-navy">Visit verification timeline</h3>

            <div className="space-y-4">
              {visit.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  {idx < visit.timeline.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                    <CheckCircle size={16} weight="fill" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-small font-bold text-brand-navy">{item.status}</span>
                      <span className="caption-2 text-slate-400">{item.time}</span>
                    </div>
                    {item.note && (
                      <p className="caption-2 text-slate-600 mt-1">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reschedule & Cancellation Policy Card */}
          <Card className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-brand-navy font-bold">
              <ShieldCheck size={16} className="text-brand-blue" weight="fill" />
              <span>EstateOne visitor protocol</span>
            </div>
            <p className="caption-2 text-slate-500 leading-relaxed">
              Appointments can be rescheduled or cancelled with zero fee up to 2 hours prior to arrival. Our advisors coordinate building reception clearance and visitor passes on your behalf.
            </p>
          </Card>

        </div>

        {/* Right Column (5 cols): Property & Advisor */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Property Card */}
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="caption-2 font-bold text-slate-400 uppercase tracking-wider">Property details</h3>

            <div className="space-y-3">
              <img
                src={visit.propertyImage}
                alt={visit.propertyTitle}
                className="w-full h-44 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-h4 font-bold text-brand-navy">{visit.propertyTitle}</h4>
                <p className="caption-2 text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span>{visit.propertyLocation}</span>
                </p>
              </div>

              <Link to={`/properties/${visit.propertyId}`}>
                <Button size="sm" variant="outline" className="w-full rounded-2xl min-h-10 px-4 font-semibold border-slate-200 text-brand-navy">
                  <span>Open property listing</span>
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Advisor Card */}
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="caption-2 font-bold text-slate-400 uppercase tracking-wider">Walkthrough advisor</h3>

            <div className="flex items-center gap-3">
              <img
                src={visit.agentAvatar}
                alt={visit.agentName}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <p className="text-small font-bold text-brand-navy truncate">{visit.agentName}</p>
                <p className="caption-2 text-slate-500 truncate">Certified EstateOne Representative</p>
                <div className="flex items-center gap-1 text-caption text-emerald-600 font-semibold mt-0.5">
                  <ShieldCheck size={12} weight="fill" />
                  <span>Identity verified</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                <span>{visit.agentPhone}</span>
              </div>
            </div>

            <Link to="/dashboard/messages">
              <Button size="sm" variant="outline" className="w-full rounded-2xl min-h-10 px-4 font-semibold border-slate-200 text-brand-navy">
                <ChatCircleText size={16} className="mr-1.5 text-brand-blue" />
                <span>Message advisor</span>
              </Button>
            </Link>
          </Card>

        </div>

      </div>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-h4 font-bold text-brand-navy">Reschedule site visit</h3>
            <p className="caption-2 text-slate-500">
              Booking Ref: {visit.bookingRef} • {visit.propertyTitle}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">New preferred date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Available time slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Midday)</option>
                  <option value="03:00 PM">03:00 PM (Afternoon)</option>
                  <option value="05:00 PM">05:00 PM (Evening)</option>
                </select>
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Customer note (optional)</label>
                <textarea
                  rows={2}
                  placeholder="State any schedule preference..."
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setRescheduleModalOpen(false)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  Confirm reschedule
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-h4 font-bold text-brand-navy">Confirm cancellation</h3>
            <p className="caption-2 text-slate-500">
              Are you sure you want to cancel visit {visit.bookingRef}?
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Schedule conflict">Personal schedule conflict</option>
                  <option value="Found another property">Found another property</option>
                  <option value="Price out of range">Price or commercial terms out of range</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setCancelModalOpen(false)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Keep visit
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white">
                  Confirm cancellation
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
