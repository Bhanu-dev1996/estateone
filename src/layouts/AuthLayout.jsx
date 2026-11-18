import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  LockSimple, 
  CheckCircle,
  Question
} from '@phosphor-icons/react';
import Logo from '../components/Logo';

/**
 * AuthLayout (Dedicated Authentication Screen Layout)
 * Keeps users completely focused on signing in, registering, or recovering their accounts
 * by stripping away full website navigation menus, search modals, and multi-column footers.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-brand-text relative overflow-x-hidden selection:bg-brand-blue selection:text-white">
      
      {/* Soft Apple Ambient Glow Orbs for Glass Diffusion */}
      <div className="fixed top-[-5%] left-[-5%] w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[550px] h-[550px] bg-amber-50/50 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Focused Auth Top Bar */}
      <header className="relative z-20 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90">
            <Logo size="md" />
          </Link>

          {/* Back to Website Action */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-brand-navy hover:bg-slate-100/80 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} weight="bold" />
            <span className="hidden sm:inline">Back to website</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* Main Focus Stage: Child Auth Views (Login, Register, OTP, Forgot, Reset) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto">
          <Outlet />

          {/* Trust Guarantees beneath form */}
          <div className="mt-6 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={14} weight="fill" className="text-brand-blue" />
              <span>RERA verified marketplace</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LockSimple size={14} weight="fill" className="text-brand-blue" />
              <span>Privacy protected credentials</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} weight="fill" className="text-brand-blue" />
              <span>Zero spam policy</span>
            </span>
          </div>
        </div>
      </main>

      {/* Minimalist Auth Footer */}
      <footer className="relative z-20 w-full border-t border-slate-200/60 bg-white/50 backdrop-blur-md py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="caption-2 text-slate-500">
            © 2026 EstateOne Verified Realty. Demonstration concept.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/privacy-policy" className="hover:text-brand-navy transition-colors">
              Privacy policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/terms-and-conditions" className="hover:text-brand-navy transition-colors">
              Terms and conditions
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/faq" className="hover:text-brand-navy transition-colors">
              Help and FAQ
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="hover:text-brand-navy transition-colors">
              Contact support
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
