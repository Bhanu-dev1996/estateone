import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  VideoCamera, 
  Buildings, 
  Phone, 
  ArrowRight, 
  ArrowsClockwise, 
  XCircle, 
  ShieldCheck, 
  CalendarPlus, 
  ChatCircleText,
  CheckCircle,
  Eye
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function SiteVisits() {
  const { siteVisits, rescheduleVisit, cancelVisit } = useCustomerDashboard();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Upcoming');

  // Reschedule modal state
  const [rescheduleVisitTarget, setRescheduleVisitTarget] = useState(null);
  const [newDate, setNewDate] = useState('2026-11-28');
  const [newSlot, setNewSlot] = useState('11:30 AM');
  const [rescheduleNote, setRescheduleNote] = useState('');

  // Cancel modal state
  const [cancelVisitTarget, setCancelVisitTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');

  const TABS = ['Upcoming', 'Pending confirmation', 'Completed', 'Cancelled'];

  const filteredVisits = siteVisits.filter((v) => {
    if (activeTab === 'Upcoming') return v.status === 'Upcoming';
    if (activeTab === 'Pending confirmation') return v.status === 'Pending confirmation';
    if (activeTab === 'Completed') return v.status === 'Completed';
    if (activeTab === 'Cancelled') return v.status === 'Cancelled';
    return true;
  });

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleVisitTarget) return;
    rescheduleVisit(rescheduleVisitTarget.id, newDate, newSlot, rescheduleNote);
    setRescheduleVisitTarget(null);
    setRescheduleNote('');
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    if (!cancelVisitTarget) return;
    cancelVisit(cancelVisitTarget.id, cancelReason);
    setCancelVisitTarget(null);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 9.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Property site visits"
        description="Track confirmed in person walkthroughs, virtual video tours, and reschedule appointments."
        action={
          <Button type="button" size="sm" onClick={() => navigate('/dashboard/discover')} className="rounded-2xl min-h-10 px-4">
            Explore properties
          </Button>
        }
      />

      {/* =========================================================================
          2. FILTER TABS (PRD Section 9.2)
         ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/60 scrollbar-none">
        {TABS.map((tab) => {
          const count = siteVisits.filter((v) => v.status === tab).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-2xl min-h-10 px-4 button-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-caption px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. VISITS LIST (PRD Section 9.3 & 9.4)
         ========================================================================= */}
      {filteredVisits.length > 0 ? (
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <Card key={visit.id} className="p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group">
              
              {/* Left: Thumbnail & Details */}
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={visit.propertyImage}
                  alt={visit.propertyTitle}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="caption-2 font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
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

                    <span className="inline-flex items-center gap-1 text-small font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      {visit.visitType === 'Virtual' ? <VideoCamera size={14} className="text-brand-blue" /> : <Buildings size={14} className="text-slate-500" />}
                      <span>{visit.visitType}</span>
                    </span>
                  </div>

                  <h3 className="text-h4 font-bold text-brand-navy mt-1 truncate hover:text-brand-blue">
                    <Link to={`/dashboard/site-visits/${visit.id}`}>{visit.propertyTitle}</Link>
                  </h3>

                  <p className="caption-2 text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span>{visit.propertyLocation}</span>
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-700 flex-wrap">
                    <span className="font-semibold text-brand-navy flex items-center gap-1">
                      <Clock size={14} className="text-brand-blue" />
                      <span>{visit.visitDate} at {visit.timeSlot}</span>
                    </span>
                    <span>•</span>
                    <span className="caption-2 text-slate-500">Advisor: {visit.agentName}</span>
                  </div>

                  {visit.customerNote && (
                    <p className="caption-2 text-slate-500 mt-1.5 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                      Note: "{visit.customerNote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end flex-wrap">
                {(visit.status === 'Upcoming' || visit.status === 'Pending confirmation') && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRescheduleVisitTarget(visit)}
                      className="rounded-xl min-h-10 px-4 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer h-9"
                    >
                      <ArrowsClockwise size={14} className="mr-1 text-brand-blue" />
                      <span>Reschedule</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCancelVisitTarget(visit)}
                      className="rounded-xl min-h-10 px-4 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer h-9"
                    >
                      <XCircle size={14} className="mr-1" />
                      <span>Cancel</span>
                    </Button>
                  </>
                )}

                <Link to={`/dashboard/site-visits/${visit.id}`}>
                  <Button
                    size="sm"
                    className="rounded-xl min-h-10 px-4 bg-brand-navy text-white hover:bg-slate-900 cursor-pointer h-9"
                  >
                    <span>View details</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>

            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 rounded-3xl bg-white border border-slate-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <CalendarCheck size={24} />
          </div>
          <h3 className="text-h4 font-bold text-brand-navy">No {activeTab.toLowerCase()} site visits</h3>
          <p className="caption-2 text-slate-500 max-w-sm mx-auto">
            Explore listings across your preferred city to schedule in person walkthroughs or 3D live tours.
          </p>
          <Button size="sm"
            onClick={() => navigate('/dashboard/discover')}
            className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white cursor-pointer mt-2"
          >
            Discover properties
          </Button>
        </Card>
      )}

      {/* =========================================================================
          4. RESCHEDULE MODAL (PRD Section 9.6)
         ========================================================================= */}
      {rescheduleVisitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <ArrowsClockwise size={20} className="text-brand-blue" />
                <h3 className="text-h4">Reschedule site visit</h3>
              </div>
              <button onClick={() => setRescheduleVisitTarget(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>

            <p className="caption-2 text-slate-500">
              Booking Ref: <span className="font-mono font-bold text-brand-navy">{rescheduleVisitTarget.bookingRef}</span> • {rescheduleVisitTarget.propertyTitle}
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
                <label className="caption-2 font-bold text-slate-700 block mb-1">New available time slot</label>
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
                <label className="caption-2 font-bold text-slate-700 block mb-1">Reason or note for advisor (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flight delay, prefer morning walkthrough..."
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-small text-amber-800">
                Reschedule policy: Requested slots require security pass clearance from the resident community desk.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setRescheduleVisitTarget(null)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Back
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  Confirm reschedule
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* =========================================================================
          5. CANCELLATION MODAL (PRD Section 9.7)
         ========================================================================= */}
      {cancelVisitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <XCircle size={20} weight="fill" />
                <h3 className="text-h4 text-brand-navy">Cancel site visit</h3>
              </div>
              <button onClick={() => setCancelVisitTarget(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>

            <p className="caption-2 text-slate-500">
              Are you sure you want to cancel visit <span className="font-mono font-bold text-brand-navy">{cancelVisitTarget.bookingRef}</span> for {cancelVisitTarget.propertyTitle}?
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Cancellation reason</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Schedule conflict">Personal schedule conflict</option>
                  <option value="Shortlisted another property">Shortlisted another property</option>
                  <option value="Price out of range">Price or commercial terms out of range</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-small text-slate-600">
                Cancellation policy: You may cancel up to 2 hours before the scheduled appointment without restriction. The visit record will remain preserved in your visit history.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setCancelVisitTarget(null)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Keep appointment
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
