import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellRinging, 
  Plus, 
  Trash, 
  PencilSimple, 
  CheckCircle, 
  X, 
  EnvelopeSimple, 
  DeviceMobile, 
  ArrowRight,
  ShieldCheck,
  Pause,
  Play
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { CITIES } from '../../data/properties';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';

export default function SearchAlerts() {
  const { searchAlerts, createAlert, toggleAlertActive, deleteAlert } = useCustomerDashboard();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [intent, setIntent] = useState('buy');
  const [location, setLocation] = useState('Mumbai');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState('4 BHK');
  const [frequency, setFrequency] = useState('Daily');
  const [channels, setChannels] = useState(['Email', 'In app']);

  const handleOpenCreateModal = () => {
    setEditingAlertId(null);
    setName('');
    setIntent('buy');
    setLocation('Mumbai');
    setPropertyType('Apartment');
    setBedrooms('4 BHK');
    setFrequency('Daily');
    setChannels(['Email', 'In app']);
    setModalOpen(true);
  };

  const handleOpenEditModal = (alert) => {
    setEditingAlertId(alert.id);
    setName(alert.name);
    setIntent(alert.intent);
    setLocation(alert.location);
    setPropertyType(alert.propertyType);
    setBedrooms(alert.bedrooms);
    setFrequency(alert.frequency);
    setChannels(alert.channels);
    setModalOpen(true);
  };

  const handleChannelToggle = (ch) => {
    setChannels((prev) => 
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAlertId) {
      deleteAlert(editingAlertId);
    }
    createAlert({
      name,
      intent,
      location,
      propertyType,
      bedrooms,
      frequency,
      channels
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 13.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Property search alerts"
        description="Configure automated notifications whenever new verified listings match your preferred configurations."
        action={
          <Button type="button" size="sm" onClick={handleOpenCreateModal} className="rounded-2xl min-h-10 px-4">
            <Plus size={14} className="mr-1" />
            <span>Create alert</span>
          </Button>
        }
      />

      {/* =========================================================================
          2. ALERTS LIST (PRD Section 13.3)
         ========================================================================= */}
      {searchAlerts.length > 0 ? (
        <div className="space-y-4">
          {searchAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`p-5 rounded-3xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                alert.isActive ? 'border-slate-100 hover:shadow-md' : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-h4 font-bold text-brand-navy">{alert.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-caption font-semibold py-0.5 ${
                      alert.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {alert.isActive ? 'Active monitoring' : 'Alert paused'}
                  </Badge>
                  <span className="caption-2 font-mono text-slate-400">
                    Frequency: {alert.frequency}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <span>Intent: <strong className="text-slate-800 capitalize">{alert.intent}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-800">{alert.location}</strong></span>
                  <span>•</span>
                  <span>Type: <strong className="text-slate-800">{alert.propertyType}</strong></span>
                  <span>•</span>
                  <span>Rooms: <strong className="text-slate-800">{alert.bedrooms}</strong></span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    Channels:
                    {alert.channels.map((c) => (
                      <span key={c} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-caption font-medium">
                        {c}
                      </span>
                    ))}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{alert.matchingCount} matching listings</span>
                  <span>•</span>
                  <span>Last sent: {alert.lastNotified}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAlertActive(alert.id)}
                  className={`rounded-xl min-h-10 px-4 h-9 cursor-pointer border-slate-200 ${
                    alert.isActive ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {alert.isActive ? <Pause size={14} className="mr-1" /> : <Play size={14} className="mr-1" />}
                  <span>{alert.isActive ? 'Pause' : 'Resume'}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEditModal(alert)}
                  className="rounded-xl min-h-10 px-4 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer h-9"
                >
                  <PencilSimple size={14} className="mr-1" />
                  <span>Edit</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard/discover')}
                  className="rounded-xl min-h-10 px-4 bg-brand-navy hover:bg-slate-900 text-white cursor-pointer h-9"
                >
                  <span>View listings</span>
                  <ArrowRight size={14} className="ml-1" />
                </Button>

                <button
                  type="button"
                  onClick={() => deleteAlert(alert.id)}
                  title="Delete alert"
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
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <BellRinging size={32} />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-brand-navy">No active search alerts</h3>
            <p className="caption-2 text-slate-500 max-w-sm mx-auto mt-1">
              Create alerts for prime localities or property types to get notified the moment verified owners or builders list inventory.
            </p>
          </div>
          <Button size="sm"
            onClick={handleOpenCreateModal}
            className="rounded-2xl min-h-10 px-4 font-semibold bg-brand-navy text-white cursor-pointer"
          >
            Create first alert
          </Button>
        </Card>
      )}

      {/* =========================================================================
          3. CREATE / EDIT ALERT MODAL (PRD Section 13.2)
         ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <BellRinging size={20} className="text-brand-blue" />
                <h3 className="text-h4">{editingAlertId ? 'Edit search alert' : 'Create search alert'}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Alert name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Mumbai Sea Facing 4 BHK"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption-2 font-bold text-slate-700 block mb-1">Intent</label>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="caption-2 font-bold text-slate-700 block mb-1">City</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                  >
                    {CITIES.filter((c) => c !== 'All cities').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption-2 font-bold text-slate-700 block mb-1">Property type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Office">Commercial office</option>
                  </select>
                </div>

                <div>
                  <label className="caption-2 font-bold text-slate-700 block mb-1">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4+ BHK</option>
                    <option value="Any">Any rooms</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Instant">Instant (Real time when published)</option>
                  <option value="Daily">Daily morning update</option>
                  <option value="Weekly">Weekly consolidated digest</option>
                </select>
              </div>

              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Delivery channels</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-small text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.includes('Email')}
                      onChange={() => handleChannelToggle('Email')}
                      className="rounded text-brand-navy"
                    />
                    <span>Email updates</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-small text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.includes('In app')}
                      onChange={() => handleChannelToggle('In app')}
                      className="rounded text-brand-navy"
                    />
                    <span>In portal notifications</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-brand-navy text-white">
                  {editingAlertId ? 'Update alert' : 'Save alert'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
