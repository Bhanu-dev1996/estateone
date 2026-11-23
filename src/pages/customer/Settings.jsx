import React, { useState } from 'react';
import { 
  GearSix, 
  Key, 
  ShieldCheck, 
  CheckCircle, 
  Eye, 
  EyeSlash, 
  Bell, 
  Lock, 
  Trash, 
  WarningCircle, 
  DeviceMobile, 
  EnvelopeSimple, 
  Desktop,
  X
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { checkPasswordSecurity } from '../../lib/authSecurity';

export default function Settings() {
  const { user, logout } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Privacy Preferences
  const [advisorVisibility, setAdvisorVisibility] = useState(true);
  const [retainSearchHistory, setRetainSearchHistory] = useState(true);

  // Delete Account Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Password Security Analysis
  const passwordSecurity = checkPasswordSecurity(newPassword);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toastError('Current password required', 'Please enter your existing password to verify identity.');
      return;
    }

    if (!passwordSecurity.isAcceptable) {
      toastError('Security requirements not met', 'Please meet all 5 password requirements listed below.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError('Passwords mismatch', 'New password and confirmation do not match.');
      return;
    }

    // Success simulation
    toastSuccess('Password updated', 'Your account credentials have been updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleTogglePreference = (type) => {
    if (type === 'email') setEmailAlerts(!emailAlerts);
    if (type === 'inApp') setInAppNotifs(!inAppNotifs);
    if (type === 'sms') setSmsAlerts(!smsAlerts);
    toastInfo('Preferences saved', 'Your notification preferences were updated.');
  };

  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    setDeleteModalOpen(false);
    toastError('Account deletion request initiated', 'Your account is scheduled for deletion in accordance with privacy laws.');
    logout();
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 17.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Account settings and security"
        description="Manage your password security, communication channels, privacy preferences, and active browser sessions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Password Change & Active Sessions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Change Password Card (PRD 17.2) */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-brand-navy">
              <Key size={20} className="text-brand-blue" />
              <h2 className="text-h4 font-bold">Change password</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-small p-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create strong new password"
                    className="w-full text-small p-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Security Requirements Checklist */}
              {newPassword && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <p className="caption-2 font-bold text-slate-500 uppercase tracking-wider">Security criteria checklist:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-small">
                    {passwordSecurity.checks.map((c) => (
                      <div key={c.id} className="flex items-center gap-1.5">
                        <CheckCircle 
                          size={14} 
                          weight="fill" 
                          className={c.passed ? 'text-emerald-600' : 'text-slate-300'} 
                        />
                        <span className={c.passed ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full text-small p-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm"
                  type="submit"
                  className="rounded-2xl min-h-10 px-4 bg-brand-navy hover:bg-slate-900 text-white cursor-pointer font-heading font-semibold h-9 px-5"
                >
                  Update password
                </Button>
              </div>
            </form>
          </Card>

          {/* Active Sessions Card */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-brand-navy">
              <Desktop size={20} className="text-brand-blue" />
              <h2 className="text-h4 font-bold">Active sessions</h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Desktop size={24} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-small font-bold text-brand-navy">Windows 11 • Chrome Browser</p>
                  <span className="text-caption font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Current active session
                  </span>
                </div>
                <p className="caption-2 text-slate-500 mt-0.5">IP Address: 103.21.144.12 • Mumbai, India</p>
                <p className="text-caption text-slate-400 mt-1">Session started today • Validated identity token</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column (5 cols): Preferences & Danger Zone */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Notification Channels Preferences */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-brand-navy">
              <Bell size={20} className="text-brand-blue" />
              <h2 className="text-h4 font-bold">Notification preferences</h2>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="text-small font-bold text-brand-navy">Email updates</p>
                  <p className="caption-2 text-slate-500">Visit confirmations and daily alert summaries</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={() => handleTogglePreference('email')}
                  className="rounded text-brand-navy w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="text-small font-bold text-brand-navy">In portal messages</p>
                  <p className="caption-2 text-slate-500">Real time message alerts and booking reminders</p>
                </div>
                <input
                  type="checkbox"
                  checked={inAppNotifs}
                  onChange={() => handleTogglePreference('inApp')}
                  className="rounded text-brand-navy w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="text-small font-bold text-brand-navy">SMS / WhatsApp</p>
                  <p className="caption-2 text-slate-500">Critical walkthrough arrival alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={() => handleTogglePreference('sms')}
                  className="rounded text-brand-navy w-4 h-4"
                />
              </label>
            </div>
          </Card>

          {/* Privacy Preferences */}
          <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-brand-navy">
              <ShieldCheck size={20} className="text-brand-blue" />
              <h2 className="text-h4 font-bold">Privacy settings</h2>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="font-bold text-brand-navy">Verified advisor disclosure</p>
                  <p className="caption-2 text-slate-500">Share contact info only after submitting enquiry</p>
                </div>
                <input
                  type="checkbox"
                  checked={advisorVisibility}
                  onChange={() => setAdvisorVisibility(!advisorVisibility)}
                  className="rounded text-brand-navy w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="font-bold text-brand-navy">Search history retention</p>
                  <p className="caption-2 text-slate-500">Save searches for fast recommendations</p>
                </div>
                <input
                  type="checkbox"
                  checked={retainSearchHistory}
                  onChange={() => setRetainSearchHistory(!retainSearchHistory)}
                  className="rounded text-brand-navy w-4 h-4"
                />
              </label>
            </div>
          </Card>

          {/* Danger Zone: Delete Account (PRD 17.3) */}
          <Card className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-700">
              <WarningCircle size={20} weight="fill" />
              <h3 className="text-h4 font-bold">Delete account</h3>
            </div>
            <p className="caption-2 text-slate-600 leading-relaxed">
              Permanently close your EstateOne customer workspace and remove all saved shortlists, searches, and enquiry histories.
            </p>
            <Button size="sm"
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="rounded-2xl min-h-10 px-4 font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer h-9"
            >
              Request account deletion
            </Button>
          </Card>

        </div>

      </div>

      {/* Delete Account Modal (PRD 17.3) */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <Trash size={20} weight="fill" />
                <h3 className="text-h4 text-brand-navy">Confirm account deletion</h3>
              </div>
              <button onClick={() => setDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <p className="caption-2 text-slate-600 leading-relaxed">
              This action is permanent. All saved properties, compare lists, search alerts, and past visit logs will be erased in accordance with our documented data retention schedule.
            </p>

            <form onSubmit={handleDeleteAccountSubmit} className="space-y-3">
              <div>
                <label className="caption-2 font-bold text-slate-700 block mb-1">Enter password to authorize deletion</label>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full text-small p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)} size="sm" className="rounded-xl min-h-10 px-4 ">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-xl min-h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white">
                  Permanently delete account
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
