import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CaretDown, 
  ShieldCheck, 
  List, 
  PlusCircle, 
  User, 
  MagnifyingGlass, 
  X,
  MapPin,
  Buildings,
  HouseLine
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { SAMPLE_PROPERTIES, CITIES } from '../data/properties';
import Logo from './Logo';

export default function Navbar({ onExploreClick }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isBuyActive = location.pathname === '/buy';
  const isRentActive = location.pathname === '/rent';
  const isCommercialActive = location.pathname === '/commercial';
  const isAgentsActive = location.pathname === '/agents';
  const isListPropertyActive = location.pathname === '/list-property';

  const handleExplore = () => {
    if (isHome && onExploreClick) {
      onExploreClick();
    } else {
      navigate('/buy');
    }
  };

  // Search dialog filtering
  const matchingProperties = searchQuery
    ? SAMPLE_PROPERTIES.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
        <nav 
          aria-label="Main navigation" 
          className="pointer-events-auto w-full max-w-7xl bg-white/85 backdrop-blur-2xl backdrop-saturate-200 border border-white/70 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/50 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-brand"
        >
          {/* 1. EstateOne Logo (Interaction 1: Clicking navigates to Home) */}
          <Link 
            to="/" 
            onClick={() => {
              if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-full px-1 py-0.5 shrink-0 flex items-center gap-2"
          >
            <Logo size="sm" />
          </Link>

          {/* Desktop Navigation Hierarchy — 1:1 Matched to PRD 3.2 */}
          <ul className="hidden lg:flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-full border border-slate-200/40">
            
            {/* 2. Buy Dropdown (Interaction 2: navigates to Buy Properties) */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus-visible:outline-none flex items-center gap-1 cursor-pointer ${
                      isBuyActive
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'text-brand-navy/75 hover:text-brand-navy hover:bg-white/80'
                    }`}
                  >
                    <span>Buy</span>
                    <CaretDown size={11} weight="bold" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Residential for sale</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/buy" className="w-full">All properties for sale</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/buy?type=Apartment" className="w-full">Apartments and flats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/buy?type=Villa" className="w-full">Luxury villas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/buy?type=Penthouse" className="w-full">Penthouses</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            {/* 3. Rent Dropdown (Interaction 3: navigates to Rent Properties) */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus-visible:outline-none flex items-center gap-1 cursor-pointer ${
                      isRentActive
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'text-brand-navy/75 hover:text-brand-navy hover:bg-white/80'
                    }`}
                  >
                    <span>Rent</span>
                    <CaretDown size={11} weight="bold" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Rental properties</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/rent" className="w-full">All rental properties</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/rent?type=Apartment" className="w-full">Apartments for rent</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/rent?type=Villa" className="w-full">Luxury rental homes</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            {/* 4. Commercial (Interaction 4: navigates to Commercial Properties) */}
            <li>
              <Link
                to="/commercial"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus-visible:outline-none cursor-pointer ${
                  isCommercialActive
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'text-brand-navy/75 hover:text-brand-navy hover:bg-white/80'
                }`}
              >
                Commercial
              </Link>
            </li>

            {/* 5. Agents (Interaction 5: navigates to Agents directory) */}
            <li>
              <Link
                to="/agents"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus-visible:outline-none cursor-pointer ${
                  isAgentsActive
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'text-brand-navy/75 hover:text-brand-navy hover:bg-white/80'
                }`}
              >
                Agents
              </Link>
            </li>

            {/* 6. List Property (Interaction 6: opens listing submission journey) */}
            <li>
              <Link
                to="/list-property"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus-visible:outline-none flex items-center gap-1 cursor-pointer ${
                  isListPropertyActive
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'text-brand-blue hover:text-brand-navy hover:bg-white/80'
                }`}
              >
                <PlusCircle size={14} weight="bold" />
                <span>List Property</span>
              </Link>
            </li>

          </ul>

          {/* Right Action Suite per PRD 3.2: Search, Login, Explore Properties CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 7. Search Icon / Entry Point per PRD 3.2 */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search properties by city or keyword"
              className="p-2 rounded-full text-brand-navy hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center"
            >
              <MagnifyingGlass size={18} weight="bold" />
            </button>

            {/* 8. Login / Sign Up per PRD 3.2 (Interaction 7: opens login page / auth modal) */}
            <Link
              to="/login"
              className="text-xs font-semibold text-brand-navy hover:text-brand-blue px-3 py-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User size={15} />
              <span className="hidden sm:inline">Login / Sign Up</span>
              <span className="sm:hidden">Login</span>
            </Link>

            {/* 9. Primary CTA: Explore Properties per PRD 3.2 (Interaction 8: navigates to discovery) */}
            <Button
              type="button"
              onClick={handleExplore}
              size="sm"
              className="rounded-full px-4 sm:px-5 py-2 bg-brand-navy hover:bg-slate-900 text-white font-semibold shadow-[0_4px_14px_rgba(20,43,74,0.25)] flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <ShieldCheck size={15} weight="bold" className="text-brand-gold" />
              <span className="hidden sm:inline">Explore Properties</span>
              <span className="sm:hidden">Explore</span>
            </Button>

            {/* 11. Mobile Navigation Drawer Toggle (Interaction 11: slide-out drawer) */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  className="lg:hidden p-2 rounded-full text-brand-navy hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <List size={22} weight="bold" />
                </button>
              </SheetTrigger>
              
              <SheetContent side="right" className="flex flex-col justify-between bg-white/95 backdrop-blur-2xl backdrop-saturate-200 border-l border-white/60 w-[310px] text-left p-0">
                <div className="p-6 pb-2 shrink-0">
                  <SheetHeader className="mb-5">
                    <Logo size="sm" />
                    <SheetTitle className="sr-only">EstateOne Navigation</SheetTitle>
                  </SheetHeader>
                </div>

                <ScrollArea className="flex-1 px-6">
                  <div className="flex flex-col gap-1 py-1">
                    {[
                      { label: 'Home', href: '/' },
                      { label: 'Buy Properties', href: '/buy' },
                      { label: 'Rent Properties', href: '/rent' },
                      { label: 'Commercial Properties', href: '/commercial' },
                      { label: 'Agents', href: '/agents' },
                      { label: 'Builders', href: '/builders' },
                      { label: 'Compare Properties', href: '/compare' },
                      { label: 'Saved Properties', href: '/saved-properties' },
                      { label: 'About Us', href: '/about' },
                      { label: 'Blog & Property Guides', href: '/blog' },
                      { label: 'Help & FAQ', href: '/faq' },
                      { label: 'Contact Us', href: '/contact' },
                      { label: 'Login / Sign Up', href: '/login' },
                    ].map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setSheetOpen(false)}
                          className={`text-xs py-2 px-3 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? 'bg-brand-navy text-white font-semibold shadow-xs'
                              : 'text-brand-navy hover:bg-slate-100 font-medium'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Mobile Drawer Bottom Prominent CTA */}
                <div className="p-6 pt-4 border-t border-black/5 flex flex-col gap-2 shrink-0">
                  <Link to="/list-property" onClick={() => setSheetOpen(false)}>
                    <Button className="w-full text-xs font-semibold rounded-xl py-3 flex items-center justify-center gap-1.5 shadow-sm">
                      <PlusCircle size={16} weight="bold" className="text-brand-gold" />
                      <span>List Property</span>
                    </Button>
                  </Link>
                  <p className="caption-2 text-center text-brand-muted mt-0.5">
                    India premier verified real estate marketplace
                  </p>
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </nav>
      </header>

      {/* =========================================================================
          Search Dialog Entry Point per PRD 3.2
         ========================================================================= */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl p-6 bg-white/95 backdrop-blur-2xl rounded-3xl text-left border-0">
          <DialogHeader>
            <DialogTitle className="title-2 text-brand-navy font-bold flex items-center gap-2">
              <MagnifyingGlass size={20} className="text-brand-blue" />
              <span>Search verified properties</span>
            </DialogTitle>
            <DialogDescription>
              Search by locality, project title, city, or property type across India premier markets.
            </DialogDescription>
          </DialogHeader>

          {/* Search Box Input */}
          <div className="relative my-4">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="e.g. Worli, Penthouse, Villa, Gurugram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
            />
          </div>

          {/* Quick City Filters */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <span className="caption-2 font-semibold text-slate-500 mr-1">Popular:</span>
            {CITIES.filter((c) => c !== 'All cities').slice(0, 5).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSearchQuery(city)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-brand-navy transition-all cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Results List */}
          {matchingProperties.length > 0 ? (
            <div className="mt-2">
              <p className="caption-2 font-semibold text-brand-muted mb-2">Matching listings</p>
              <ScrollArea className="max-h-72 pr-2">
                <div className="space-y-2">
                  {matchingProperties.map((prop) => (
                    <Link
                      key={prop.id}
                      to={`/property/${prop.slug || prop.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100"
                    >
                      <img src={prop.images[0]} alt={prop.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="title-3 text-brand-navy font-semibold truncate">{prop.title}</p>
                        <p className="caption-2 text-brand-muted truncate">{prop.location} • {prop.bedrooms}</p>
                      </div>
                      <span className="caption-1 font-bold text-brand-blue shrink-0">{prop.priceDisplay}</span>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : searchQuery ? (
            <div className="py-8 text-center text-xs text-brand-muted">
              No verified properties match "{searchQuery}". Try searching another locality or city.
            </div>
          ) : (
            <div className="py-4 text-center">
              <Link
                to="/buy"
                onClick={() => setSearchOpen(false)}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                Or browse all verified properties for sale →
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
