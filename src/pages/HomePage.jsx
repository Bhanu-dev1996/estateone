import React from 'react';
// PRD 5.1 Sections 1 & 2: Hero & Search Widget
import Hero from '../components/Hero';

// PRD 5.1 Section 3: Popular locations
import PopularLocations from '../components/home/PopularLocations';

// PRD 5.1 Section 4: Featured properties
import FeaturedProperties from '../components/home/FeaturedProperties';

// PRD 5.1 Section 5: Browse by property type
import BrowseByType from '../components/home/BrowseByType';

// PRD 5.1 Section 6: New properties
import NewProperties from '../components/home/NewProperties';

// PRD 5.1 Section 7: Premium properties
import PremiumProperties from '../components/home/PremiumProperties';

// PRD 5.1 Section 8: Why choose EstateOne
import Benefits from '../components/Benefits';

// SKILL.md B11 Mandatory Section
import TaglineReveal from '../components/TaglineReveal';

// PRD 5.1 Section 9: How EstateOne works
import HowItWorks from '../components/HowItWorks';

// Verification Protocol
import Verification from '../components/Verification';

// PRD 5.1 Section 10: Featured agents and builders
import FeaturedPartners from '../components/home/FeaturedPartners';

// PRD 5.1 Section 11: Customer testimonials
import Testimonials from '../components/home/Testimonials';

// PRD 5.1 Section 12: Property insights / latest articles
import LatestInsights from '../components/home/LatestInsights';

// FAQ Section
import FAQ from '../components/FAQ';

// PRD 5.1 Section 13: List Your Property CTA
import ListPropertyCTA from '../components/home/ListPropertyCTA';

export default function HomePage({
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
  onExploreProperties,
  onScheduleVisit
}) {
  return (
    <>
      {/* 1 & 2. Hero Section and Search Widget (PRD 5.1 Sections 1 & 2) */}
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
        onSearchSubmit={onExploreProperties}
      />

      {/* 3. Popular Locations (PRD 5.1 Section 3) */}
      <PopularLocations />

      {/* 4. Featured Properties (PRD 5.1 Section 4) */}
      <div id="properties">
        <FeaturedProperties />
      </div>

      {/* 5. Browse by Property Type (PRD 5.1 Section 5) */}
      <BrowseByType />

      {/* 6. New Properties (PRD 5.1 Section 6) */}
      <NewProperties />

      {/* 7. Premium Properties (PRD 5.1 Section 7) */}
      <PremiumProperties />

      {/* 8. Why Choose EstateOne (PRD 5.1 Section 8) */}
      <div id="why-us">
        <Benefits />
      </div>

      {/* Mandatory Tagline Reveal Section per SKILL.md */}
      <TaglineReveal />

      {/* 9. How EstateOne Works (PRD 5.1 Section 9) */}
      <div id="how-it-works">
        <HowItWorks onExploreClick={onExploreProperties} />
      </div>

      {/* Verification Protocol */}
      <div id="verification">
        <Verification />
      </div>

      {/* 10. Featured Agents and Builders (PRD 5.1 Section 10) */}
      <FeaturedPartners />

      {/* 11. Customer Testimonials Section (PRD 5.1 Section 11) */}
      <Testimonials />

      {/* 12. Property Insights / Latest Articles (PRD 5.1 Section 12) */}
      <LatestInsights />

      {/* FAQ Section */}
      <div id="faq">
        <FAQ onContactClick={() => onScheduleVisit?.({ title: 'EstateOne Support Consultation' })} />
      </div>

      {/* 13. List Your Property CTA (PRD 5.1 Section 13) */}
      <ListPropertyCTA />

      {/* 14. Footer rendered globally by layout shell in App.jsx */}
    </>
  );
}
