import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto text-left">
      <Card className="p-8 rounded-3xl bg-white/85 backdrop-blur-2xl border-0 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold">Create new password</h1>
          <p className="caption-1 text-brand-muted">
            Choose a strong password with at least 8 characters
          </p>
        </div>

        {done ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={28} weight="fill" />
            </div>
            <p className="body-4 text-brand-navy font-semibold">Password updated</p>
            <p className="caption-1 text-brand-muted">
              Your password has been reset successfully. You can now sign in with your new credentials.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button className="w-full">Sign in now</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="caption-1 font-semibold text-brand-navy block mb-1">New password</label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="caption-1 font-semibold text-brand-navy block mb-1">Confirm password</label>
              <input
                type="password"
                required
                placeholder="Re enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <Button type="submit" className="w-full rounded-xl py-3 text-xs font-semibold cursor-pointer">
              Save new password
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
