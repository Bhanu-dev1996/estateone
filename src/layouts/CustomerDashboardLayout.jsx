import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  SquaresFour, 
  MagnifyingGlass, 
  ChatCircleText, 
  CalendarCheck, 
  Heart, 
  Scales, 
  ClockCounterClockwise, 
  BellRinging, 
  EnvelopeSimple, 
  Bell, 
  UserCircle, 
  GearSix, 
  Question, 
  SignOut, 
  List, 
  X, 
  CaretLeft, 
  CaretRight, 
  HouseLine, 
  ShieldCheck,
  CheckCircle,
  Sparkle
} from '@phosphor-icons/react';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useCustomerDashboard } from '../context/CustomerDashboardContext';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { APP_ICON } from '../lib/iconScale';

export default function CustomerDashboardLayout() {
  const { user, logout } = useAuth();
  const { savedPropertyIds, comparePropertyIds } = useProperty();
  const { 
    unreadMessagesCount, 
    unreadNotificationsCount, 
    activeEnquiriesCount, 
    upcomingVisitsCount 
  } = useCustomerDashboard();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Primary 13 Dashboard Navigation destinations matching PRD Section 3.1
  const NAV_ITEMS = [
    { label: 'Overview', path: '/dashboard', icon: SquaresFour, end: true },
    { label: 'Discover properties', path: '/dashboard/discover', icon: MagnifyingGlass },
    { label: 'My enquiries', path: '/dashboard/enquiries', icon: ChatCircleText, badge: activeEnquiriesCount },
    { label: 'Site visits', path: '/dashboard/site-visits', icon: CalendarCheck, badge: upcomingVisitsCount },
    { label: 'Saved properties', path: '/dashboard/saved', icon: Heart, badge: savedPropertyIds.length },
    { label: 'Compare properties', path: '/dashboard/compare', icon: Scales, badge: comparePropertyIds.length },
    { label: 'Recent searches', path: '/dashboard/recent-searches', icon: ClockCounterClockwise },
    { label: 'Search alerts', path: '/dashboard/alerts', icon: BellRinging },
    { label: 'Messages', path: '/dashboard/messages', icon: EnvelopeSimple, badge: unreadMessagesCount },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: unreadNotificationsCount },
    { label: 'My profile', path: '/dashboard/profile', icon: UserCircle },
    { label: 'Account settings', path: '/dashboard/settings', icon: GearSix },
    { label: 'Help and support', path: '/dashboard/support', icon: Question }
  ];

  // Mobile Bottom 5-Item Navigation matching PRD Section 4.2
  const MOBILE_BOTTOM_NAV = [
    { label: 'Overview', path: '/dashboard', icon: SquaresFour },
    { label: 'Discover', path: '/dashboard/discover', icon: MagnifyingGlass },
    { label: 'Saved', path: '/dashboard/saved', icon: Heart, badge: savedPropertyIds.length },
    { label: 'Enquiries', path: '/dashboard/enquiries', icon: ChatCircleText, badge: activeEnquiriesCount },
    { label: 'Profile', path: '/dashboard/profile', icon: UserCircle }
  ];

  const handleSignOut = () => {
    setSignOutConfirmOpen(false);
    logout();
    navigate('/login');
  };

  // Compute Page Title for Header Breadcrumbs
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/dashboard') return 'Customer overview';
    if (p === '/dashboard/discover') return 'Discover properties';
    if (p.startsWith('/dashboard/enquiries/')) return 'Enquiry details';
    if (p === '/dashboard/enquiries') return 'My enquiries';
    if (p.startsWith('/dashboard/site-visits/')) return 'Site visit details';
    if (p === '/dashboard/site-visits') return 'Site visits';
    if (p === '/dashboard/saved') return 'Saved properties';
    if (p === '/dashboard/compare') return 'Compare properties';
    if (p === '/dashboard/recent-searches') return 'Recent searches';
    if (p === '/dashboard/alerts') return 'Search alerts';
    if (p.startsWith('/dashboard/messages/')) return 'Conversation thread';
    if (p === '/dashboard/messages') return 'Messages and inbox';
    if (p === '/dashboard/notifications') return 'Notifications';
    if (p === '/dashboard/profile') return 'Customer profile';
    if (p === '/dashboard/settings') return 'Account settings and security';
    if (p === '/dashboard/support/new') return 'Create support request';
    if (p === '/dashboard/support') return 'Help and support centre';
    return 'Customer dashboard';
  };

  // Quick Search Dialog matching
  const matchingProperties = searchQuery
    ? SAMPLE_PROPERTIES.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="density-compact min-h-screen bg-[#F7F8FA] flex text-left font-sans text-body">
      
      {/* =========================================================================
          1. PERSISTENT DESKTOP SIDEBAR (PRD Section 4.1)
         ========================================================================= */}
      <aside 
        className={`hidden md:flex flex-col bg-brand-navy text-white transition-all duration-300 z-30 shrink-0 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`p-4 border-b border-white/10 shrink-0 flex ${collapsed ? 'justify-center' : 'justify-start'}`}
        >
          <Link to="/" className="flex items-center gap-2 overflow-hidden min-w-0">
            <Logo
              variant={collapsed ? 'icon' : 'full'}
              theme="dark"
              size="sm"
            />
          </Link>
        </div>

        {/* Navigation List */}
        <ScrollArea
          className="flex-1 px-3 py-4"
          type="hover"
          scrollbarClassName="w-1.5 p-0 mr-0.5 bg-transparent"
          thumbClassName="bg-white/20 hover:bg-white/35"
        >
          <nav aria-label="Customer portal navigation" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-small font-medium transition-all group cursor-pointer relative ${
                      isActive
                        ? 'bg-brand-blue text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  <Icon size={APP_ICON.md} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {item.badge > 0 && (
                    <span 
                      className={`text-caption font-bold rounded-full flex items-center justify-center px-1.5 py-0.2 shrink-0 ${
                        collapsed 
                          ? 'absolute top-1 right-2 w-4 h-4 text-caption bg-brand-gold text-brand-navy' 
                          : 'ml-auto bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* =========================================================================
          2. MAIN CONTENT AREA & TOP HEADER BAR
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Drawer Trigger & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <List size={APP_ICON.lg} weight="bold" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              className="hidden md:flex p-2 rounded-xl text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {collapsed ? (
                <CaretRight size={APP_ICON.lg} weight="bold" aria-hidden />
              ) : (
                <CaretLeft size={APP_ICON.lg} weight="bold" aria-hidden />
              )}
            </button>

            <nav aria-label="Breadcrumb" className="site-breadcrumbs min-w-0 py-0">
              <ol className="site-breadcrumbs__list flex-wrap">
                <li className="site-breadcrumbs__segment">
                  <Link to="/dashboard" className="site-breadcrumbs__link">
                    Portal
                  </Link>
                </li>
                <li aria-hidden="true" className="site-breadcrumbs__separator">
                  <CaretRight size={9} weight="bold" aria-hidden />
                </li>
                <li className="flex min-w-0 max-w-full items-center">
                  <span aria-current="page" className="site-breadcrumbs__current sm:max-w-md">
                    {getPageTitle()}
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Right: Search, Notifications, Messages, Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Search Entry */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-small text-slate-500 hover:text-brand-navy transition-all cursor-pointer border border-slate-200/60"
            >
              <MagnifyingGlass size={APP_ICON.sm} aria-hidden />
              <span>Search properties...</span>
              <kbd className="text-caption bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-400">⌘K</kbd>
            </button>

            {/* Messages Trigger */}
            <Link
              to="/dashboard/messages"
              aria-label={`Messages (${unreadMessagesCount} unread)`}
              className="relative p-2 rounded-full text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <EnvelopeSimple size={APP_ICON.lg} aria-hidden />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-blue text-white text-caption font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            {/* Notifications Trigger */}
            <Link
              to="/dashboard/notifications"
              aria-label={`Notifications (${unreadNotificationsCount} unread)`}
              className="relative p-2 rounded-full text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell size={APP_ICON.lg} aria-hidden />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-caption font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open user menu"
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-brand-blue/20 transition-all cursor-pointer"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user?.name || 'Customer'}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-white shadow-xl border border-slate-100 text-left">
                <div className="px-2 py-1.5">
                  <p className="text-small font-bold text-brand-navy truncate">{user?.name || 'Ananya Rao'}</p>
                  <p className="text-small text-slate-500 truncate">{user?.email || 'buyer@estateone.in'}</p>
                  <div className="mt-1 flex items-center gap-1 text-caption text-emerald-600 font-semibold">
                    <ShieldCheck size={14} weight="fill" />
                    <span>Verified customer</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="text-xs font-medium text-slate-700 hover:text-brand-navy cursor-pointer flex items-center gap-2 py-2 rounded-xl">
                    <UserCircle size={16} />
                    <span>My profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="text-xs font-medium text-slate-700 hover:text-brand-navy cursor-pointer flex items-center gap-2 py-2 rounded-xl">
                    <GearSix size={16} />
                    <span>Account settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/support" className="text-xs font-medium text-slate-700 hover:text-brand-navy cursor-pointer flex items-center gap-2 py-2 rounded-xl">
                    <Question size={16} />
                    <span>Help and support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="text-xs font-medium text-slate-700 hover:text-brand-navy cursor-pointer flex items-center gap-2 py-2 rounded-xl">
                    <HouseLine size={16} />
                    <span>Public website</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSignOutConfirmOpen(true)}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer flex items-center gap-2 py-2 rounded-xl"
                >
                  <SignOut size={16} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* =========================================================================
          3. MOBILE NAVIGATION DRAWER (PRD Section 4.2)
         ========================================================================= */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="flex flex-col justify-between bg-brand-navy text-white w-[290px] p-0 border-r border-white/10">
          <SheetHeader className="p-5 border-b border-white/10 shrink-0 text-left space-y-0">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Logo theme="dark" size="sm" />
            </Link>
            <SheetTitle className="sr-only">Customer portal navigation</SheetTitle>
          </SheetHeader>

          <ScrollArea
            className="flex-1 px-4 py-4"
            type="hover"
            scrollbarClassName="w-1.5 p-0 mr-0.5 bg-transparent"
            thumbClassName="bg-white/20 hover:bg-white/35"
          >
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-small font-medium transition-all ${
                        isActive
                          ? 'bg-brand-blue text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    <Icon size={APP_ICON.md} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto text-caption font-bold bg-white/20 text-white rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* =========================================================================
          4. MOBILE BOTTOM 5-ITEM BAR (PRD Section 4.2)
         ========================================================================= */}
      <nav 
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        {MOBILE_BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-brand-blue font-bold' : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-caption">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute top-0.5 right-1.5 w-3.5 h-3.5 rounded-full bg-brand-blue text-white text-caption font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* =========================================================================
          5. GLOBAL SEARCH DIALOG
         ========================================================================= */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl p-6 bg-white rounded-3xl text-left border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-h4 text-brand-navy font-bold flex items-center gap-2">
              <MagnifyingGlass size={20} className="text-brand-blue" />
              <span>Search properties in portal</span>
            </DialogTitle>
            <DialogDescription className="text-small text-slate-500">
              Locate verified listings across your preferred cities and categories.
            </DialogDescription>
          </DialogHeader>

          <div className="relative my-4">
            <MagnifyingGlass size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search by locality, project title, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-small text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue"
            />
          </div>

          {matchingProperties.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {matchingProperties.map((prop) => (
                <Link
                  key={prop.id}
                  to={`/property/${prop.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer group"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-bold text-brand-navy truncate group-hover:text-brand-blue">{prop.title}</p>
                    <p className="text-small text-slate-500 truncate">{prop.location} • {prop.bedrooms}</p>
                  </div>
                  <span className="text-small font-bold text-brand-blue">{prop.priceDisplay}</span>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-small text-slate-500 text-center py-4">No matching properties found.</p>
          ) : (
            <div className="py-3 text-center">
              <Link
                to="/dashboard/discover"
                onClick={() => setSearchOpen(false)}
                className="text-small font-semibold text-brand-blue hover:underline"
              >
                Open complete discovery filters →
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          6. SIGN OUT CONFIRMATION DIALOG (PRD Section 4.3)
         ========================================================================= */}
      <Dialog open={signOutConfirmOpen} onOpenChange={setSignOutConfirmOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl text-left border-0 shadow-2xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <SignOut size={20} weight="bold" />
            </div>
            <DialogTitle className="text-h4 text-brand-navy font-semibold">
              Confirm sign out
            </DialogTitle>
            <DialogDescription className="text-small text-slate-500 mt-1">
              Are you sure you want to exit your customer workspace? Your active enquiries and saved shortlists will remain securely stored.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex sm:justify-end gap-2 pt-4">
            <Button size="sm"
              type="button"
              variant="outline"
              onClick={() => setSignOutConfirmOpen(false)}
              className="rounded-2xl min-h-10 px-4 font-semibold cursor-pointer border-slate-200 text-slate-700"
            >
              Stay signed in
            </Button>
            <Button size="sm"
              type="button"
              onClick={handleSignOut}
              className="rounded-2xl min-h-10 px-4 font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
