# Home Page Redesign — Requirements

## 1. Background

BudgetCargo is a UK-to-Malawi logistics service based in Leeds. The current home page covers the right content but needs a full overhaul: the visual design feels dated, navigation is not intuitive enough, conversion is weak, and the mobile experience needs improvement.

## 2. Goals

- Modernise the visual identity with a bold, vibrant aesthetic that builds trust and energy
- Improve conversion — turn more visitors into customers (quote requests, order bookings)
- Serve two equal audiences: diaspora individuals shopping for family, and businesses/resellers importing goods
- Deliver a polished mobile-first experience
- Retain all existing sections but redesign each one for clarity and impact

## 3. Target Audiences

### Persona A — Diaspora Individual
- Malawian living in the UK
- Shops online (Amazon, ASOS, eBay) and wants to send goods home
- Cares about price, reliability, and ease of tracking
- Likely on mobile, may share via WhatsApp

### Persona B — Business / Reseller
- Imports goods to Malawi for resale
- Ships 20kg+ regularly, price-sensitive at scale
- Needs clear bulk pricing, customs handling info, and reliable dispatch schedule

## 4. Functional Requirements

### FR-1: Navigation
- Sticky header that remains visible on scroll
- Mobile hamburger menu for small screens
- Clear CTA ("Book a Shipment") always visible in the header

### FR-2: Hero Section
- Bold headline communicating the UK ↔ Malawi value proposition
- Sub-headline addressing both personas (individuals and businesses)
- Two CTAs: primary "Start an Order", secondary "View Pricing"
- Key stats (price per kg, processing time, 24/7 tracking) displayed prominently
- Visually engaging — use colour, imagery, or illustration to create energy

### FR-3: Services Section
- Four service cards: Shop & Ship, Admin & Duty, Door-to-Door, Automated Tracking
- Each card has an icon, title, and short description
- Cards should feel interactive (hover states, visual depth)

### FR-4: Pricing Section
- Four pricing tiers clearly displayed
- Highlight the 20kg+ "Best Value" tier
- Include a note about duty/customs being included
- Consider an interactive weight estimator or calculator

### FR-5: Automation / How It Works Section
- Step-by-step visual timeline of the shipping process
- Four steps: Parcel received → Consolidation → Flight → Pickup
- Should feel dynamic and easy to scan

### FR-6: Order / Quote Form
- Floating label inputs for: name, email, phone, parcel description, weight, delivery preference
- Add-ons: priority slot (+£12), enhanced insurance (+£6)
- Live quote summary panel that updates as user fills the form
- "Generate Quote" CTA and "Send to WhatsApp" secondary action

### FR-7: Footer
- Contact details (UK and Malawi phone numbers, email)
- UK drop-off addresses
- Malawi pickup locations
- Social handles

## 5. Non-Functional Requirements

### NFR-1: Visual Design
- **Colour Theme**: Light blue and white as primary, with bold accent colours for energy
  - Primary: Light blue (#4A90E2 or similar) — trust, logistics, movement
  - Secondary: White (#FFFFFF) — clean, modern, clarity
  - Accents: Vibrant complementary colours (e.g., coral, teal, gold) for CTAs, highlights, and emphasis
  - Background: Mostly white with light blue accents and gradient overlays
  - Text: Dark grey/charcoal on light backgrounds for contrast
- High contrast for readability
- Consistent use of the BudgetCargo brand (logo, typography)
- Space Grotesk font retained or upgraded

### NFR-2: Responsiveness
- Fully responsive across mobile (320px+), tablet, and desktop
- Mobile layout tested for all sections
- Touch-friendly tap targets (min 44px)

### NFR-3: Performance
- Images lazy-loaded
- No render-blocking scripts
- Smooth scroll animations (intersection observer, already in use)

### NFR-4: Accessibility
- Semantic HTML structure
- Sufficient colour contrast ratios
- All interactive elements keyboard-navigable
- Alt text on all images

### NFR-5: Compatibility
- Works in modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers

## 6. Constraints

- Must remain a static HTML/CSS/JS site (no framework migration)
- Existing `app.js` logic for the order form and quote calculation must be preserved
- Existing API integrations (`/api/orders`, `/api/payment/checkout`) must remain functional
- Logo (`logo.jpg`) must be used as-is

## 7. Success Metrics

- Increased quote form submissions
- Reduced bounce rate
- Improved mobile usability score
- Positive user feedback on visual design
