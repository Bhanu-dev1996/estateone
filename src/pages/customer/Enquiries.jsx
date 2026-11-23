import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChatCircleText, 
  MagnifyingGlass, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Funnel,
  Buildings,
  EnvelopeSimple,
  Phone
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function Enquiries() {
  const { enquiries } = useCustomerDashboard();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = ['All', 'Submitted', 'In progress', 'Agent replied', 'Visit requested', 'Closed'];

  const filteredEnquiries = enquiries.filter((enq) => {
    // Tab filter
    if (activeTab !== 'All' && enq.status !== activeTab) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = enq.propertyTitle.toLowerCase().includes(q);
      const matchesLoc = enq.propertyLocation.toLowerCase().includes(q);
      const matchesRef = enq.reference.toLowerCase().includes(q);
      const matchesAgent = enq.agentName.toLowerCase().includes(q);
      if (!matchesTitle && !matchesLoc && !matchesRef && !matchesAgent) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 8.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="My property enquiries"
        description="Track communication history, advisor responses, and verification updates for all requested listings."
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => navigate('/dashboard/discover')}
            className="rounded-2xl min-h-10 px-4"
          >
            Explore properties
          </Button>
        }
      />

      {/* =========================================================================
          2. FILTERS & SEARCH (PRD Section 8.3)
         ========================================================================= */}
      <Card className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by property title, reference ID, locality, or advisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-small text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const count = tab === 'All' 
              ? enquiries.length 
              : enquiries.filter((e) => e.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl min-h-9 px-3 button-sm font-semibold text-small whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-caption px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </Card>

      {/* =========================================================================
          3. ENQUIRIES LIST (PRD Section 8.2)
         ========================================================================= */}
      {filteredEnquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <Card 
              key={enq.id} 
              className="p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              {/* Property & Reference */}
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={enq.propertyImage}
                  alt={enq.propertyTitle}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="caption-2 font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md">
                      {enq.reference}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-caption font-semibold py-0.5 ${
                        enq.status === 'Agent replied'
                          ? 'bg-blue-50 text-brand-blue border-blue-200'
                          : enq.status === 'Visit requested'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : enq.status === 'In progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : enq.status === 'Closed'
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {enq.status}
                    </Badge>
                  </div>

                  <h3 className="text-h4 font-bold text-brand-navy mt-1 truncate hover:text-brand-blue">
                    <Link to={`/dashboard/enquiries/${enq.id}`}>{enq.propertyTitle}</Link>
                  </h3>

                  <p className="caption-2 text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span>{enq.propertyLocation}</span>
                    <span>•</span>
                    <span className="font-semibold text-brand-navy">{enq.propertyPrice}</span>
                  </p>

                  <p className="caption-2 text-slate-500 mt-2 flex items-center gap-3 flex-wrap">
                    <span>Advisor: <strong className="text-slate-700 font-semibold">{enq.agentName}</strong> ({enq.agency})</span>
                    <span>•</span>
                    <span>Submitted: {enq.submittedDate}</span>
                    <span>•</span>
                    <span>Updated: {enq.lastUpdated}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                {enq.conversationId && (
                  <Link to={`/dashboard/messages/${enq.conversationId}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl min-h-10 px-4 border-slate-200 text-brand-navy hover:bg-slate-50 cursor-pointer"
                    >
                      <ChatCircleText size={16} className="mr-1 text-brand-blue" />
                      <span>Chat</span>
                    </Button>
                  </Link>
                )}

                <Link to={`/dashboard/enquiries/${enq.id}`}>
                  <Button 
                    size="sm" 
                    className="rounded-xl min-h-10 px-4 bg-brand-navy hover:bg-slate-900 text-white cursor-pointer"
                  >
                    <span>View timeline</span>
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
            <ChatCircleText size={24} />
          </div>
          <h3 className="text-h4 font-bold text-brand-navy">No enquiries matching your filter</h3>
          <p className="caption-2 text-slate-500 max-w-sm mx-auto">
            When you inquire about verified listings, your communication logs and assigned advisors will appear here.
          </p>
          <Button size="sm"
            onClick={() => {
              setActiveTab('All');
              setSearchQuery('');
            }}
            variant="outline"
            className="rounded-xl min-h-10 px-4 border-slate-200 cursor-pointer mt-2"
          >
            Reset enquiry filters
          </Button>
        </Card>
      )}

    </div>
  );
}
