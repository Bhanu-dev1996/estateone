import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Eye, 
  EyeSlash, 
  WarningCircle, 
  ArrowRight,
  Lock,
  User,
  Envelope,
  Phone
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PhoneInput } from '../components/ui/phone-input';
import { Label } from '../components/ui/label';
import { isValidPhone } from '../lib/phone';
import { Badge } from '../components/ui/badge';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { 
  PASSWORD_REQUIREMENTS, 
  checkPasswordSecurity 
} from '../lib/authSecurity';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);

  const navigate = useNavigate();
  const { startRegistration, intendedDestination } = useAuth();

  // Password Security Analysis (Rule 1)
  const passwordStatus = useMemo(() => {
    return checkPasswordSecurity(password);
  }, [password]);

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passwordStatus.isValid) {
      setErrorMsg('Please ensure your password fulfills all security requirements below.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMsg('Please enter a valid mobile number for the selected country.');
      return;
    }

    const result = startRegistration({
      name,
      email,
      phone,
      password
    });

    if (result.success) {
      navigate('/verify-otp');
    } else {
      setErrorMsg(result.error || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-left">
      <Card className="p-8 sm:p-10 rounded-3xl bg-white shadow-xl border-0 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-2xs mb-2">
            <User size={24} weight="bold" />
          </div>
          <h1 className="heading-2 text-brand-navy font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-caption text-slate-500 leading-snug">
            Join India premier verified real estate network
          </p>
        </div>

        {/* Intended Destination Reminder if set */}
        {intendedDestination && (
          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-blue shrink-0" weight="fill" />
            <span className="truncate">
              Completing registration will open <strong className="font-semibold">{intendedDestination}</strong>
            </span>
          </div>
        )}

        {/* General Error Banner */}
        {errorMsg && (
          <div 
            role="alert" 
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn"
          >
            <WarningCircle size={20} className="text-rose-600 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <span className="font-semibold block">Incomplete details</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        <div className="estate-form-surface space-y-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reg-name" className="">
              Full name
            </Label>
            <Input
              id="reg-name"
              type="text"
              required
              placeholder="e.g. Ananya Rao"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
              className="rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 focus:bg-white focus:border-brand-blue"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email" className="">
              Email address
            </Label>
            <Input
              id="reg-email"
              type="email"
              required
              placeholder="e.g. ananya@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              className="rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 focus:bg-white focus:border-brand-blue"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-phone" className="">
              Mobile number (for SMS verification)
            </Label>
            <PhoneInput
              id="reg-phone"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrorMsg('');
              }}
              className="rounded-2xl border-slate-200 bg-slate-50"
              inputClassName="rounded-2xl border-0 bg-slate-50 py-3 focus:bg-white"
            />
          </div>

          {/* Rule 1: Configured Password Security & Strength */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-pass" className="">
              Create password
            </Label>
            <div className="relative">
              <Input
                id="reg-pass"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasInteractedWithPassword(true);
                  setErrorMsg('');
                }}
                className="rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 pr-11 focus:bg-white focus:border-brand-blue"
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

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-small">
                  <span className="text-slate-500 font-medium">Password strength</span>
                  <span className={`font-semibold ${
                    passwordStatus.strength === 'strong' ? 'text-emerald-600' :
                    passwordStatus.strength === 'medium' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {passwordStatus.strengthLabel} ({passwordStatus.criteriaMet}/5)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${passwordStatus.criteriaMet >= 1 ? passwordStatus.strengthColor : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${passwordStatus.criteriaMet >= 3 ? passwordStatus.strengthColor : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${passwordStatus.criteriaMet === 5 ? passwordStatus.strengthColor : 'bg-slate-200'}`} />
                </div>
              </div>
            )}

            {/* Interactive Security Checklist (Rule 1) */}
            {(hasInteractedWithPassword || password.length > 0) && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 mt-2">
                <span className="caption-3 font-semibold text-slate-500 block uppercase tracking-wider">
                  Security requirements
                </span>
                <ul className="space-y-1 text-xs">
                  {PASSWORD_REQUIREMENTS.map((req) => {
                    const isMet = req.regex.test(password);
                    return (
                      <li key={req.id} className="flex items-center gap-2">
                        {isMet ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check size={12} weight="bold" />
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          </span>
                        )}
                        <span className={isMet ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                          {req.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm-pass" className="">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="reg-confirm-pass"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                className={`rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 pr-11 focus:bg-white focus:border-brand-blue ${
                  confirmPassword && !passwordsMatch ? 'border-rose-300 focus:border-rose-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer p-1"
              >
                {showConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <span className="caption-3 text-rose-500 font-medium block">
                Passwords do not match
              </span>
            )}
          </div>

          <Button type="submit" size="sm" className="w-full rounded-2xl shadow-xs">
            Continue with OTP verification
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Button>
        </form>
        </div>

        {/* Existing Account Redirection */}
        <div className="text-center pt-2 border-t border-slate-100 text-caption text-slate-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-brand-blue hover:underline cursor-pointer">
            Sign in
          </Link>
        </div>

      </Card>
    </div>
  );
}
