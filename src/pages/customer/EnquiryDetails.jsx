import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  ChatCircleText, 
  CalendarCheck, 
  CheckCircle, 
  Clock, 
  EnvelopeSimple, 
  Phone, 
  Flag, 
  ArrowRight,
  ShareNetwork,
  Buildings,
  WarningCircle,
  PaperPlaneRight
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { useToast } from '../../context/ToastContext';
import ReportListingModal from '../../components/dashboard/ReportListingModal';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function EnquiryDetails() {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { toastSuccess, toastInfo } = useToast();
  const { enquiries, updateEnquiryStatus, scheduleVisit, sendMessage, siteVisits } = useCustomerDashboard();

  const [followUpText, setFollowUpText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('2026-11-26');
  const [visitSlot, setVisitSlot] = useState('11:30 AM');
  const [visitType, setVisitType] = useState('In person');

  const enquiry = enquiries.find((e) => e.id === enquiryId) || enquiries[0];

  if (!enquiry) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Enquiry record not found.</p>
        <Link to="/dashboard/enquiries">
          <Button variant="outline" size="sm" className="rounded-xl min-h-10 px-4 ">Back to enquiries</Button>
        </Link>
      </div>
    );
  }

  // Check if related site visit exists
  const relatedVisit = siteVisits.find((v) => v.id === enquiry.relatedVisitId);

  // Controlled status stages per PRD Section 8.5
  const ALL_STAGES = ['Submitted', 'Received', 'In progress', 'Agent replied', 'Visit requested', 'Closed'];

  const handleSendFollowUp = (e) => {
    e.preventDefault();
    if (!followUpText.trim()) return;

    if (enquiry.conversationId) {
      sendMessage(enquiry.conversationId, followUpText.trim());
    }

    updateEnquiryStatus(enquiry.id, 'In progress', `Customer follow up: "${followUpText.trim()}"`);
    setFollowUpText('');
    toastSuccess('Follow up sent', 'Your message was added to this enquiry conversation.');
  };

  const handleCloseEnquiry = () => {
    updateEnquiryStatus(enquiry.id, 'Closed', 'Marked as resolved by customer.');
    toastInfo('Enquiry closed', 'Enquiry marked as resolved.');
  };

  const handleScheduleVisitSubmit = (e) => {
    e.preventDefault();
    const newVisit = scheduleVisit({
      propertyId: enquiry.propertyId,
      propertyTitle: enquiry.propertyTitle,
      propertyLocation: enquiry.propertyLocation,
      propertyImage: enquiry.propertyImage,
      agentName: enquiry.agentName,
      agentPhone: enquiry.agentPhone,
      visitDate,
      timeSlot: visitSlot,
      visitType,
      customerNote: `Scheduled from enquiry ${enquiry.reference}`
    });

    updateEnquiryStatus(enquiry.id, 'Visit requested', `Site visit ${newVisit.bookingRef} requested`);
    setScheduleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. BREADCRUMBS & TOP BAR (PRD Section 8.4)
         ========================================================================= */}
      <DashboardPageHeader
        leading={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="caption-2 font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md">
              {enquiry.reference}
            </span>
            <Badge variant="outline" className="text-caption font-semibold bg-slate-50 text-slate-700">
              {enquiry.status}
            </Badge>
          </div>
        }
        prefix={
          <Link
            to="/dashboard/enquiries"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
            aria-label="Back to enquiries"
          >
            <ArrowLeft size={16} />
          </Link>
        }
        title="Enquiry timeline and status"
        action={
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setReportModalOpen(true)}
              className="rounded-2xl min-h-10 px-4 text-slate-600 hover:text-rose-600"
            >
              <Flag size={14} className="mr-1" />
              <span>Report problem</span>
            </Button>
            {enquiry.status !== 'Closed' && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCloseEnquiry}
                className="rounded-2xl min-h-10 px-4"
              >
                <CheckCircle size={14} className="mr-1 text-emerald-600" />
                <span>Mark as resolved</span>
              </Button>
            )}
            {enquiry.conversationId && (
              <Link to={`/dashboard/messages/${enquiry.conversationId}`}>
                <Button type="button" size="sm" className="rounded-2xl min-h-10 px-4">
                  <ChatCircleText size={16} className="mr-1 text-brand-gold" />
                  <span>Open conversation</span>
                </Button>
              </Link>
            )}
          </>
        }
      />

      {/* =========================================================================
          2. TWO-COLUMN LAYOUT: TIMELINE & DETAILS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Timeline & Messages */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status Timeline Card */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-bold text-brand-navy">Enquiry status history</h2>
              <span className="caption-2 text-slate-400">Updated: {enquiry.lastUpdated}</span>
            </div>

            {/* Visual Timeline */}
            <div className="space-y-5">
              {enquiry.statusHistory.map((item, idx) => {
                const isLast = idx === enquiry.statusHistory.length - 1;

                return (
                  <div key={idx} className="flex items-start gap-4 relative">
                    {idx < enquiry.statusHistory.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200" />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isLast ? 'bg-brand-blue text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <CheckCircle size={16} weight={isLast ? 'bold' : 'fill'} />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-small font-bold text-brand-navy">{item.status}</span>
                        <span className="caption-2 text-slate-400">{item.time}</span>
                      </div>
                      <p className="caption-2 text-slate-600 mt-1">{item.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck size={16} className="text-brand-blue shrink-0 mt-0.5" weight="fill" />
              <span>
                Verified policy: An enquiry status tracks initial contact and verification. Site visits must be booked separately through certified slots.
              </span>
            </div>
          </Card>

          {/* Follow Up Composer Card */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-h4 font-bold text-brand-navy">Add a follow up message</h3>
            <p className="caption-2 text-slate-500">
              Send additional requirements or requests directly to {enquiry.agentName}.
            </p>

            <form onSubmit={handleSendFollowUp} className="space-y-3">
              <textarea
                rows={3}
                required
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder="Ask about floor plans, payment schedules, or visit timing..."
                className="w-full text-small p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-blue resize-none"
              />

              <div className="flex justify-between items-center pt-1">
                <Button size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setScheduleModalOpen(true)}
                  className="rounded-xl min-h-10 px-4 border-slate-200 text-brand-navy cursor-pointer"
                >
                  <CalendarCheck size={14} className="mr-1 text-emerald-600" />
                  <span>Request a site visit</span>
                </Button>

                <Button size="sm"
                  type="submit"
                  className="rounded-xl min-h-10 px-4 bg-brand-navy text-white hover:bg-slate-900 cursor-pointer flex items-center gap-1.5"
                >
                  <PaperPlaneRight size={14} weight="bold" />
                  <span>Send follow up</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Related Site Visit Card if exists */}
          {relatedVisit && (
            <Card className="p-5 rounded-3xl bg-emerald-50/40 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={20} className="text-emerald-700" weight="fill" />
                  <h4 className="text-h4 font-bold text-brand-navy">Related site visit</h4>
                </div>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200 text-xs">
                  {relatedVisit.status}
                </Badge>
              </div>
              <p className="caption-2 text-slate-600">
                Scheduled for <strong className="text-brand-navy font-semibold">{relatedVisit.visitDate}</strong> at {relatedVisit.timeSlot} ({relatedVisit.visitType}). Booking Ref: {relatedVisit.bookingRef}.
              </p>
              <Link to={`/dashboard/site-visits/${relatedVisit.id}`}>
                <Button size="sm" variant="outline" className="rounded-xl min-h-10 px-4 bg-white border-emerald-200 text-emerald-800">
                  <span>Manage visit details</span>
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </Card>
          )}

        </div>

        {/* Right Column (5 cols): Property & Contact Snapshots */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Property Summary Card */}
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="caption-2 font-bold text-slate-400 uppercase tracking-wider">Property snapshot</h3>
            
            <div className="space-y-3">
              <img
                src={enquiry.propertyImage}
                alt={enquiry.propertyTitle}
                className="w-full h-40 rounded-2xl object-cover"
              />
              <div>
                <span className="text-base font-extrabold text-brand-navy">{enquiry.propertyPrice}</span>
                <h4 className="text-h4 font-bold text-brand-navy mt-0.5">{enquiry.propertyTitle}</h4>
                <p className="caption-2 text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  <span>{enquiry.propertyLocation}</span>
                </p>
              </div>

              <Link to={`/properties/${enquiry.propertyId}`}>
                <Button size="sm" variant="outline" className="w-full rounded-2xl min-h-10 px-4 font-semibold border-slate-200 text-brand-navy mt-2">
                  <span>View full listing details</span>
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Assigned Advisor Card */}
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
            <h3 className="caption-2 font-bold text-slate-400 uppercase tracking-wider">Assigned advisor</h3>

            <div className="flex items-center gap-3">
              <img
                src={enquiry.agentAvatar}
                alt={enquiry.agentName}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <p className="text-small font-bold text-brand-navy truncate">{enquiry.agentName}</p>
                <p className="caption-2 text-slate-500 truncate">{enquiry.agency}</p>
                <span className="inline-flex items-center gap-1 text-caption text-emerald-600 font-semibold mt-0.5">
                  <ShieldCheck size={12} weight="fill" />
                  <span>Verified RERA advisor</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                <span>{enquiry.agentPhone}</span>
              </div>
            </div>
          </Card>

          {/* Original Enquiry Submission */}
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
            <h3 className="caption-2 font-bold text-slate-400 uppercase tracking-wider">Your original enquiry</h3>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
              "{enquiry.originalMessage}"
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-slate-500">
              <div className="flex justify-between">
                <span>Submitted by:</span>
                <span className="font-semibold text-brand-navy">{enquiry.contactUsed.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Preferred channel:</span>
                <span className="font-semibold text-brand-navy">{enquiry.contactUsed.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold text-brand-navy">{enquiry.submittedDate}</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

      {/* Schedule Visit Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-h4 font-bold text-brand-navy">Schedule site visit</h3>
            <p className="caption-2 text-slate-500">
              Select your preferred day and slot for {enquiry.propertyTitle}.
            </p>

            <form onSubmit={handleScheduleVisitSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Time slot</label>
                <select
                  value={visitSlot}
                  onChange={(e) => setVisitSlot(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Midday)</option>
                  <option value="03:00 PM">03:00 PM (Afternoon)</option>
                  <option value="05:00 PM">05:00 PM (Evening)</option>
                </select>
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Visit mode</label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="In person">In person private walkthrough</option>
                  <option value="Virtual">Virtual live video tour</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setScheduleModalOpen(false)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  Confirm request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportListingModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          property={{
            title: enquiry.propertyTitle,
            location: enquiry.propertyLocation,
            images: [enquiry.propertyImage]
          }}
        />
      )}

    </div>
  );
}
