import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Envelope, Phone, Lock } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';

export default function RegisterPage() {
  const [role, setRole] = useState('Buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/verify-otp');
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto text-left">
      <Card className="p-8 rounded-3xl bg-white/85 backdrop-blur-2xl border-0 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold">Create your account</h1>
          <p className="caption-1 text-brand-muted">
            Join India premier verified real estate network
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="caption-1 font-semibold text-brand-navy block mb-2">I am joining as a</label>
          <div className="grid grid-cols-3 gap-2">
            {['Buyer', 'Tenant', 'Owner / Agent'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 px-1 text-xs rounded-xl font-semibold border cursor-pointer transition-all ${
                  role === r
                    ? 'border-brand-navy bg-brand-navy text-white shadow-xs'
                    : 'border-slate-200 bg-white text-brand-navy hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="caption-1 font-semibold text-brand-navy block mb-1">Full name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="caption-1 font-semibold text-brand-navy block mb-1">Email address</label>
            <input
              type="email"
              required
              placeholder="e.g. ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="caption-1 font-semibold text-brand-navy block mb-1">Mobile number</label>
            <input
              type="tel"
              required
              placeholder="+91 98000 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="caption-1 font-semibold text-brand-navy block mb-1">Create password</label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl py-3 text-xs font-semibold cursor-pointer">
            Continue with verification
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-black/5 text-xs text-brand-muted">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-brand-blue hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
