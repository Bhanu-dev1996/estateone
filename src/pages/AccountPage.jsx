import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Clock, 
  SignOut, 
  Key, 
  Buildings, 
  Heart, 
  PlusCircle, 
  Envelope, 
  Phone, 
  CheckCircle, 
  WarningCircle, 
  Lightning 
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { user, logout, simulateSessionExpiry } = useAuth();
  const navigate = useNavigate();

  // Active Session Lifetime Countdown (Rule 7)
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    if (!user?.sessionExpiry) return;

    const updateTimer = () => {
      const diffMs = user.sessionExpiry - Date.now();
      if (diffMs <= 0) {
        setRemainingTime('Expired');
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Read saved listings submissions
  const submissionsCount = (() => {
    try {
      const stored = localStorage.getItem('estateone_submitted_listings');
      return stored ? JSON.parse(stored).length : 0;
    } catch {
      return 0;
    }
  })();

  const handleSimulateExpiry = () => {
    simulateSessionExpiry();
    navigate('/login');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumbs 
        items={[
          { label: 'Account overview' }
        ]} 
        className="mb-6"
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-0.5">
              <ShieldCheck size={14} weight="fill" className="mr-1" />
              <span>Protected session verified</span>
            </Badge>
          </div>
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Account and session management
          </h1>
          <p className="body-4 text-slate-500 mt-1">
            Manage your verified account credentials, security preferences, and session controls.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button size="sm" type="button" variant="outline" onClick={logout} className="rounded-2xl border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-2" >
            <SignOut size={16} />
            <span>Sign out</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card & Session Health */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-6">
            
            {/* User Identity Spotlight */}
            <div className="flex items-center gap-4">
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                alt={user?.name || 'User'} 
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-blue/20"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="title-2 font-bold text-brand-navy truncate">
                    {user?.name || 'EstateOne Member'}
                  </h2>
                  <ShieldCheck size={20} className="text-brand-blue shrink-0" weight="fill" />
                </div>
                <p className="caption-2 text-slate-500 capitalize">
                  Verified member {user?.company ? `• ${user.company}` : ''}
                </p>
                <Badge variant="outline" className="mt-1.5 text-caption bg-slate-50 text-slate-600 font-mono">
                  ID: {user?.id}
                </Badge>
              </div>
            </div>

            {/* Contact Details */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Envelope size={16} className="text-slate-400" />
                <span className="font-medium text-brand-navy">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-slate-400" />
                <span className="font-medium text-brand-navy">{user?.phone || 'N/A'}</span>
              </div>
            </div>

            {/* Rule 7: Active Session Information Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-navy flex items-center gap-1.5">
                  <Clock size={16} className="text-brand-blue" weight="fill" />
                  <span>Active session duration</span>
                </span>
                <span className="font-mono font-semibold text-brand-blue">
                  {remainingTime || 'Checking...'}
                </span>
              </div>
              <p className="caption-3 text-slate-600 leading-relaxed">
                Sessions automatically expire after 2 hours of inactivity to prevent unauthorized access.
              </p>

              {/* Session Expiry Test Trigger (Rule 7 Verification) */}
              <div className="pt-1">
                <Button size="sm"
                  type="button"
                  variant="outline"
                  onClick={handleSimulateExpiry}
                  className="w-full rounded-xl text-small font-semibold border-blue-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-brand-navy transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lightning size={14} className="text-amber-500" />
                  <span>Simulate session expiration</span>
                </Button>
              </div>
            </div>

          </Card>
        </div>

        {/* Right Column: Portal Shortcuts & Protected Activities */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-8 rounded-3xl bg-white shadow-xs border-0 space-y-6">
            <div>
              <h2 className="title-2 font-bold text-brand-navy">
                Verified member activity
              </h2>
              <p className="caption-2 text-slate-500 mt-1">
                Quick actions connected to your verified profile
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Shortcut 1: List Property */}
              <Link 
                to="/list-property"
                className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-brand-blue/30 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-brand-navy group-hover:text-brand-blue mb-3">
                  <PlusCircle size={20} weight="bold" />
                </div>
                <h3 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue">
                  List a property
                </h3>
                <p className="caption-3 text-slate-500 mt-1 leading-relaxed">
                  Submit high end residential or commercial property for RERA verification.
                </p>
              </Link>

              {/* Shortcut 2: My Submissions */}
              <Link 
                to="/list-property"
                className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-brand-blue/30 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-brand-navy group-hover:text-brand-blue mb-3">
                  <Buildings size={20} weight="bold" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue">
                    My submissions
                  </h3>
                  <Badge variant="outline" className="bg-white text-small font-semibold text-slate-700">
                    {submissionsCount}
                  </Badge>
                </div>
                <p className="caption-3 text-slate-500 mt-1 leading-relaxed">
                  Track verification status, review comments, and administrative approvals.
                </p>
              </Link>

              {/* Shortcut 3: Saved Properties */}
              <Link 
                to="/saved-properties"
                className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-brand-blue/30 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-brand-navy group-hover:text-brand-blue mb-3">
                  <Heart size={20} weight="bold" />
                </div>
                <h3 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue">
                  Saved shortlists
                </h3>
                <p className="caption-3 text-slate-500 mt-1 leading-relaxed">
                  Review bookmarked luxury penthouses, villas, and prime plots.
                </p>
              </Link>

              {/* Shortcut 4: Security Reset */}
              <Link 
                to="/reset-password"
                className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-brand-blue/30 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-brand-navy group-hover:text-brand-blue mb-3">
                  <Key size={20} weight="bold" />
                </div>
                <h3 className="caption-1 font-bold text-brand-navy group-hover:text-brand-blue">
                  Update password
                </h3>
                <p className="caption-3 text-slate-500 mt-1 leading-relaxed">
                  Change your password in compliance with security requirements.
                </p>
              </Link>

            </div>

            {/* Compliance Guarantee */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck size={20} className="text-brand-gold shrink-0" weight="fill" />
              <span>
                Your session is protected with end-to-end tokenization and conforms with the Digital Personal Data Protection (DPDP) Act 2023.
              </span>
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
}
