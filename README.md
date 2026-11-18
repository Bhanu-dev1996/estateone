# EstateOne — Verified Real Estate Marketplace

A luxury verified real estate marketplace designed for premier Indian destinations. Built with React 18, Tailwind CSS v4, and shadcn component primitives with Apple inspired clean glassmorphism and an Airbnb style search capsule.

---

## Overview

EstateOne connects discerning property seekers with verified property owners, builders, and licensed advisors across premier Indian cities (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, and Goa). Every listed property features state RERA validation, physical inspection records, and direct seller contact without ghost listings or hidden charges.

---

## Technology Stack

- **Framework:** React 18 + Vite 5
- **Styling Engine:** **Tailwind CSS v4** (`@tailwindcss/vite` CSS first engine with `@theme` directives in `src/index.css`)
- **UI Architecture:** **shadcn UI component primitives** powered by headless **Radix UI** + `tailwind-merge` + `clsx`
- **Iconography:** Phosphor Icons (`@phosphor-icons/react`)
- **Typography:** Manrope (Headings & Action Buttons) and Geist (Body Copy)

---

## Key Features and Architectural Highlights

### 1. Airbnb Style Search Capsule in Hero
- **Floating Capsule Layout:** A unified floating pill container housing segmented search fields.
- **Transparent Fields:** Custom styled dropdown triggers without background or box shadow for an ultra clean, seamless aesthetic.
- **Segmented Search Dimensions:**
  - **Where:** Destination cities selector (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, Goa).
  - **Type:** Property category (Apartment, Villa, Penthouse, Commercial).
  - **Price:** Budget brackets (Under ₹2 Cr, ₹2 Cr to ₹6 Cr, Above ₹6 Cr).
  - **Rooms:** Bedroom configurations (2 Bed rooms, 3 Bed rooms, 4 Bed rooms, 5+ Bed rooms).
- **Top Intent Tabs:** Switchers for `Buy property`, `Rent property`, `Commercial`, and `Luxury villas` paired with a live inventory verification badge.
- **Quick Filter Chips:** Instant filter buttons for popular property categories.

### 2. Apple Inspired Floating Navigation with Active Scroll Spy
- **Glassmorphism Bar:** Centered pill navbar with backdrop blur (`backdrop-blur-2xl`) and diffused ambient lighting.
- **Active Navigation Color:** Active menu links highlighted with a deep navy pill (`bg-brand-navy text-white shadow-xs`) inside a segmented glass dock.
- **Automatic Scroll Tracking:** Powered by `IntersectionObserver` to track page position in real time across all landmark sections (`#properties`, `#why-us`, `#how-it-works`, `#verification`, `#faq`).
- **Responsive Sheet Drawer:** Sliding mobile menu preserving all navigation targets and instant actions.

### 3. Verified Properties Catalog and Real Time Filter Engine
- **Borderless Cards:** Frosted glass cards without borders (`border-0`), utilizing diffused soft elevations per design standards.
- **Instant Search Input:** Live text search filtering properties by locality, project title, or keywords with a clear button.
- **Active Filter Bar:** Removable filter pills displaying currently applied criteria with a single click `Clear all` reset button.
- **Category Tabs:** Fast switching between *All types*, *Apartments*, *Villas*, *Penthouses*, and *Commercial*.
- **Trust Architecture Console:** Interactive 3 tier verification protocol detailing legal RERA registry checks, geotagged physical inspections, and direct title owner authorization.

### 4. Property Detail Modal with Isolated Body Scroll
- **Fixed Pinned Header:** Stays locked at the top of the modal with RERA certification, verification status, property title, and close button.
- **Scrollable Body:** Only the body content scrolls (`overflow-y-auto`), housing the high resolution photo gallery, thumbnail preview switcher, detailed specifications grid, verified amenities checklist, partner advisor credentials, and architectural floor layout preview.
- **Fixed Pinned Action Footer:** Stays locked at the bottom displaying the total price, direct phone call trigger, and schedule visit booking CTA.

### 5. Client Side Site Visit Booking Workflow
- **Pre-filled Property Details:** Thumbnail, location, and price passed directly from the selected card.
- **Field Validation:** Full name required, 10 digit Indian mobile number check, email structure validation, date picker, and visit type toggle (*In person* or *Video tour*).
- **Confirmation State:** Live loading spinner transitioning into a booking confirmation screen with coordinator response guarantee.

### 6. Legal and Regulatory Disclosures
- **Compliance Modal:** Dedicated modal views for `Privacy Policy`, `RERA Compliance Disclaimer`, and `Terms and Conditions`.
- **RERA Coverage:** Full disclosure covering MahaRERA, Karnataka RERA, Telangana RERA, and HRERA.

---

## Component Architecture

```
src/
├── components/
│   ├── ui/                         # shadcn / Radix component primitives
│   │   ├── accordion.jsx           # WAI ARIA accessible collapsible FAQ accordion
│   │   ├── badge.jsx               # Status, category, and verification badges
│   │   ├── button.jsx              # Semantic buttons with primary, secondary, and accent variants
│   │   ├── card.jsx                # Frosted glass card containers (border-0 by default)
│   │   ├── dialog.jsx              # WAI ARIA dialogs with backdrop blur and focus trap
│   │   ├── input.jsx               # Accessible text input primitives
│   │   ├── label.jsx               # Radix form label primitives
│   │   ├── select.jsx              # Radix dropdown select primitives (zero box shadow styling)
│   │   ├── separator.jsx           # Semantic divider rule
│   │   ├── sheet.jsx               # Mobile navigation sliding drawer
│   │   ├── tabs.jsx                # Segmented tab controls
│   │   └── textarea.jsx            # Multi-line text inputs
│   ├── Benefits.jsx                # Outcome driven problem to solution comparison console
│   ├── EnquiryModal.jsx            # Interactive site visit booking modal with validation
│   ├── FAQ.jsx                     # Frequently asked questions with support contact action
│   ├── FinalCTA.jsx                # Closing call to action with risk reversals
│   ├── Footer.jsx                  # Semantic footer with city filters and legal disclaimers
│   ├── Hero.jsx                    # Hero section with Airbnb capsule search fields
│   ├── HowItWorks.jsx              # Three step property discovery walkthrough
│   ├── LegalModal.jsx              # Privacy, RERA, and Terms compliance dialog
│   ├── Logo.jsx                    # EstateOne custom architectural monogram and wordmark
│   ├── Navbar.jsx                  # Floating glass pill navbar with active scroll spy
│   ├── ProofShowcase.jsx           # Properties catalog with active filters and verification console
│   ├── PropertyDetailModal.jsx     # Detail popup with isolated body scroll and fixed header/footer
│   └── TaglineReveal.jsx           # Mandatory word by word tagline reveal animation
├── data/
│   └── properties.js               # Verified property catalog dataset and filter options
├── lib/
│   └── utils.js                    # clsx and tailwind-merge helper utility
├── App.jsx                         # Main application orchestrator and state management
├── index.css                       # Tailwind CSS v4 CSS first theme tokens and font rules
└── main.jsx                        # React root entry point
```

---

## Design System Guidelines

- **Typography Scale:**
  - Manrope: Headings (`heading-1` through `heading-6`), brand titles, and action buttons.
  - Geist: Body copy (`body-1` through `body-5`) and metadata labels.
- **Palette Tokens:**
  - Deep Navy: `#142B4A` (`--color-brand-navy`)
  - Royal Blue: `#2563EB` (`--color-brand-blue`)
  - Champagne Gold: `#C5A46D` (`--color-brand-gold`)
  - Surface Background: `#F7F8FA` (`--color-brand-bg`)
  - Card Diffusion: `bg-white/75` with `backdrop-blur-2xl`
- **Zero Visible Hyphens Rule:** All user facing headings, copy, and button labels strictly omit hyphens (e.g. *3 BHK*, *Ready to move*, *three tier*).
- **Sentence Case Standard:** All headings, button labels, and navigation items are written in sentence case.

---

## Development and Build Scripts

Navigate into the project directory:

```bash
cd e:\WEBSITES\estateone
```

### Install Dependencies
```bash
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
```

### Production Build
Compile optimized production assets:
```bash
npm run build
```

### Preview Production Build
Locally preview the generated `dist/` production build:
```bash
npm run preview
```
