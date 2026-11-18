import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const handleChange = (val, idx) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    // auto focus next
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto text-left">
      <Card className="p-8 rounded-3xl bg-white/85 backdrop-blur-2xl border-0 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold">Verify your code</h1>
          <p className="caption-1 text-brand-muted">
            Enter the 6 digit verification code sent to your registered number
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            ))}
          </div>

          <Button type="submit" className="w-full rounded-xl py-3 text-xs font-semibold cursor-pointer">
            Confirm and continue
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-black/5 text-xs text-brand-muted">
          <span>Did not receive code? </span>
          <button type="button" className="font-semibold text-brand-blue hover:underline cursor-pointer">
            Resend OTP (30s)
          </button>
        </div>
      </Card>
    </div>
  );
}
