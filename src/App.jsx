import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ENABLE_CUSTOMER_DASHBOARD } from './config/productScope';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import CustomerDashboardLayout from './layouts/CustomerDashboardLayout';

// Shared Context Providers (PRD Section 4)
import { ToastProvider } from './context/ToastContext';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerDashboardProvider } from './context/CustomerDashboardContext';

// Global Modals
import PropertyDetailModal from './components/PropertyDetailModal';
import EnquiryModal from './components/EnquiryModal';
import LegalModal from './components/LegalModal';

// Route Guards (PRD Acceptance Rule 5)
import ProtectedRoute from './components/shared/ProtectedRoute';

// Authenticated Customer Dashboard Pages (Customer Portal PRD Section 3.2)
import DashboardOverview from './pages/customer/DashboardOverview';
import DiscoverProperties from './pages/customer/DiscoverProperties';
import Enquiries from './pages/customer/Enquiries';
import EnquiryDetails from './pages/customer/EnquiryDetails';
import SiteVisits from './pages/customer/SiteVisits';
import SiteVisitDetails from './pages/customer/SiteVisitDetails';
import CustomerSavedProperties from './pages/customer/SavedProperties';
import CustomerCompareProperties from './pages/customer/CompareProperties';
import RecentSearches from './pages/customer/RecentSearches';
import SearchAlerts from './pages/customer/SearchAlerts';
import Messages from './pages/customer/Messages';
import Notifications from './pages/customer/Notifications';
import Profile from './pages/customer/Profile';
import Settings from './pages/customer/Settings';
import Support from './pages/customer/Support';
import CreateSupportTicket from './pages/customer/CreateSupportTicket';

// Public & Portal Pages
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
import AccountPage from './pages/AccountPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Focused Authentication Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
        <AuthProvider>
          <PropertyProvider>
            {ENABLE_CUSTOMER_DASHBOARD ? (
              <CustomerDashboardProvider>
                <AppRoutes
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
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onExploreProperties={handleExploreProperties}
                  onExploreClick={handleExploreProperties}
                  onContactClick={() => setActiveScheduleProperty({ title: 'EstateOne Priority Consultation' })}
                  onOpenLegal={(type) => setLegalModalConfig(type)}
                  onCitySelect={handleCitySelectFromFooter}
                  setActivePropertyDetail={setActivePropertyDetail}
                  setActiveScheduleProperty={setActiveScheduleProperty}
                />
              </CustomerDashboardProvider>
            ) : (
              <AppRoutes
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
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onExploreProperties={handleExploreProperties}
                onExploreClick={handleExploreProperties}
                onContactClick={() => setActiveScheduleProperty({ title: 'EstateOne Priority Consultation' })}
                onOpenLegal={(type) => setLegalModalConfig(type)}
                onCitySelect={handleCitySelectFromFooter}
                setActivePropertyDetail={setActivePropertyDetail}
                setActiveScheduleProperty={setActiveScheduleProperty}
              />
            )}

            {/* Global Modals */}
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
          </PropertyProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

function AppRoutes({
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  intent,
  setIntent,
  budgetRange,
  setBudgetRange,
  selectedBedrooms,
  setSelectedBedrooms,
  searchQuery,
  setSearchQuery,
  favorites,
  onToggleFavorite,
  onExploreProperties,
  onExploreClick,
  onContactClick,
  onOpenLegal,
  onCitySelect,
  setActivePropertyDetail,
  setActiveScheduleProperty
}) {
  return (
    <>
      <ScrollToTop />

      <Routes>
                {/* =========================================================================
                    1. DEDICATED FOCUSED AUTH LAYOUT (Login, Register, OTP, Password Reset)
                    Completely removes complete website header and footer to keep users focused
                   ========================================================================= */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {ENABLE_CUSTOMER_DASHBOARD ? (
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <CustomerDashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardOverview />} />
                    <Route path="discover" element={<DiscoverProperties />} />
                    <Route path="enquiries" element={<Enquiries />} />
                    <Route path="enquiries/:enquiryId" element={<EnquiryDetails />} />
                    <Route path="site-visits" element={<SiteVisits />} />
                    <Route path="site-visits/:visitId" element={<SiteVisitDetails />} />
                    <Route path="saved" element={<CustomerSavedProperties />} />
                    <Route path="compare" element={<CustomerCompareProperties />} />
                    <Route path="recent-searches" element={<RecentSearches />} />
                    <Route path="alerts" element={<SearchAlerts />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="messages/:conversationId" element={<Messages />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="support" element={<Support />} />
                    <Route path="support/new" element={<CreateSupportTicket />} />
                  </Route>
                ) : (
                  <Route
                    path="/dashboard/*"
                    element={<Navigate to="/account" replace />}
                  />
                )}

                {/* =========================================================================
                    3. STANDARD PUBLIC & PORTAL LAYOUT (Complete Website Navigation & Footer)
                   ========================================================================= */}
                <Route
                  element={
                    <MainLayout
                      onExploreClick={onExploreClick}
                      onContactClick={onContactClick}
                      onOpenLegal={onOpenLegal}
                      onCitySelect={onCitySelect}
                    />
                  }
                >
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
                      onExploreProperties={onExploreProperties}
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
                      onToggleFavorite={onToggleFavorite}
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

                {/* Member Protected Area */}
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Legal Disclosures */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-and-conditions" element={<TermsPage />} />

                {/* Branded 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
      </Routes>
    </>
  );
}
