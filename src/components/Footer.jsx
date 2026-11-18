import React from 'react';
import { ShieldCheck, MapPin, Envelope, Phone } from '@phosphor-icons/react';
import Logo from './Logo';

export default function Footer({ onOpenLegal, onCitySelect }) {
  const cities = ['Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi NCR', 'Pune', 'Chennai'];

  return (
    <footer className="bg-white/80 backdrop-blur-2xl border-t border-white/80 pt-16 pb-12 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            
            <p className="body-5 text-brand-muted max-w-sm mb-6 leading-relaxed">
              India premier verified real estate marketplace connecting genuine buyers and tenants with verified property owners, builders, and licensed advisors.
            </p>

            <div className="space-y-2 text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-blue" />
                <span>Bandra Kurla Complex, Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope size={16} className="text-brand-blue" />
                <span>contact@estateone.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-brand-blue" />
                <span>+91 22 6120 4400</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="title-3 text-brand-navy font-semibold mb-4">
              Explore cities
            </h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              {cities.map((city) => (
                <li key={city}>
                  <button
                    type="button"
                    onClick={() => onCitySelect(city)}
                    className="hover:text-brand-navy transition-brand-fast focus-visible:outline-none focus-visible:underline cursor-pointer"
                  >
                    Properties in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification Protocol */}
          <div>
            <h4 className="title-3 text-brand-navy font-semibold mb-4">
              Trust and safety
            </h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li>
                <a href="#verification" className="hover:text-brand-navy transition-brand-fast">
                  RERA verification protocol
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-navy transition-brand-fast">
                  Visit scheduling policy
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-brand-navy transition-brand-fast">
                  Zero hidden fee standard
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-brand-navy transition-brand-fast text-left cursor-pointer"
                >
                  Seller listing terms
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="title-3 text-brand-navy font-semibold mb-4">
              Legal documents
            </h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-brand-navy transition-brand-fast text-left cursor-pointer"
                >
                  Privacy policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-brand-navy transition-brand-fast text-left cursor-pointer"
                >
                  Terms and conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('rera')}
                  className="hover:text-brand-navy transition-brand-fast text-left cursor-pointer"
                >
                  RERA disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar in Frosted Dock (Borderless) */}
        <div className="py-6 px-5 rounded-2xl bg-white/70 backdrop-blur-md border-0 shadow-xs text-xs text-brand-muted leading-relaxed mb-6">
          <p className="mb-2 font-medium text-brand-navy flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-brand-blue" />
            <span>Important platform disclaimer</span>
          </p>
          <p>
            EstateOne provides verified property discovery tools and connects property seekers with verified owners and authorized representatives. EstateOne does not guarantee property ownership, legal title, investment returns, or the accuracy of independently supplied information without formal verification. Prospective buyers and renters are advised to carry out independent title search and legal verification through competent legal practitioners before entering into binding agreements.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-2">
          <span>&copy; {new Date().getFullYear()} EstateOne Technologies Pvt Ltd. All rights reserved.</span>
          <span>Designed with verified standards for Indian real estate.</span>
        </div>

      </div>
    </footer>
  );
}
