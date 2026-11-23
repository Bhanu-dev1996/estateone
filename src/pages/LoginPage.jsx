import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Envelope, 
  Eye, 
  EyeSlash, 
  WarningCircle, 
  Clock, 
  ArrowRight,
  UserCheck
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { MASKED_AUTH_MESSAGES } from '../lib/authSecurity';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { 
    login, 
    intendedDestination, 
    sessionExpiredNotice, 
    clearSessionExpiredNotice 
  } = useAuth();

  // Clear errors when user types
  const handleIdentityChange = (e) => {
    setEmailOrPhone(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  // Form submission with sensitive information masking (Rule 3)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = login(emailOrPhone, password);

      if (!res.success) {
        // Enforce generic message (Never reveal account existence or credential discrepancy)
        setErrorMessage(res.error || MASKED_AUTH_MESSAGES.INVALID_CREDENTIALS);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        // Navigate to preserved intended destination per Rule 6
        navigate(res.destination || '/', { replace: true });
      }
    }, 400);
  };

  // Quick Demo Account Pre-fill for reviewer convenience
  const handleQuickFill = (email, pass) => {
    setEmailOrPhone(email);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-lg mx-auto text-left">
      <Card className="p-8 sm:p-10 rounded-3xl bg-white shadow-xl border-0 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-2xs mb-2">
            <Lock size={24} weight="bold" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-caption text-slate-500 leading-snug">
            Access your saved listings, direct developer enquiries, and listing manager
          </p>
        </div>

        <div className="estate-form-surface space-y-4">
        {/* Rule 7: Graceful Session Expiry Notification */}
        {sessionExpiredNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-caption leading-snug flex items-start gap-2.5">
            <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <span className="font-semibold block">Session expired</span>
              <span>Your previous session timed out for your security. Please sign in again. We preserved your place.</span>
            </div>
            <button 
              type="button" 
              onClick={clearSessionExpiredNotice} 
              className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Rule 6: Intended Destination Hint */}
        {intendedDestination && !sessionExpiredNotice && (
          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-caption leading-snug flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-blue shrink-0" weight="fill" />
            <span className="truncate">
              Sign in to return directly to <strong className="font-semibold">{intendedDestination}</strong>
            </span>
          </div>
        )}

        {/* Rule 3: Error Masking Alert (No sensitive details exposed) */}
        {errorMessage && (
          <div 
            role="alert" 
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-caption leading-snug flex items-start gap-2.5 animate-fadeIn"
          >
            <WarningCircle size={20} className="text-rose-600 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <span className="font-semibold block">Authentication error</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-identity">
              Email or mobile number
            </Label>
            <div className="relative">
              <Input
                id="login-identity"
                type="text"
                required
                autoComplete="username"
                placeholder="e.g. you@example.com or +91 98201 11223"
                value={emailOrPhone}
                onChange={handleIdentityChange}
                className="rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 focus:bg-white focus:border-brand-blue transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">
                Password
              </Label>
              <Link 
                to="/forgot-password" 
                className="text-caption font-semibold text-brand-blue hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
            
            {/* Rule 2: Password show / hide support */}
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your account password"
                value={password}
                onChange={handlePasswordChange}
                className="rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 pr-11 focus:bg-white focus:border-brand-blue transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer p-1"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" size="sm" disabled={isSubmitting} className="w-full rounded-2xl shadow-xs">
            {isSubmitting ? 'Authenticating...' : 'Sign in to account'}
          </Button>
        </form>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="caption-3 font-semibold text-slate-400 uppercase tracking-wider">
              Try a sample account
            </span>
            <Badge variant="outline" className="text-caption font-normal text-slate-500 py-0 shrink-0">
              Password@123
            </Badge>
          </div>
          <p className="text-caption text-slate-500 leading-snug">
            Register with any email and mobile, or use a demo address below. Every account is the same member type.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickFill('demo1@estateone.in', 'Password@123')}
            className="w-full rounded-2xl border-slate-200 text-small font-medium"
          >
            Fill demo1@estateone.in
          </Button>
        </div>

        {/* Registration Redirection */}
        <div className="text-center pt-2 border-t border-slate-100 text-caption text-slate-500">
          <span>Do not have an account? </span>
          <Link to="/register" className="font-semibold text-brand-blue hover:underline cursor-pointer">
            Create an account
          </Link>
        </div>

      </Card>
    </div>
  );
}
