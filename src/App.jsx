import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TaglineReveal from './components/TaglineReveal';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import Verification from './components/Verification';
import ProofShowcase from './components/ProofShowcase';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PropertyDetailModal from './components/PropertyDetailModal';
import EnquiryModal from './components/EnquiryModal';
import LegalModal from './components/LegalModal';

export default function App() {
  // Search and Filter State for Hero Fields
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedType, setSelectedType] = useState('All types');
  const [intent, setIntent] = useState('buy');
  const [budgetRange, setBudgetRange] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any rooms');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
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

  // Scroll to properties section
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
      <main id="main-content" className="flex-1 relative z-10">
        
        {/* Section 1: Hero with Airbnb Style Search Fields */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
          onSearchSubmit={handleExploreProperties}
        />

        {/* Section 2: Properties / Proof Showcase (#properties - matches Nav Item 1) */}
        <ProofShowcase
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
          onSelectProperty={(prop) => setActivePropertyDetail(prop)}
          onScheduleVisit={(prop) => setActiveScheduleProperty(prop)}
        />

        {/* Section 3: Why EstateOne / Benefits (#why-us - matches Nav Item 2) */}
        <Benefits />

        {/* Mandatory Tagline Reveal Section per B11 */}
        <TaglineReveal />

        {/* Section 4: How it Works (#how-it-works - matches Nav Item 3) */}
        <HowItWorks onExploreClick={handleExploreProperties} />

        {/* Section 5: Verification Protocol (#verification - matches Nav Item 4) */}
        <Verification />

        {/* Section 6: Frequently Asked Questions (#faq - matches Nav Item 5) */}
        <FAQ onContactClick={() => setActiveScheduleProperty({ title: 'EstateOne Support Consultation' })} />

        {/* Section 7: Final CTA (Identical to top, Risk Reversals) */}
        <FinalCTA onExploreClick={handleExploreProperties} />

      </main>

      {/* Semantic Footer with Legal Compliance & Disclaimers */}
      <Footer 
        onOpenLegal={(type) => setLegalModalConfig(type)}
        onCitySelect={handleCitySelectFromFooter}
      />

      {/* Property Detail Modal */}
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

      {/* Consultation / Visit Enquiry Modal */}
      {activeScheduleProperty && (
        <EnquiryModal
          property={activeScheduleProperty}
          onClose={() => setActiveScheduleProperty(null)}
        />
      )}

      {/* Legal Modal */}
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

    </div>
  );
}
