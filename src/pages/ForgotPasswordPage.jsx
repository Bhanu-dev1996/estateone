import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Envelope, 
  CheckCircle, 
  ArrowLeft, 
  ShieldCheck, 
  WarningCircle 
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { MASKED_AUTH_MESSAGES } from '../lib/authSecurity';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [dispatched, setDispatched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { dispatchPasswordReset } = useAuth();

  const handleSend = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Rule 3: Error masking (never reveal whether the account exists)
      dispatchPasswordReset(emailOrPhone);
      setIsSubmitting(false);
      setDispatched(true);
    }, 450);
  };

  return (
    <div className="w-full max-w-lg mx-auto text-left">
      <Card className="p-8 sm:p-10 rounded-3xl bg-white shadow-xl border-0 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-2xs mb-2">
            <Envelope size={24} weight="bold" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold tracking-tight">
            Reset your password
          </h1>
          <p className="caption-1 text-slate-500">
            Enter your registered email address or mobile number to receive a secure verification code
          </p>
        </div>

        {dispatched ? (
          /* Rule 3 Masked Dispatch Notice (Prevents Account Enumeration) */
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle size={32} weight="fill" />
            </div>

            <div className="space-y-1">
              <h2 className="title-2 font-bold text-brand-navy">
                Dispatch request processed
              </h2>
              <p className="caption-1 text-slate-500 leading-relaxed max-w-md mx-auto">
                {MASKED_AUTH_MESSAGES.ACCOUNT_RESET_DISPATCHED}
              </p>
            </div>

            <div className="pt-3 space-y-2.5">
              <Link to="/verify-otp" className="block">
                <Button className="w-full rounded-2xl py-3 text-xs font-semibold bg-brand-navy hover:bg-slate-900 text-white cursor-pointer">
                  Enter verification code
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => setDispatched(false)}
                className="text-xs font-medium text-slate-500 hover:text-brand-navy cursor-pointer"
              >
                Try another email or number
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reset-identity" className="caption-1 font-semibold text-brand-navy">
                Email address or mobile number
              </Label>
              <Input
                id="reset-identity"
                type="text"
                required
                placeholder="e.g. rahul@example.com or +91 98000 00000"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="rounded-2xl border-slate-200 bg-slate-50 text-xs text-brand-navy py-3 px-3.5 focus:bg-white focus:border-brand-blue"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !emailOrPhone.trim()}
              className="w-full rounded-2xl py-3 text-xs font-semibold bg-brand-navy hover:bg-slate-900 text-white cursor-pointer transition-all shadow-xs"
            >
              {isSubmitting ? 'Dispatching code...' : 'Send verification code'}
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link 
            to="/login" 
            className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 hover:text-brand-navy cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to sign in</span>
          </Link>
        </div>

      </Card>
    </div>
  );
}
