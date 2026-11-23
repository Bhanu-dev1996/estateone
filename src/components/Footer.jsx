import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Envelope, 
  Phone, 
  ArrowUp,
  LinkedinLogo,
  TwitterLogo,
  InstagramLogo,
  YoutubeLogo,
  CheckCircle,
  WarningCircle,
  CaretDown,
  CaretUp,
  PaperPlaneTilt
} from '@phosphor-icons/react';
import Logo from './Logo';
import { cn } from '../lib/utils';

export default function Footer({ onCitySelect, className = '' }) {
  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'duplicate' | 'error'
  const [subscribedEmails, setSubscribedEmails] = useState(['vip@estateone.in', 'subscriber@example.com']);

  // Mobile Accordion open state for columns
  const [openSections, setOpenSections] = useState({
    explore: false,
    cities: false,
    owners: false,
    company: false,
    support: false
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setStatus('error');
      return;
    }

    // Duplicate email handling
    if (subscribedEmails.includes(cleanEmail)) {
      setStatus('duplicate');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setSubscribedEmails((prev) => [...prev, cleanEmail]);
      setStatus('success');
      setEmail('');
    }, 600);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularCities = [
    { name: 'Mumbai', href: '/buy?city=Mumbai' },
    { name: 'Bengaluru', href: '/buy?city=Bengaluru' },
    { name: 'Delhi NCR', href: '/buy?city=Delhi NCR' },
    { name: 'Hyderabad', href: '/buy?city=Hyderabad' },
    { name: 'Pune', href: '/buy?city=Pune' },
    { name: 'Chennai', href: '/buy?city=Chennai' }
  ];

  return (
    <footer
      className={cn(
        'w-full bg-[#142B4A] text-slate-300 pt-16 pb-12 px-4 border-t border-white/10 text-left relative overflow-hidden z-10',
        className
      )}
    >
      
      {/* Subtle Architectural Glow Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A46D]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* =========================================================================
            Newsletter Subscription Section per PRD 3.3
           ========================================================================= */}
        <div className="mb-16 p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-2 block">
              Market intelligence
            </span>
            <h3 className="text-h4 text-white font-semibold tracking-tight mb-2">
              Subscribe to EstateOne property briefings
            </h3>
            <p className="body-4 text-slate-300 leading-relaxed">
              Curated off market residences, state RERA legal analyses, and architectural previews delivered fortnightly.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <input
                  type="email"
                  aria-label="Email address for property briefings"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-[#C5A46D] focus:bg-white/15 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl bg-[#C5A46D] hover:bg-[#d6b47c] text-[#142B4A] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <PaperPlaneTilt size={14} weight="bold" />
                  </>
                )}
              </button>
            </form>

            {/* Validation & Status Notifications */}
            {status === 'success' && (
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-emerald-400 font-medium">
                <CheckCircle size={16} weight="fill" />
                <span>Thank you for subscribing to EstateOne property briefings.</span>
              </div>
            )}
            {status === 'duplicate' && (
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-300 font-medium">
                <WarningCircle size={16} weight="fill" />
                <span>This email address is already subscribed to updates.</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-300 font-medium">
                <WarningCircle size={16} weight="fill" />
                <span>Please provide a valid email address.</span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            Main Footer Navigation Grid — 1:1 Matched to PRD 3.3
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-14">
          
          {/* Section 1: Brand Info & Social Media Links per PRD 3.3 */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <Logo size="md" theme="dark" />
            </Link>

            <p className="caption-1 font-semibold text-[#C5A46D]">
              Find a Place That Feels Like Home.
            </p>

            <p className="body-5 text-slate-300 leading-relaxed max-w-sm">
              India premier verified real estate marketplace connecting genuine buyers and tenants with verified property owners, builders, and licensed advisors.
            </p>

            {/* Verified Business Contact Information */}
            <div className="space-y-2 pt-2 text-small text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#C5A46D] shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#C5A46D] shrink-0" />
                <a href="tel:+912261204400" className="hover:text-white transition-colors">
                  +91 22 6120 4400
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Envelope size={16} className="text-[#C5A46D] shrink-0" />
                <a href="mailto:contact@estateone.in" className="hover:text-white transition-colors">
                  contact@estateone.in
                </a>
              </div>
            </div>

            {/* Social Platform Links per PRD 3.3 (Opening in new tabs) */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EstateOne on LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <LinkedinLogo size={16} weight="fill" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EstateOne on X Twitter"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <TwitterLogo size={16} weight="fill" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EstateOne on Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <InstagramLogo size={16} weight="fill" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EstateOne on YouTube"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <YoutubeLogo size={16} weight="fill" />
              </a>
            </div>
          </div>

          {/* Section 2: Buy, Rent and Commercial Links & Property Types per PRD 3.3 */}
          <div>
            <div 
              onClick={() => toggleSection('explore')}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="title-3 text-white font-bold mb-0 md:mb-4">
                Explore listings
              </h4>
              <span className="md:hidden text-slate-400">
                {openSections.explore ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </span>
            </div>
            <ul className={`space-y-2.5 text-small text-slate-300 mt-3 md:mt-0 ${openSections.explore ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link to="/buy" onClick={scrollToTop} className="hover:text-white transition-colors">Buy properties</Link>
              </li>
              <li>
                <Link to="/rent" onClick={scrollToTop} className="hover:text-white transition-colors">Rent properties</Link>
              </li>
              <li>
                <Link to="/commercial" onClick={scrollToTop} className="hover:text-white transition-colors">Commercial spaces</Link>
              </li>
              <li>
                <Link to="/buy?type=Apartment" onClick={scrollToTop} className="hover:text-white transition-colors">Apartments & flats</Link>
              </li>
              <li>
                <Link to="/buy?type=Villa" onClick={scrollToTop} className="hover:text-white transition-colors">Luxury villas</Link>
              </li>
              <li>
                <Link to="/buy?type=Penthouse" onClick={scrollToTop} className="hover:text-white transition-colors">Penthouses</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Popular Cities per PRD 3.3 */}
          <div>
            <div 
              onClick={() => toggleSection('cities')}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="title-3 text-white font-bold mb-0 md:mb-4">
                Popular cities
              </h4>
              <span className="md:hidden text-slate-400">
                {openSections.cities ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </span>
            </div>
            <ul className={`space-y-2.5 text-small text-slate-300 mt-3 md:mt-0 ${openSections.cities ? 'block' : 'hidden md:block'}`}>
              {popularCities.map((city) => (
                <li key={city.name}>
                  <Link to={city.href} onClick={scrollToTop} className="hover:text-white transition-colors">
                    Properties in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: For Property Owners & Professionals per PRD 3.3 */}
          <div>
            <div 
              onClick={() => toggleSection('owners')}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="title-3 text-white font-bold mb-0 md:mb-4">
                Property owners
              </h4>
              <span className="md:hidden text-slate-400">
                {openSections.owners ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </span>
            </div>
            <ul className={`space-y-2.5 text-small text-slate-300 mt-3 md:mt-0 ${openSections.owners ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link to="/list-property" onClick={scrollToTop} className="hover:text-white transition-colors font-semibold text-[#C5A46D]">
                  List your property
                </Link>
              </li>
              <li>
                <Link to="/agents" onClick={scrollToTop} className="hover:text-white transition-colors">Agents directory</Link>
              </li>
              <li>
                <Link to="/builders" onClick={scrollToTop} className="hover:text-white transition-colors">Builders directory</Link>
              </li>
              <li>
                <Link to="/compare" onClick={scrollToTop} className="hover:text-white transition-colors">Compare properties</Link>
              </li>
              <li>
                <Link to="/saved-properties" onClick={scrollToTop} className="hover:text-white transition-colors">Saved wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Section 5: Company, Help & Legal per PRD 3.3 */}
          <div>
            <div 
              onClick={() => toggleSection('company')}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="title-3 text-white font-bold mb-0 md:mb-4">
                Company & help
              </h4>
              <span className="md:hidden text-slate-400">
                {openSections.company ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </span>
            </div>
            <ul className={`space-y-2.5 text-small text-slate-300 mt-3 md:mt-0 ${openSections.company ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link to="/about" onClick={scrollToTop} className="hover:text-white transition-colors">About us</Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="hover:text-white transition-colors">Contact us</Link>
              </li>
              <li>
                <Link to="/faq" onClick={scrollToTop} className="hover:text-white transition-colors">Help center and FAQ</Link>
              </li>
              <li>
                <Link to="/blog" onClick={scrollToTop} className="hover:text-white transition-colors">Blog and guides</Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-white transition-colors">Privacy policy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" onClick={scrollToTop} className="hover:text-white transition-colors">Terms and conditions</Link>
              </li>
            </ul>
          </div>

        </div>


        {/* =========================================================================
            Bottom Bar: Dynamic Copyright per PRD 3.3, Legal Links & Back to Top
           ========================================================================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          
          {/* Dynamic Copyright per PRD 3.3 */}
          <p>© {new Date().getFullYear()} EstateOne Real Estate Technologies Private Limited. All rights reserved.</p>

          {/* Legal Navigation Links per PRD 3.3 */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-white transition-colors">Privacy policy</Link>
            <Link to="/terms-and-conditions" onClick={scrollToTop} className="hover:text-white transition-colors">Terms and conditions</Link>
            <Link to="/faq" onClick={scrollToTop} className="hover:text-white transition-colors">Help center</Link>
            <Link to="/contact" onClick={scrollToTop} className="hover:text-white transition-colors">Support</Link>
          </div>

          {/* Back to Top Control */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white button-sm font-semibold min-h-10 transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp size={14} weight="bold" />
          </button>

        </div>

      </div>
    </footer>
  );
}
