import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle, 
  ChatCircleText, 
  CalendarCheck, 
  Heart, 
  BellRinging, 
  ShieldCheck, 
  Trash, 
  ArrowRight,
  Checks
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function Notifications() {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification,
    unreadNotificationsCount 
  } = useCustomerDashboard();

  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState('all'); // all or unread

  const filteredNotifications = notifications.filter((n) => {
    if (filterMode === 'unread') return n.unread;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'visit':
        return { icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-600' };
      case 'message':
        return { icon: ChatCircleText, color: 'bg-blue-50 text-brand-blue' };
      case 'alert':
        return { icon: BellRinging, color: 'bg-amber-50 text-amber-600' };
      case 'saved':
        return { icon: Heart, color: 'bg-rose-50 text-rose-500' };
      case 'security':
        return { icon: ShieldCheck, color: 'bg-slate-100 text-slate-700' };
      default:
        return { icon: Bell, color: 'bg-blue-50 text-brand-blue' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 15.2)
         ========================================================================= */}
      <DashboardPageHeader
        title="Account notifications"
        description="Stay informed on scheduled visits, advisor messages, inventory alert matches, and security updates."
        action={
          notifications.length > 0 && unreadNotificationsCount > 0 ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={markAllNotificationsRead}
              className="rounded-2xl min-h-10 px-4"
            >
              <Checks size={16} className="mr-1 text-emerald-600" />
              <span>Mark all as read</span>
            </Button>
          ) : null
        }
      />

      {/* =========================================================================
          2. FILTER TABS (PRD Section 15.2)
         ========================================================================= */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 rounded-2xl min-h-10 px-4 button-sm font-semibold transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-brand-navy text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          All notifications ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('unread')}
          className={`px-4 py-2 rounded-2xl min-h-10 px-4 button-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMode === 'unread'
              ? 'bg-brand-navy text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <span>Unread</span>
          {unreadNotificationsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-caption font-bold flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          3. NOTIFICATION LIST (PRD Section 15.1 & 15.2)
         ========================================================================= */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const { icon: Icon, color } = getNotificationIcon(notif.type);

            return (
              <Card 
                key={notif.id} 
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                  notif.unread 
                    ? 'bg-white border-blue-200/80 shadow-xs' 
                    : 'bg-white/80 border-slate-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} weight="fill" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-small font-bold text-brand-navy">{notif.title}</h3>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                      )}
                    </div>
                    <span className="caption-2 text-slate-400 shrink-0">{notif.time}</span>
                  </div>

                  <p className="caption-2 text-slate-600 mt-1 leading-relaxed">
                    {notif.body}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    {notif.route && (
                      <Link 
                        to={notif.route}
                        onClick={() => markNotificationRead(notif.id)}
                        className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1"
                      >
                        <span>View details</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}

                    {notif.unread && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(notif.id)}
                        className="text-small font-semibold text-slate-500 hover:text-brand-navy cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteNotification(notif.id)}
                      className="text-small font-semibold text-slate-400 hover:text-rose-600 cursor-pointer ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 rounded-3xl bg-white border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Bell size={32} />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-brand-navy">No notifications</h3>
            <p className="caption-2 text-slate-500 max-w-sm mx-auto mt-1">
              You are completely caught up. Updates on site visits, agent responses, and new alert matches will appear here.
            </p>
          </div>
        </Card>
      )}

      {/* Notification Preferences Card Link */}
      <Card className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-h4 font-bold text-brand-navy">Looking to adjust your alert channels?</h4>
          <p className="caption-2 text-slate-500 mt-0.5">Manage email, push, and SMS preferences in account settings.</p>
        </div>
        <Link to="/dashboard/settings">
          <Button size="sm" variant="outline" className="rounded-xl min-h-10 px-4 border-slate-200 text-brand-navy shrink-0">
            Configure preferences
          </Button>
        </Link>
      </Card>

    </div>
  );
}
