import React, { useState, useEffect } from 'react';
import { List, ShieldCheck } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import Logo from './Logo';

export default function Navbar({ onExploreClick, onContactClick }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#properties');

  const navLinks = [
    { label: 'Properties', href: '#properties' },
    { label: 'Why EstateOne', href: '#why-us' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Verification', href: '#verification' },
    { label: 'FAQ', href: '#faq' },
  ];

  // Robust scroll spy to update active nav link as user scrolls
  useEffect(() => {
    const sectionIds = ['properties', 'why-us', 'how-it-works', 'verification', 'faq'];

    const handleScroll = () => {
      // Offset for fixed top floating navigation bar
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${id}`);
            return;
          }
        }
      }
      setActiveSection('#properties');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setActiveSection(href);
    setSheetOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      <nav 
        aria-label="Main navigation" 
        className="pointer-events-auto w-full max-w-5xl bg-white/75 backdrop-blur-2xl backdrop-saturate-200 border border-white/70 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/50 px-4 py-2 flex items-center justify-between transition-brand"
      >
        {/* Brand Logo with Custom E1 Architectural Monogram */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('#properties');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-full px-1 py-0.5"
        >
          <Logo size="sm" />
        </a>

        {/* Desktop Navigation Links with Active Color Styling */}
        <ul className="hidden md:flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-full border border-slate-200/40">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue cursor-pointer ${
                    isActive
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'text-brand-navy/70 hover:text-brand-navy hover:bg-white/80'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Action & shadcn Sheet Drawer for Mobile */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => {
              setActiveSection('#properties');
              onExploreClick();
            }}
            size="sm"
            className="rounded-full shadow-[0_4px_14px_rgba(20,43,74,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck size={16} weight="bold" className="text-brand-gold" />
            <span>Explore properties</span>
          </Button>

          {/* shadcn Sheet Component for Mobile Navigation */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="md:hidden p-2 rounded-full text-brand-navy hover:bg-white/80 transition-brand-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue cursor-pointer"
              >
                <List size={20} weight="bold" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col justify-between bg-white/90 backdrop-blur-2xl backdrop-saturate-200 border-l border-white/60">
              <div>
                <SheetHeader className="mb-6">
                  <Logo size="sm" />
                  <SheetTitle className="sr-only">EstateOne Navigation</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-1.5 py-4">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.href;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`text-sm py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-navy text-white font-semibold shadow-xs'
                            : 'text-brand-navy hover:bg-slate-100 font-medium'
                        }`}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setSheetOpen(false);
                    setActiveSection('#properties');
                    onExploreClick();
                  }}
                  className="w-full cursor-pointer"
                >
                  Explore properties
                </Button>
                <p className="caption-2 text-center text-brand-muted">
                  India premier verified real estate marketplace
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
