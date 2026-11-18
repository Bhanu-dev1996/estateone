import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Envelope, Eye, EyeSlash } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // Return user to intended destination per PRD 4.2.5
    const nextRoute = login(emailOrPhone || 'user@estateone.in');
    navigate(nextRoute);
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto text-left">
      <Card className="p-8 rounded-3xl bg-white/85 backdrop-blur-2xl border-0 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold">Welcome back</h1>
          <p className="caption-1 text-slate-500">
            Sign in to manage your saved properties, visit bookings, and enquiries
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="caption-1 font-semibold text-brand-navy block mb-1">
              Email or mobile number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. rahul@example.com or +91..."
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="caption-1 font-semibold text-brand-navy">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-brand-blue hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer"
              >
                {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-2xl py-3 text-xs font-semibold cursor-pointer">
            Sign in to account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Do not have an account? </span>
          <Link to="/register" className="font-semibold text-brand-blue hover:underline">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}
