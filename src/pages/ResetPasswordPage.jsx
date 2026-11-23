import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  CheckCircle, 
  Check, 
  Eye, 
  EyeSlash, 
  WarningCircle, 
  ArrowLeft 
} from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Logo from '../components/Logo';
import { 
  PASSWORD_REQUIREMENTS, 
  checkPasswordSecurity 
} from '../lib/authSecurity';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const navigate = useNavigate();

  // Password Security Analysis (Rule 1)
  const passwordStatus = useMemo(() => {
    return checkPasswordSecurity(password);
  }, [password]);

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleReset = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passwordStatus.isValid) {
      setErrorMsg('Please fulfill all password security requirements before saving.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsCompleted(true);
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
            Create new password
          </h1>
          <p className="text-caption text-slate-500 leading-snug">
            Set a new, strong password to secure your verified real estate account
          </p>
        </div>

        {isCompleted ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle size={32} weight="fill" />
            </div>

            <div className="space-y-1">
              <h2 className="title-2 font-bold text-brand-navy">
                Password successfully updated
              </h2>
              <p className="text-caption text-slate-500 leading-relaxed max-w-md mx-auto">
                Your new password has been securely registered. You can now sign in using your updated credentials.
              </p>
            </div>

            <div className="pt-3">
              <Link to="/login" className="block">
                <Button size="sm" className="w-full rounded-2xl shadow-xs">
                  Sign in now
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="estate-form-surface space-y-4">
            {errorMsg && (
              <div 
                role="alert" 
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-caption leading-snug flex items-start gap-2.5 animate-fadeIn"
              >
                <WarningCircle size={20} className="text-rose-600 shrink-0 mt-0.5" weight="fill" />
                <div className="flex-1">
                  <span className="font-semibold block">Password validation</span>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* Rule 1: Configured Password Requirements & Strength */}
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Enter secure new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setHasInteracted(true);
                    setErrorMsg('');
                  }}
                  className="rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 pr-11 focus:bg-white focus:border-brand-blue"
                />
                {/* Rule 2: Show/Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer p-1"
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
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

              {/* Security Checklist (Rule 1) */}
              {(hasInteracted || password.length > 0) && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 mt-2">
                  <span className="caption-3 font-semibold text-slate-500 block uppercase tracking-wider">
                    Required security checks
                  </span>
                  <ul className="space-y-1 text-caption leading-snug">
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

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className={`rounded-2xl border-slate-200 bg-slate-50 text-brand-navy py-3 px-3.5 pr-11 focus:bg-white focus:border-brand-blue ${
                    confirmPassword && !passwordsMatch ? 'border-rose-300 focus:border-rose-500' : ''
                  }`}
                />
                {/* Rule 2: Show/Hide Toggle */}
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
                <span className="wizard-field-error block">
                  Passwords do not match
                </span>
              )}
            </div>

            <Button type="submit" size="sm" disabled={!passwordStatus.isValid || !passwordsMatch || !confirmPassword} className="w-full rounded-2xl shadow-xs">
              Update and secure account
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link 
            to="/login" 
            className="text-caption font-semibold text-slate-600 flex items-center justify-center gap-1.5 hover:text-brand-navy cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to sign in</span>
          </Link>
        </div>

      </Card>
    </div>
  );
}
