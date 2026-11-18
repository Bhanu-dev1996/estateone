import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Envelope, CheckCircle, ArrowLeft } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto text-left">
      <Card className="p-8 rounded-3xl bg-white/85 backdrop-blur-2xl border-0 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold">Reset your password</h1>
          <p className="caption-1 text-brand-muted">
            Enter your registered email or mobile number to receive a verification OTP
          </p>
        </div>

        {sent ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={28} weight="fill" />
            </div>
            <p className="body-4 text-brand-navy font-semibold">OTP dispatched</p>
            <p className="caption-1 text-brand-muted">
              We have sent a 6 digit code to {emailOrPhone}. Please check your phone or inbox.
            </p>
            <div className="pt-2">
              <Link to="/verify-otp">
                <Button className="w-full">Enter verification code</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="caption-1 font-semibold text-brand-navy block mb-1">Email or mobile number</label>
              <input
                type="text"
                required
                placeholder="e.g. rahul@example.com or +91..."
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <Button type="submit" className="w-full rounded-xl py-3 text-xs font-semibold cursor-pointer">
              Send verification code
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-black/5">
          <Link to="/login" className="text-xs font-semibold text-brand-navy flex items-center justify-center gap-1.5 hover:text-brand-blue">
            <ArrowLeft size={14} />
            <span>Return to sign in</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}
