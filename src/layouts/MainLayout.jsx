import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryModal from '../components/EnquiryModal';
import SiteVisitModal from '../components/shared/SiteVisitModal';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import CompareLimitModal from '../components/shared/CompareLimitModal';
import CompareTray from '../components/shared/CompareTray';
import GuestSavePromptModal from '../components/shared/GuestSavePromptModal';

/**
 * MainLayout (Standard Website Layout)
 * Provides the full navigation header, multi-column footer, comparison tray,
 * and discovery widgets across all public and portal pages.
 */
export default function MainLayout({
  onExploreClick,
  onContactClick,
  onOpenLegal,
  onCitySelect
}) {
  return (
    <div className="estate-app-shell density-comfortable min-h-[100dvh] flex w-full flex-col bg-[#F7F8FA] text-brand-text text-body relative overflow-x-hidden selection:bg-brand-blue selection:text-white font-body">
      
      {/* Soft Apple Ambient Glow Orbs for Glass Diffusion */}
      <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-3/4 right-[-10%] w-[600px] h-[600px] bg-amber-50/60 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Floating Centered Apple-inspired Glass Navigation */}
      <Navbar 
        onExploreClick={onExploreClick}
        onContactClick={onContactClick}
      />

      {/* Main Content Landmark per B10 Accessibility */}
      <main id="main-content" className="flex-1 min-h-0 w-full relative z-10" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Semantic Footer with Legal Compliance & Disclaimers */}
      <Footer
        className="mt-auto shrink-0"
        onOpenLegal={onOpenLegal}
        onCitySelect={onCitySelect}
      />

      {/* Shared Global Trays & Modals */}
      <EnquiryModal />
      <SiteVisitModal />
      <ConfirmationModal />
      <CompareLimitModal />
      <CompareTray />
      <GuestSavePromptModal />

    </div>
  );
}
