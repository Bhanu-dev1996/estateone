import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PropertyDetailModal from './components/PropertyDetailModal';
import EnquiryModal from './components/EnquiryModal';
import LegalModal from './components/LegalModal';

// Shared Context Providers (PRD Section 4)
import { ToastProvider } from './context/ToastContext';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider } from './context/AuthContext';

// Shared Global Modals (PRD Section 4.1)
import SiteVisitModal from './components/shared/SiteVisitModal';
import ConfirmationModal from './components/shared/ConfirmationModal';

// Pages
import HomePage from './pages/HomePage';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import CommercialPage from './pages/CommercialPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ComparePage from './pages/ComparePage';
import SavedPropertiesPage from './pages/SavedPropertiesPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import BuildersPage from './pages/BuildersPage';
import BuilderDetailPage from './pages/BuilderDetailPage';
import ListPropertyPage from './pages/ListPropertyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Automatic scroll-to-top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Search and Filter State for Hero Fields
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedType, setSelectedType] = useState('All types');
  const [intent, setIntent] = useState('buy');
  const [budgetRange, setBudgetRange] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any rooms');
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState(['prop-1', 'prop-7']);

  // Modals state
  const [activePropertyDetail, setActivePropertyDetail] = useState(null);
  const [activeScheduleProperty, setActiveScheduleProperty] = useState(null);
  const [legalModalConfig, setLegalModalConfig] = useState(null);

  // Graceful preloader fade out when application hydrates
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        setTimeout(() => {
          preloader.remove();
        }, 650);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (propId) => {
    setFavorites((prev) => 
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  // Scroll to properties section on home
  const handleExploreProperties = () => {
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCitySelectFromFooter = (city) => {
    setSelectedCity(city);
    handleExploreProperties();
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <PropertyProvider>
          <AuthProvider>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-brand-text relative overflow-x-hidden selection:bg-brand-blue selection:text-white">
        
        {/* Soft Apple Ambient Glow Orbs for Glass Diffusion */}
        <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none z-0"></div>
        <div className="fixed top-3/4 right-[-10%] w-[600px] h-[600px] bg-amber-50/60 rounded-full blur-[160px] pointer-events-none z-0"></div>

        {/* Floating Centered Apple-inspired Glass Navigation */}
        <Navbar 
          onExploreClick={handleExploreProperties}
          onContactClick={() => setActiveScheduleProperty({ title: 'EstateOne Priority Consultation' })}
        />

        {/* Main Content Landmark per B10 Accessibility */}
        <main id="main-content" className="flex-1 relative z-10" tabIndex={-1}>
          <Routes>
            {/* Primary Discovery Routes */}
            <Route 
              path="/" 
              element={
                <HomePage
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  intent={intent}
                  setIntent={setIntent}
                  budgetRange={budgetRange}
                  setBudgetRange={setBudgetRange}
                  selectedBedrooms={selectedBedrooms}
                  setSelectedBedrooms={setSelectedBedrooms}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onExploreProperties={handleExploreProperties}
                  onSelectProperty={(prop) => setActivePropertyDetail(prop)}
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />
            <Route 
              path="/buy" 
              element={
                <BuyPage 
                  onSelectProperty={(prop) => setActivePropertyDetail(prop)}
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />
            <Route 
              path="/rent" 
              element={
                <RentPage 
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />
            <Route 
              path="/commercial" 
              element={
                <CommercialPage 
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />
            <Route 
              path="/property/:slug" 
              element={
                <PropertyDetailPage 
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                  onEnquire={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />

            {/* Decision Support & User Engagement */}
            <Route 
              path="/compare" 
              element={
                <ComparePage 
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />
            <Route 
              path="/saved-properties" 
              element={
                <SavedPropertiesPage 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />

            {/* Professional Directory & Profiles */}
            <Route path="/agents" element={<AgentsPage />} />
            <Route 
              path="/agents/:slug" 
              element={
                <AgentDetailPage 
                  onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
                />
              } 
            />
            <Route path="/builders" element={<BuildersPage />} />
            <Route path="/builders/:slug" element={<BuilderDetailPage />} />

            {/* Acquisition Wizard */}
            <Route path="/list-property" element={<ListPropertyPage />} />

            {/* Authority, Content & Support */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Authentication Lifecycle */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Legal Disclosures */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />

            {/* Branded 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Semantic Footer with Legal Compliance & Disclaimers */}
        <Footer 
          onOpenLegal={(type) => setLegalModalConfig(type)}
          onCitySelect={handleCitySelectFromFooter}
        />

        {/* Global Modals Available Across Entire App */}
        {activePropertyDetail && (
          <PropertyDetailModal
            property={activePropertyDetail}
            onClose={() => setActivePropertyDetail(null)}
            onScheduleVisit={(prop) => {
              setActivePropertyDetail(null);
              setActiveScheduleProperty(prop);
            }}
          />
        )}

        {activeScheduleProperty && (
          <EnquiryModal
            property={activeScheduleProperty}
            onClose={() => setActiveScheduleProperty(null)}
          />
        )}

        {legalModalConfig && (
          <LegalModal
            type={legalModalConfig}
            title={
              legalModalConfig === 'privacy' 
                ? 'Privacy Policy' 
                : legalModalConfig === 'rera' 
                  ? 'RERA Compliance Disclaimer' 
                  : 'Terms and Conditions'
            }
            onClose={() => setLegalModalConfig(null)}
          />
        )}

        {/* Section 4 Global Modals */}
        <SiteVisitModal />
        <ConfirmationModal />
        <EnquiryModal />

      </div>
          </AuthProvider>
        </PropertyProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
