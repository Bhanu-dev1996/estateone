import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ChatCircleText, 
  CalendarCheck, 
  EnvelopeSimple, 
  ArrowRight, 
  MagnifyingGlass, 
  SlidersHorizontal, 
  ShieldCheck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  BellRinging, 
  Scales, 
  CalendarPlus,
  ArrowUpRight,
  Eye
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import ReportListingModal from '../../components/dashboard/ReportListingModal';
import { APP_ICON } from '../../lib/iconScale';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { savedPropertyIds, toggleSave, isSaved, comparePropertyIds, toggleCompare, isCompared } = useProperty();
  const { 
    enquiries, 
    siteVisits, 
    conversations, 
    searchHistory, 
    searchAlerts, 
    notifications,
    profile,
    activeEnquiriesCount,
    upcomingVisitsCount,
    unreadMessagesCount
  } = useCustomerDashboard();

  const navigate = useNavigate();
  const [reportProperty, setReportProperty] = useState(null);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.firstName || user?.name?.split(' ')[0] || 'Friend';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Recommended properties based on customer intent and preferred types
  const recommendedProperties = SAMPLE_PROPERTIES.filter(
    (p) => p.intent === (profile?.intent || 'buy')
  ).slice(0, 3);

  // Filter upcoming visits
  const upcomingVisits = siteVisits.filter(
    (v) => v.status === 'Upcoming' || v.status === 'Pending confirmation'
  ).slice(0, 2);

  // Recent enquiries
  const recentEnquiries = enquiries.slice(0, 3);

  // Recent activity stream combining events
  const activities = [
    {
      title: 'Site visit confirmed',
      time: '1 hour ago',
      desc: 'Private walkthrough confirmed for The Grand Horizon Penthouse.',
      link: '/dashboard/site-visits/vis-201',
      icon: CalendarCheck,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Advisor response received',
      time: '2 hours ago',
      desc: 'Vikramaditya Singhania shared floor plans and concierge passes.',
      link: '/dashboard/messages/conv-1',
      icon: ChatCircleText,
      color: 'bg-blue-50 text-brand-blue'
    },
    {
      title: 'New search alert match',
      time: '1 day ago',
      desc: '3 verified residences added to South Mumbai Sea View 4 BHK.',
      link: '/dashboard/alerts',
      icon: BellRinging,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Property shortlisted',
      time: '2 days ago',
      desc: 'Greenwood Manor Luxury Villa saved to your shortlisted collection.',
      link: '/dashboard/saved',
      icon: Heart,
      color: 'bg-rose-50 text-rose-500'
    }
  ];

  return (
    <div className="space-y-8 text-body">
      
      {/* =========================================================================
          1. HEADER & GREETING (PRD Section 5.2)
         ========================================================================= */}
      <DashboardPageHeader
        className="pb-0"
        leading={
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-small font-semibold bg-blue-50 text-brand-blue border border-blue-100">
            <ShieldCheck size={14} weight="fill" />
            <span>Verified customer workspace</span>
          </span>
        }
        title={getGreeting()}
        titleClassName="text-h1"
        description="Here is an overview of your property journey."
        action={
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => navigate('/dashboard/profile')}
              className="rounded-2xl min-h-10 px-4 flex items-center gap-2"
            >
              <SlidersHorizontal size={APP_ICON.sm} aria-hidden />
              <span>Edit search preferences</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate('/dashboard/discover')}
              className="rounded-2xl min-h-10 px-4 flex items-center gap-2 shadow-xs"
            >
              <MagnifyingGlass size={APP_ICON.sm} weight="bold" className="text-brand-gold" aria-hidden />
              <span>Explore properties</span>
            </Button>
          </>
        }
      />

      {/* =========================================================================
          2. SUMMARY CARDS (PRD Section 5.3)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Saved Properties */}
        <Link to="/dashboard/saved" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-brand-blue/30 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-label text-slate-500">Saved properties</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart size={20} weight="fill" />
              </div>
            </div>
            <div className="mt-3">
              <div className="type-kpi text-brand-navy tabular-nums">{savedPropertyIds.length}</div>
              <p className="caption-2 text-slate-500 mt-1 flex items-center gap-1">
                <span>View shortlisted collection</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </Card>
        </Link>

        {/* Card 2: Active Enquiries */}
        <Link to="/dashboard/enquiries" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-brand-blue/30 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-label text-slate-500">Active enquiries</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                <ChatCircleText size={20} weight="fill" />
              </div>
            </div>
            <div className="mt-3">
              <div className="type-kpi text-brand-navy tabular-nums">{activeEnquiriesCount}</div>
              <p className="caption-2 text-slate-500 mt-1 flex items-center gap-1">
                <span>Advisor responses pending</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </Card>
        </Link>

        {/* Card 3: Upcoming Site Visits */}
        <Link to="/dashboard/site-visits" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-brand-blue/30 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-label text-slate-500">Upcoming visits</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarCheck size={20} weight="fill" />
              </div>
            </div>
            <div className="mt-3">
              <div className="type-kpi text-brand-navy tabular-nums">{upcomingVisitsCount}</div>
              <p className="caption-2 text-slate-500 mt-1 flex items-center gap-1">
                <span>Confirmed & requested visits</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </Card>
        </Link>

        {/* Card 4: Unread Messages */}
        <Link to="/dashboard/messages" className="block group">
          <Card className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-brand-blue/30 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-label text-slate-500">Unread messages</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <EnvelopeSimple size={20} weight="fill" />
              </div>
            </div>
            <div className="mt-3">
              <div className="type-kpi text-brand-navy tabular-nums">{unreadMessagesCount}</div>
              <p className="caption-2 text-slate-500 mt-1 flex items-center gap-1">
                <span>Advisor conversations</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </Card>
        </Link>

      </div>

      {/* =========================================================================
          3. TWO-COLUMN WORKSPACE: LEFT (Searches & Recommended) | RIGHT (Visits & Timeline)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section A: Continue your search (PRD 5.4 A) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h4 font-bold text-brand-navy">Continue your search</h2>
                <p className="caption-2 text-slate-500">Pick up where you left off in recent market explorations</p>
              </div>
              <Link to="/dashboard/recent-searches" className="text-small font-semibold text-brand-blue hover:underline">
                View all searches
              </Link>
            </div>

            {searchHistory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {searchHistory.slice(0, 2).map((item) => (
                  <Card key={item.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge variant="outline" className="text-label font-bold text-brand-blue bg-blue-50/50">
                          {item.intent}
                        </Badge>
                        <span className="caption-2 text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-small font-bold text-brand-navy line-clamp-1">{item.query}</p>
                      <p className="caption-2 text-slate-500 mt-1 line-clamp-1">{item.filtersSummary}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-small font-semibold text-slate-600">{item.resultCount} matching</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate('/dashboard/discover', { state: { prefillQuery: item.query } })}
                        className="text-xs text-brand-blue hover:bg-blue-50 px-2 py-1 h-auto font-semibold cursor-pointer"
                      >
                        <span>View results</span>
                        <ArrowUpRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 rounded-2xl bg-white border border-slate-100 text-center">
                <p className="text-xs text-slate-500">No recent searches saved yet.</p>
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard/discover')}
                  className="mt-3 rounded-xl min-h-10 px-4 bg-brand-navy text-white"
                >
                  Explore properties
                </Button>
              </Card>
            )}
          </section>

          {/* Section B: Recommended properties (PRD 5.4 B) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h4 font-bold text-brand-navy">Recommended for you</h2>
                <p className="caption-2 text-slate-500">Based on your stated intent ({profile?.intent || 'buy'}) and search preferences</p>
              </div>
              <Link to="/dashboard/discover" className="text-small font-semibold text-brand-blue hover:underline">
                Discover more
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedProperties.map((prop) => {
                const saved = isSaved(prop.id);
                const compared = isCompared(prop.id);

                return (
                  <Card key={prop.id} className="rounded-2xl overflow-hidden bg-white border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSave(prop);
                        }}
                        aria-label={saved ? 'Remove from saved' : 'Save property'}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          saved ? 'bg-rose-500 text-white' : 'bg-white/80 hover:bg-white text-slate-700'
                        }`}
                      >
                        <Heart size={14} weight={saved ? 'fill' : 'regular'} />
                      </button>

                      <div className="absolute bottom-2.5 left-2.5">
                        <Badge className="bg-brand-navy/90 text-white text-caption font-semibold backdrop-blur-xs">
                          {prop.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-small font-bold text-brand-navy">{prop.priceDisplay}</span>
                          <span className="caption-2 text-slate-400">{prop.bedrooms}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1 hover:text-brand-blue">
                          <Link to={`/property/${prop.slug}`}>{prop.title}</Link>
                        </h3>
                        <p className="caption-2 text-slate-500 mt-0.5 line-clamp-1 flex items-center gap-1">
                          <MapPin size={12} className="shrink-0 text-slate-400" />
                          <span>{prop.location}</span>
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => toggleCompare(prop)}
                          className={`text-small font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                            compared ? 'text-brand-blue font-bold' : 'text-slate-500 hover:text-brand-navy'
                          }`}
                        >
                          <Scales size={14} weight={compared ? 'bold' : 'regular'} />
                          <span>{compared ? 'Comparing' : 'Compare'}</span>
                        </button>

                        <Link
                          to={`/property/${prop.slug}`}
                          className="text-small font-bold text-brand-navy hover:text-brand-blue flex items-center gap-0.5"
                        >
                          <span>Details</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Section E: Enquiry updates (PRD 5.4 E) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h4 font-bold text-brand-navy">Enquiry updates</h2>
                <p className="caption-2 text-slate-500">Track active inquiries submitted to certified advisors</p>
              </div>
              <Link to="/dashboard/enquiries" className="text-small font-semibold text-brand-blue hover:underline">
                View all enquiries
              </Link>
            </div>

            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <Card key={enq.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={enq.propertyImage}
                      alt={enq.propertyTitle}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="caption-2 font-mono font-bold text-slate-400">{enq.reference}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-caption font-semibold py-0.2 ${
                            enq.status === 'Agent replied'
                              ? 'bg-blue-50 text-brand-blue border-blue-200'
                              : enq.status === 'Visit requested'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {enq.status}
                        </Badge>
                      </div>
                      <p className="text-small font-bold text-brand-navy truncate mt-0.5">{enq.propertyTitle}</p>
                      <p className="caption-2 text-slate-500 truncate">
                        Advisor: <span className="font-semibold text-slate-700">{enq.agentName}</span> • Last update: {enq.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {enq.conversationId && (
                      <Link to={`/dashboard/messages/${enq.conversationId}`}>
                        <Button size="sm" variant="outline" className="text-xs rounded-xl h-8 text-brand-navy border-slate-200 cursor-pointer">
                          <ChatCircleText size={14} className="mr-1 text-brand-blue" />
                          <span>Conversation</span>
                        </Button>
                      </Link>
                    )}
                    <Link to={`/dashboard/enquiries/${enq.id}`}>
                      <Button size="sm" className="text-xs rounded-xl h-8 bg-brand-navy text-white cursor-pointer">
                        <span>Details</span>
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Section D: Upcoming site visits (PRD 5.4 D) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h4 font-bold text-brand-navy">Upcoming site visits</h2>
                <p className="caption-2 text-slate-500">Scheduled inspections and walkthroughs</p>
              </div>
              <Link to="/dashboard/site-visits" className="text-small font-semibold text-brand-blue hover:underline">
                View all
              </Link>
            </div>

            {upcomingVisits.length > 0 ? (
              <div className="space-y-3">
                {upcomingVisits.map((visit) => (
                  <Card key={visit.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-xs transition-all space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={visit.propertyImage}
                        alt={visit.propertyTitle}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-caption font-semibold ${
                              visit.status === 'Upcoming'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {visit.status === 'Upcoming' ? 'Confirmed' : 'Pending verification'}
                          </Badge>
                          <span className="caption-2 font-mono text-slate-400">{visit.bookingRef}</span>
                        </div>
                        <h4 className="text-small font-bold text-brand-navy truncate mt-1">{visit.propertyTitle}</h4>
                        <p className="caption-2 text-slate-500 truncate">{visit.propertyLocation}</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-brand-blue shrink-0" />
                        <span className="font-semibold">{visit.visitDate}</span>
                        <span className="text-slate-400">•</span>
                        <span>{visit.timeSlot}</span>
                      </div>
                      <span className="text-caption font-bold text-brand-navy bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {visit.visitType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="caption-2 text-slate-500">Advisor: {visit.agentName}</span>
                      <Link
                        to={`/dashboard/site-visits/${visit.id}`}
                        className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                      >
                        <span>Manage visit</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 rounded-2xl bg-white border border-slate-100 text-center">
                <CalendarPlus size={28} className="text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-bold">No upcoming site visits</p>
                <p className="caption-2 text-slate-400 mt-1">Schedule a verified private tour directly on any listing.</p>
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard/discover')}
                  className="mt-3 rounded-xl min-h-10 px-4 bg-brand-navy text-white cursor-pointer"
                >
                  Discover properties
                </Button>
              </Card>
            )}
          </section>

          {/* Section C: Recent activity stream (PRD 5.4 C) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h4 font-bold text-brand-navy">Recent activity</h2>
                <p className="caption-2 text-slate-500">Live timeline of actions across your account</p>
              </div>
            </div>

            <Card className="p-4 rounded-2xl bg-white border border-slate-100">
              <div className="space-y-4">
                {activities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 relative pb-4 last:pb-0">
                      {idx < activities.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-100" />
                      )}
                      <div className={`w-8 h-8 rounded-xl ${act.color} flex items-center justify-center shrink-0 z-10`}>
                        <Icon size={16} weight="bold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-small font-bold text-brand-navy">{act.title}</p>
                          <span className="caption-2 text-slate-400">{act.time}</span>
                        </div>
                        <p className="caption-2 text-slate-500 mt-0.5">{act.desc}</p>
                        <Link to={act.link} className="text-small font-semibold text-brand-blue hover:underline inline-flex items-center gap-0.5 mt-1">
                          <span>View record</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          {/* Section F: Search alert preview (PRD 5.4 F) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h4 font-bold text-brand-navy">Active search alerts</h2>
                <p className="caption-2 text-slate-500">Notifications for newly matched inventory</p>
              </div>
              <Link to="/dashboard/alerts" className="text-small font-semibold text-brand-blue hover:underline">
                Manage alerts
              </Link>
            </div>

            {searchAlerts.length > 0 ? (
              <Card className="p-4 rounded-2xl bg-white border border-slate-100 space-y-3">
                {searchAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-small font-bold text-brand-navy truncate">{alert.name}</p>
                      <p className="caption-2 text-slate-500 truncate">
                        {alert.frequency} • {alert.channels.join(', ')} • {alert.matchingCount} listings found
                      </p>
                    </div>
                    <Link to="/dashboard/alerts">
                      <Button size="sm" variant="outline" className="text-small h-7 px-2.5 rounded-lg border-slate-200 text-slate-700 cursor-pointer">
                        Manage
                      </Button>
                    </Link>
                  </div>
                ))}
              </Card>
            ) : null}
          </section>

        </div>

      </div>

      {/* Global Report Listing Modal */}
      {reportProperty && (
        <ReportListingModal
          isOpen={!!reportProperty}
          onClose={() => setReportProperty(null)}
          property={reportProperty}
        />
      )}

    </div>
  );
}
