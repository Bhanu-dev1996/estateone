import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClockCounterClockwise, 
  MagnifyingGlass, 
  Trash, 
  BellRinging, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle,
  X
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function RecentSearches() {
  const { searchHistory, deleteSearchHistory, clearAllSearchHistory, createAlert } = useCustomerDashboard();
  const navigate = useNavigate();

  const [alertModalSearch, setAlertModalSearch] = useState(null);
  const [alertName, setAlertName] = useState('');
  const [alertFrequency, setAlertFrequency] = useState('Daily');

  const handleRunSearch = (item) => {
    navigate('/dashboard/discover', { state: { prefillQuery: item.query } });
  };

  const handleOpenAlertModal = (item) => {
    setAlertModalSearch(item);
    setAlertName(`Alert: ${item.query}`);
  };

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    if (!alertModalSearch) return;

    createAlert({
      name: alertName,
      intent: alertModalSearch.intent,
      location: alertModalSearch.location,
      propertyType: alertModalSearch.filters?.type || 'All types',
      bedrooms: alertModalSearch.filters?.bedrooms || 'Any',
      frequency: alertFrequency,
      channels: ['Email', 'In app']
    });

    setAlertModalSearch(null);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 12.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Recent property searches"
        description="Review past search queries, resume market filters, or convert them into automated inventory alerts."
        action={
          searchHistory.length > 0 ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={clearAllSearchHistory}
              className="rounded-2xl min-h-10 px-4 text-rose-600 hover:bg-rose-50"
            >
              <Trash size={14} className="mr-1" />
              <span>Clear search history</span>
            </Button>
          ) : null
        }
      />

      {/* =========================================================================
          2. SEARCH HISTORY CARDS (PRD Section 12.1 & 12.2)
         ========================================================================= */}
      {searchHistory.length > 0 ? (
        <div className="space-y-3.5">
          {searchHistory.map((item) => (
            <Card key={item.id} className="p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-label font-bold text-brand-blue bg-blue-50/60 border-blue-200">
                    {item.intent}
                  </Badge>
                  <span className="caption-2 text-slate-400">Searched on {item.date}</span>
                </div>

                <h3 className="text-h4 font-bold text-brand-navy">{item.query}</h3>
                <p className="caption-2 text-slate-500 mt-0.5">{item.filtersSummary}</p>
                <p className="text-small font-semibold text-emerald-700 mt-1">
                  {item.resultCount} matching verified properties
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenAlertModal(item)}
                  className="rounded-xl min-h-10 px-4 border-slate-200 text-brand-navy hover:bg-slate-50 cursor-pointer h-9"
                >
                  <BellRinging size={14} className="mr-1 text-brand-blue" />
                  <span>Create alert</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleRunSearch(item)}
                  className="rounded-xl min-h-10 px-4 bg-brand-navy hover:bg-slate-900 text-white cursor-pointer h-9"
                >
                  <span>Run search</span>
                  <ArrowRight size={14} className="ml-1" />
                </Button>

                <button
                  type="button"
                  onClick={() => deleteSearchHistory(item.id)}
                  title="Delete from history"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 rounded-3xl bg-white border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <ClockCounterClockwise size={32} />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-brand-navy">No recent searches recorded</h3>
            <p className="caption-2 text-slate-500 max-w-sm mx-auto mt-1">
              When you explore properties, your search criteria and keywords are saved here for easy one click resumption.
            </p>
          </div>
          <Button size="sm"
            onClick={() => navigate('/dashboard/discover')}
            className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white cursor-pointer"
          >
            Start exploring
          </Button>
        </Card>
      )}

      {/* Privacy Notice (PRD Section 12.3) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
        <ShieldCheck size={20} className="text-brand-blue shrink-0 mt-0.5" weight="fill" />
        <span>
          Search privacy notice: Your search history is encrypted and isolated to your authenticated account. It is never exposed to other members or advertisers.
        </span>
      </div>

      {/* Create Alert Modal from Search */}
      {alertModalSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <BellRinging size={20} className="text-brand-blue" />
                <h3 className="text-h4">Create search alert</h3>
              </div>
              <button onClick={() => setAlertModalSearch(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAlertSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Alert label</label>
                <input
                  type="text"
                  required
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Delivery frequency</label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Instant">Instant (as soon as listed)</option>
                  <option value="Daily">Daily morning summary</option>
                  <option value="Weekly">Weekly digest</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-small text-slate-600">
                Criteria: {alertModalSearch.query} ({alertModalSearch.intent})
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAlertModalSearch(null)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  Save alert
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
