// PRD 5.12: Blog and Property Guides Dataset
// Strictly adheres to project constraints: zero visible copy hyphens, strict sentence case, Indian real estate context.

export const BLOG_CATEGORIES = [
  'All categories',
  'Buying guides',
  'Renting guides',
  'Real estate investment',
  'Home loans',
  'Property legal guides',
  'City guides',
  'Market insights'
];

export const SAMPLE_ARTICLES = [
  {
    id: 'article-1',
    slug: 'rera-compliance-guide-homebuyers',
    featured: true,
    title: 'Understanding RERA title verification and certificate validation in 2026',
    category: 'Property legal guides',
    author: {
      name: 'Advocate Radhika Menon',
      role: 'Senior Property Law Counsel',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '12 November 2026',
    readTime: '9 min read',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'A comprehensive walkthrough of state regulatory portals, title deed searches, commencement certificates, and authentic carpet area disclosures before transferring any booking earnest money.',
    keyTakeaway: 'Always cross reference the state RERA registration number against official portal filings to verify sanctioned tower heights, escrow balance ratios, and committed completion deadlines.',
    content: [
      {
        heading: 'The foundation of regulatory buyer protection',
        body: 'The implementation of state real estate regulatory authorities has transformed property acquisition across India. Prior to modern regulatory enforcement, property seekers often grappled with delayed handovers, unannounced floor plan modifications, and opaque super built up computations. Under current law, developers must maintain 70 percent of collected buyer funds in dedicated project escrow accounts allocated solely for construction and land title payments.'
      },
      {
        heading: 'Crucial documents to examine prior to booking',
        body: 'Before executing any allotment letter or token payment, insist on inspecting four primary legal credentials: the sanctioned layout plan approved by municipal authorities, the non agricultural conversion order, the title search report conducted by an independent advocate spanning thirty years, and the commencement certificate for your specific tower.'
      },
      {
        heading: 'Decoding carpet area disclosures',
        body: 'RERA mandates that all residential sales occur strictly on net usable carpet area rather than ambiguous super built up formulas. Carpet area denotes the net usable floor space enclosed within interior apartment walls, excluding external walls, common service shafts, and shared stairways. At EstateOne, all listed properties display verified RERA carpet measurements to ensure genuine rate comparisons.'
      },
      {
        heading: 'Verifying occupancy certificates at possession',
        body: 'Never accept physical keys or commence interior modifications without confirming that the local municipal corporation has issued an unconditional Occupancy Certificate (OC). Taking possession on a temporary fit out basis forfeits vital legal protections and leaves buyers vulnerable to society handover disputes.'
      }
    ]
  },
  {
    id: 'article-2',
    slug: 'first-time-homebuyer-roadmap-india',
    featured: false,
    title: 'First time homebuyer roadmap: from preliminary budgeting to possession handoff',
    category: 'Buying guides',
    author: {
      name: 'Kunal Trivedi, CFA',
      role: 'Private Wealth Advisory Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '08 November 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Essential strategic guidance for navigating your first residential purchase, evaluating true total cost of ownership, and conducting flawless society handover checks.',
    keyTakeaway: 'Factor an additional 8 to 12 percent over the base property agreement value for state stamp duty, registration charges, society corpus fees, and preliminary interior readiness.',
    content: [
      {
        heading: 'Establishing an unshakeable acquisition budget',
        body: 'Many first time purchasers make the error of calculating affordability purely on monthly loan installments. A prudent property budget must account for upfront equity contributions (minimum 20 percent), stamp duty, registration fees, advance maintenance deposits, club memberships, and property tax assessments.'
      },
      {
        heading: 'Location selection: evaluating 15 minute transit zones',
        body: 'Prioritize neighborhoods with mature civic infrastructure and verified arterial transit links. Properties situated within 15 minutes of major employment hubs, top healthcare facilities, and rapid transit stations consistently exhibit higher capital resilience across macroeconomic cycles.'
      },
      {
        heading: 'The final pre possession inspection audit',
        body: 'Conduct an exhaustive joint snagging audit with your advisor before signing final handover releases. Inspect water pressure across all fixtures, test electrical circuitry panels, check window silicon weatherproofing, and verify that parking slot allocations are officially numbered and demarcated in writing.'
      }
    ]
  },
  {
    id: 'article-3',
    slug: 'tenant-rights-security-deposit-lease-agreements',
    featured: false,
    title: 'Tenancy rights, security deposit norms, and lease agreement checklists',
    category: 'Renting guides',
    author: {
      name: 'Pooja Deshmukh',
      role: 'Tenancy Advisory Specialist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '02 November 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Navigating registered leave and license contracts, standard deposit refund timelines, lock in clauses, and maintenance dispute resolution.',
    keyTakeaway: 'Always execute a registered leave and license agreement with explicit clauses defining the exact deposit refund timeline and detailed wear and tear definitions.',
    content: [
      {
        heading: 'The importance of registered leave and license',
        body: 'Informal eleven month notarized agreements offer fragile legal security. In major metropolitan markets such as Mumbai, Bengaluru, and Pune, executing an e registered Leave and License agreement through official government portals establishes clear legal status for both tenant and landlord.'
      },
      {
        heading: 'Standardizing security deposit terms',
        body: 'Deposit amounts vary across cities, typically ranging between two to six months rent in Mumbai and up to five months in Bengaluru. Ensure your contract explicitly binds the landlord to refund the full security deposit on the date of handover, subject only to unpaid utility dues and mutually agreed damages.'
      },
      {
        heading: 'Defining wear and tear versus structural damage',
        body: 'Routine wall paint fading, standard fixture aging, and pre existing hairline plaster marks fall under fair wear and tear. Conduct an exhaustive photo and video inventory on move in day and attach it as an addendum to the agreement to prevent deduction disagreements upon exit.'
      }
    ]
  },
  {
    id: 'article-4',
    slug: 'rental-yield-capital-appreciation-prime-corridors',
    featured: false,
    title: 'Evaluating rental yields and capital appreciation in Indian prime corridors',
    category: 'Real estate investment',
    author: {
      name: 'Vikramaditya Singhania',
      role: 'Real Estate Investment Strategist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '27 October 2026',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Comprehensive yield analysis comparing residential gross returns against Grade A commercial pre leased assets across Mumbai, Bengaluru, and Hyderabad.',
    keyTakeaway: 'While luxury residential units deliver steady 2.8 to 3.8 percent gross rental yields alongside robust long term capital gains, institutional commercial assets offer 7.5 to 9.2 percent cash yields.',
    content: [
      {
        heading: 'Differentiating residential versus commercial yield economics',
        body: 'Residential properties in metropolitan India average rental yields between 2.5 and 4.2 percent, supported by strong emotional capital preservation and steady 6 to 9 percent annual capital growth. Conversely, Grade A commercial office floors provide superior cash yields of 7.5 to 9 percent with institutional corporate covenants spanning five to nine years.'
      },
      {
        heading: 'The rise of micro markets with asymmetric appreciation potential',
        body: 'Investors should target high barrier to entry micro markets driven by transformative public transit infrastructure. Suburban nodes gaining direct metro or sea link arterial connectivity routinely outpace legacy city centers in capital appreciation over five to seven year holding horizons.'
      },
      {
        heading: 'Mitigating vacancy risk with premium tenant profiles',
        body: 'Properties situated within master planned gated communities boasting concierge services, clubhouse facilities, and power backup sustain occupancy rates above 95 percent, shielding property owners from extended turnover vacancies.'
      }
    ]
  },
  {
    id: 'article-5',
    slug: 'home-loan-interest-rates-tax-deductions',
    featured: false,
    title: 'Navigating repo rate cycles, loan eligibility, and tax optimization under section 24',
    category: 'Home loans',
    author: {
      name: 'Kunal Trivedi, CFA',
      role: 'Private Wealth Advisory Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '21 October 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'How to structure co applicant borrowing, leverage MCLR versus external benchmark spreads, and maximize income tax deductions on housing loans.',
    keyTakeaway: 'Adding a spouse as joint co borrower enables both individuals to independently claim up to 2 lakh rupees each under section 24(b) for loan interest, doubling your family tax shield.',
    content: [
      {
        heading: 'Understanding external benchmark lending rate (EBLR) linkages',
        body: 'Since 2019, all floating rate retail home loans sanctioned by scheduled commercial banks are tied directly to external benchmarks, primarily the Reserve Bank of India repo rate. Understanding reset date cycles and lender spread margins ensures you capture interest rate cuts promptly without unnecessary administrative friction.'
      },
      {
        heading: 'Maximizing income tax deductions on property loans',
        body: 'Section 24(b) of the Income Tax Act permits deductions up to 2 lakh rupees annually on interest paid for a self occupied property. Additionally, principal repayments qualify for deductions up to 1.5 lakh rupees under section 80C, alongside one time stamp duty and registration fee deductions in the year of purchase.'
      },
      {
        heading: 'Accelerating principal repayment through automated prepayments',
        body: 'Adding just one additional EMI payment per year or increasing your monthly repayment by 5 percent annually can compress a 20 year loan tenure down to under 13 years, saving tens of lakhs in compound interest costs over the life of your facility.'
      }
    ]
  },
  {
    id: 'article-6',
    slug: 'bengaluru-luxury-residential-corridors',
    featured: false,
    title: 'Bengaluru luxury residential corridors: Whitefield, Indiranagar, and North Airport City',
    category: 'City guides',
    author: {
      name: 'Ananya Raghavan',
      role: 'Regional Research Lead, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '15 October 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'An insider architectural exploration of Bengaluru top neighborhoods, highlighting private villa enclaves, green canopy boulevards, and metro connectivity.',
    keyTakeaway: 'North Bengaluru near Bellary Road and Devanahalli offers the highest projected capital appreciation, while Indiranagar and Sadashivanagar remain premier bastions of generational prestige.',
    content: [
      {
        heading: 'Indiranagar and Defense Colony: timeless leafy elegance',
        body: 'Known for its classic low rise bungalows, tree lined avenues, and vibrant boutique dining, Indiranagar commands some of southern India highest per square foot real estate valuations. Supply remains strictly constrained, making independent residential plots and heritage villas generational heirloom assets.'
      },
      {
        heading: 'Whitefield: the epicentre of gated community innovation',
        body: 'Once a quiet Anglo Indian settlement, Whitefield has evolved into a global technology and luxury residential capital. Modern developments here feature expansive biophilic landscapes, private clubhouses, thermal insulation, and multi layer private security suites favored by senior tech leadership.'
      },
      {
        heading: 'The rise of North Bengaluru Airport corridor',
        body: 'Supported by international airport expansion, the upcoming Blue Line metro corridor, and multinational business campuses, northern Bengaluru represents Karnataka fastest expanding luxury corridor, attracting master planned villa estates and golf resort residences.'
      }
    ]
  },
  {
    id: 'article-7',
    slug: 'mumbai-luxury-coastal-road-impact',
    featured: false,
    title: 'How arterial expressways and coastal links are reshaping Mumbai property valuations',
    category: 'Market insights',
    author: {
      name: 'Vikramaditya Singhania',
      role: 'Real Estate Investment Strategist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '09 October 2026',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'A deep dive into high value residential appreciation across Worli, Bandra, and Marine Lines following modern infrastructure completions.',
    keyTakeaway: 'Direct high speed coastal connectivity has compressed transit times between Nariman Point and Bandra Kurla Complex to under 15 minutes, boosting prime sea view property valuations by over 24 percent.',
    content: [
      {
        heading: 'The transformation of South Mumbai transit dynamics',
        body: 'The completion of the Mumbai Coastal Road alongside the Atal Setu trans harbour sea link has redefined spatial distance in the financial capital. Commuters can now transit seamlessly from south Mumbai heritage commercial cores to western suburban residential enclaves without surface bottlenecks.'
      },
      {
        heading: 'Worli and Lower Parel: the luxury high rise renaissance',
        body: 'Worli has solidified its status as Mumbai most coveted residential boulevard. The delivery of seafront luxury towers featuring sprawling duplex penthouses, private elevators, and sea views has attracted family business offices and corporate leaders.'
      },
      {
        heading: 'Long term investment outlook for Mumbai prime property',
        body: 'With land supply permanently bounded by the Arabian Sea, premium developments backed by institutional developers (such as Oberoi, Lodha, and Godrej) continue to demonstrate superior capital resilience and sustained rental appeal.'
      }
    ]
  },
  {
    id: 'article-8',
    slug: 'carpet-area-vs-super-built-up-measurements',
    featured: false,
    title: 'Carpet area versus super built up: calculating true square footage value',
    category: 'Buying guides',
    author: {
      name: 'Advocate Radhika Menon',
      role: 'Senior Property Law Counsel',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '01 October 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Understand how marketing loading percentages distort effective property pricing, and why only RERA certified carpet area reveals genuine value.',
    keyTakeaway: 'Always calculate price per square foot using net usable carpet area rather than loading inflated figures. A seemingly cheaper unit on super built up area is often far more expensive in reality.',
    content: [
      {
        heading: 'The illusion of marketing loading ratios',
        body: 'Historically, property developers added between 30 to 50 percent loading over usable floor area to account for common elevators, lobbies, staircases, and generator rooms. A property advertised as 2,000 square feet often provided barely 1,300 square feet of actual living space.'
      },
      {
        heading: 'The legal mandate for carpet area pricing',
        body: 'Under current real estate regulations, all sale agreements, deeds, and official brochures must quote prices explicitly tied to RERA carpet area. Any discrepancy between sanctioned drawings and delivered carpet area entitles the buyer to a full proportionate price refund with statutory interest.'
      }
    ]
  },
  {
    id: 'article-9',
    slug: 'fractional-ownership-commercial-reits-guide',
    featured: false,
    title: 'Fractional ownership and REITs: accessible commercial real estate for modern investors',
    category: 'Real estate investment',
    author: {
      name: 'Vikramaditya Singhania',
      role: 'Real Estate Investment Strategist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    publishedDate: '24 September 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'How SEBI regulated small and medium REIT frameworks allow individual investors to participate in institutional Grade A commercial office towers with fractional capital.',
    keyTakeaway: 'SM REITs democratize institutional real estate, providing quarterly cash distributions and long term capital upside without direct property management liabilities.',
    content: [
      {
        heading: 'The evolution of fractional real estate ownership',
        body: 'Historically, investing in Grade A office buildings, tech parks, or institutional warehousing required hundreds of crores in capital. With new SEBI Small and Medium REIT (SM REIT) regulations, individual investors can own fractional shares in prime commercial assets starting from accessible investment tickets.'
      },
      {
        heading: 'Evaluating tenant quality and lease lock ins',
        body: 'Top tier commercial assets house Fortune 500 multinationals and leading financial institutions on long term nine year leases with pre scheduled rent escalations of 15 percent every three years, ensuring inflation indexed income stability.'
      }
    ]
  }
];

export function getFeaturedArticle() {
  return SAMPLE_ARTICLES.find((a) => a.featured) || SAMPLE_ARTICLES[0];
}

export function getRelatedArticles(currentSlug, category, limit = 3) {
  const others = SAMPLE_ARTICLES.filter((a) => a.slug !== currentSlug);
  const sameCategory = others.filter((a) => a.category === category);
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const remaining = others.filter((a) => a.category !== category);
  return [...sameCategory, ...remaining].slice(0, limit);
}
