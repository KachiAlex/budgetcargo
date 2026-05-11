# Home Page Redesign — Design

## 1. Design System

### Colour Palette
- **Primary**: Light Blue (#4A90E2) — trust, logistics, movement
- **Secondary**: White (#FFFFFF) — clean, modern, clarity
- **Accents**: 
  - Coral (#FF6B6B) — CTAs, highlights, energy
  - Teal (#1ABC9C) — secondary CTAs, success states
  - Gold (#F39C12) — badges, premium features
- **Neutral**: Dark Grey (#2C3E50) for text, Light Grey (#ECF0F1) for backgrounds
- **Gradients**: Light blue to white, light blue to teal for visual depth

### Typography
- **Font Family**: Space Grotesk (existing)
- **Headings**: Bold (700), 32px–48px depending on hierarchy
- **Body**: Regular (400), 16px–18px
- **Labels**: Medium (500), 14px

### Spacing & Layout
- 16px base unit for consistent spacing
- Max-width: 1200px for content
- Mobile-first: 16px padding on mobile, 32px on tablet+
- Sections separated by 64px vertical spacing

### Components
- **Buttons**: 
  - Primary CTA: Coral background, white text, 12px padding, rounded corners (8px)
  - Secondary CTA: Light blue border, light blue text, white background
  - Ghost CTA: Transparent, light blue text, border on hover
- **Cards**: White background, light shadow (0 2px 8px rgba(0,0,0,0.1)), rounded corners (12px)
- **Icons**: Lucide icons, 24px–32px, light blue or coral depending on context
- **Input Fields**: Light grey border, light blue focus state, floating labels

---

## 2. Page Structure & Sections

### Header (Sticky)
**Layout**: Flex row, space-between
- Left: BudgetCargo logo (40px height)
- Center: Navigation links (Services, Pricing, Automation, Order, Contact) — hidden on mobile, hamburger menu shown
- Right: "Book a Shipment" CTA button (coral)

**Styling**:
- Background: White with subtle light blue bottom border (2px)
- Padding: 16px 32px
- Box shadow: 0 2px 4px rgba(0,0,0,0.05)
- Sticky positioning: top: 0, z-index: 100

**Mobile**: 
- Logo on left, hamburger menu on right
- Navigation links in a slide-out drawer (overlay)

---

### Hero Section
**Layout**: Two-column grid on desktop, stacked on mobile
- Left column: Hero content (text, stats, CTAs)
- Right column: Hero banner (collage of images and cards)

**Left Column Content**:
- Badge: "🇬🇧 UK Fulfilment ➜ 🇲🇼 Malawi Delivery" (light blue background, rounded pill)
- Headline: "Ship smart between the UK and Malawi without breaking the bank." (48px, bold, dark grey)
- Subheadline: "We consolidate your online shopping, clear customs, and deliver right to Lilongwe & Blantyre with transparent pricing and automated status alerts." (18px, regular, dark grey)
- CTAs: 
  - Primary: "Start an Order" (coral button)
  - Secondary: "View Price List" (light blue ghost button)
- Stats Grid (3 columns on desktop, 1 on mobile):
  - Stat 1: "7.5 £/kg" + "Economy freight from 20kg+"
  - Stat 2: "96 hrs" + "Average UK warehouse processing"
  - Stat 3: "24/7" + "Automated tracking & notifications"
  - Each stat has a light blue left border (4px) and light grey background

**Right Column Banner**:
- Grid layout: 2 rows, 2 columns
- Row 1:
  - Card 1 (primary photo): Image of happy shopper, caption "You shop it • We ship it" (overlay text, white, bottom-left)
  - Card 2 (price card): Light blue background, white text
    - "From £7.5 per kg" (eyebrow)
    - "Landscape freight board" (heading)
    - Price list (0-5kg: £45, 5-10kg: £82, 10-20kg: £8.3/kg, 20kg+: £7.5/kg)
    - Footnote: "Inclusive of duty & customs. Spare parts admin MK 15,000."
- Row 2:
  - Card 3 (secondary photo): Image of cargo/logistics, flag badge "🇬🇧 ➜ 🇲🇼 Express Lane" (overlay, top-right)
  - Card 4 (info card): White background, light grey border
    - "Touchpoints" (eyebrow)
    - UK addresses (24 Hilton Rd, 35 Foxhill Ct)
    - Malawi pickups (Lilongwe CBD, Blantyre Ginnery Corner)
    - Info grid: Tracking (WhatsApp + Email), Dispatch (Every Friday)

**Styling**:
- All cards: 12px border radius, subtle shadow
- Images: 100% width, object-fit: cover
- Spacing: 16px gap between cards

**Mobile**: 
- Single column layout
- Banner cards stack vertically
- Stats displayed as 1 column

---

### Services Section
**Layout**: 4-column grid on desktop, 2 columns on tablet, 1 column on mobile

**Section Header**:
- Eyebrow: "What we handle" (light blue, 14px, medium)
- Heading: "End-to-end logistics built for UK shopping fans in Malawi." (32px, bold, dark grey)
- Description: "Use our UK addresses for your favourite stores, consolidate everything and let us deal with customs, duty, and last-mile delivery." (16px, regular, dark grey)

**Service Cards** (4 total):
1. Shop & Ship
2. Admin & Duty
3. Door-to-Door
4. Automated Tracking

**Card Layout**:
- Icon: 48px, light blue, centered at top
- Title: 20px, bold, dark grey
- Description: 16px, regular, dark grey
- Background: White with light grey border (1px)
- Padding: 32px
- Border radius: 12px
- Hover state: Light blue background, shadow lift (0 8px 16px rgba(74, 144, 226, 0.15))

---

### Pricing Section
**Layout**: 4-column grid on desktop, 2 columns on tablet, 1 column on mobile

**Section Header** (inline layout):
- Left: 
  - Eyebrow: "Transparent pricing" (light blue, 14px, medium)
  - Heading: "Flat rates inspired by our flyer deals." (32px, bold, dark grey)
- Right:
  - Note: "Prices include duty & customs. Some categories may attract surcharges—we'll confirm before invoicing." (14px, regular, dark grey, light grey background, padding 16px, rounded 8px)

**Pricing Cards** (4 total):
1. 0–5kg: £45 flat
2. 5–10kg: £82 flat
3. 10–20kg: £8.30 / kg
4. 20kg+: £7.50 / kg (marked as "Best value" with gold star badge)

**Card Layout**:
- Tier label: 14px, medium, light blue
- Price: 36px, bold, dark grey
- Unit: 14px, regular, dark grey
- Description: 14px, regular, dark grey
- Background: White with light grey border (1px)
- Padding: 32px
- Border radius: 12px
- Hover state: Light blue border (2px), shadow lift

**Best Value Card** (20kg+):
- Background: Light blue gradient (light blue to teal)
- Text: White
- Badge: Gold star + "Best value" text, positioned top-right

---

### Automation / How It Works Section
**Layout**: Two-column on desktop, stacked on mobile
- Left: Text content (eyebrow, heading, tick list)
- Right: Timeline visualization

**Left Column**:
- Eyebrow: "Automation spotlight" (light blue, 14px, medium)
- Heading: "Order orchestration that works while you sleep." (32px, bold, dark grey)
- Tick List (4 items):
  - Instant intake numbers for every parcel.
  - Auto-handled customs paperwork and HS codes.
  - Smart routing to Lilongwe / Blantyre with ETAs.
  - Payment links triggered once weight is confirmed.
  - Each item: Check circle icon (teal, 20px), text (16px, regular, dark grey)

**Right Column — Timeline**:
- 4 steps, vertical layout on desktop, horizontal scroll on mobile
- Each step:
  - Icon: 40px, light blue or teal, centered
  - Title: 16px, bold, dark grey
  - Description: 14px, regular, dark grey
  - Connector line between steps (light blue, 2px, vertical on desktop, horizontal on mobile)
- Step 1: Package icon — "Parcel lands at Leeds hub — automated photograph + weight capture."
- Step 2: File check icon — "Consolidation window closes — SMS sent with draft invoice."
- Step 3: Plane icon — "Flight departs to Malawi — customs pre-clearance initiated."
- Step 4: Handshake icon — "Ready for pickup — WhatsApp bot schedules delivery slot."

**Styling**:
- Background: Light grey (ECF0F1)
- Padding: 64px 32px
- Border radius: 12px

---

### Order / Quote Form Section
**Layout**: Two-column on desktop, stacked on mobile
- Left: Form (60% width on desktop)
- Right: Live summary panel (40% width on desktop)

**Form**:
- Floating label inputs (6 fields):
  1. Full name
  2. Email address
  3. WhatsApp / Phone
  4. Parcel description (textarea)
  5. Total weight (kg) (number input)
  6. Delivery preference (select dropdown)
- Add-ons (2 checkboxes):
  1. Priority flight slot (+£12)
  2. Enhanced insurance (+£6)
- Submit button: "Generate Quote" (coral, 48px height, full width on mobile)

**Input Styling**:
- Border: 1px light grey
- Focus state: Light blue border (2px), light blue shadow
- Floating label: Positioned above input on focus or when filled
- Padding: 12px 16px

**Live Summary Panel**:
- Title: "Live summary" (eyebrow, light blue)
- Heading: "Awaiting your form" (20px, bold, dark grey) — updates to show quote details
- Empty state: Icon (document), description text
- Populated state: List of items (name, email, weight, delivery option, add-ons), total price (bold, coral, 24px)
- Actions (shown when form is populated):
  - Primary: "Proceed to Payment" (coral button)
  - Secondary: "Send to WhatsApp" (light blue ghost button)

**Styling**:
- Background: Light grey (ECF0F1)
- Padding: 32px
- Border radius: 12px
- Border: 1px light blue

**Mobile**:
- Form and summary stack vertically
- Summary panel below form

---

### Footer
**Layout**: 4-column grid on desktop, 2 columns on tablet, 1 column on mobile

**Columns**:
1. Contact us
   - Phone: +44 7756 168 494
   - Phone: +265 997 948 857
   - Email: budgetcargomw@gmail.com
2. UK drop-off
   - 24 Hilton Road, Chapel Allerton, Leeds LS8 4HA
   - 35 Foxhill Court, Weetwood Lane, Leeds LS16 5PN
3. Malawi pickup
   - City Centre, Lilongwe • Opposite Reserve Bank
   - Ginnery Corner, Blantyre • Cargo Wing
4. Social
   - @budget_cargo
   - #YouShopItWeShipIt

**Styling**:
- Background: Dark grey (2C3E50)
- Text: White
- Headings: 16px, bold, white
- Body: 14px, regular, light grey
- Padding: 64px 32px
- Border-top: 2px light blue

---

## 3. Responsive Breakpoints

- **Mobile**: 320px–767px
  - Single column layouts
  - Hamburger menu for navigation
  - Reduced padding (16px)
  - Smaller font sizes (14px body, 28px headings)
  - Full-width buttons

- **Tablet**: 768px–1023px
  - 2-column grids where applicable
  - Padding: 24px
  - Navigation visible (horizontal)

- **Desktop**: 1024px+
  - Full multi-column layouts
  - Padding: 32px
  - Max-width: 1200px

---

## 4. Interactions & Animations

- **Scroll Reveal**: Sections fade in as they enter the viewport (existing intersection observer)
- **Hover States**: 
  - Service cards: Light blue background, shadow lift
  - Pricing cards: Light blue border, shadow lift
  - Buttons: Slight scale (1.05), shadow lift
  - Links: Light blue underline on hover
- **Form Interactions**:
  - Floating labels animate up on focus
  - Input focus: Light blue border, subtle glow
  - Live summary updates in real-time as form is filled
- **Smooth Scroll**: Anchor links scroll smoothly to sections

---

## 5. Implementation Notes

- Use existing `app.js` for form logic and quote calculation
- Preserve all API integrations (`/api/orders`, `/api/payment/checkout`)
- Lazy-load images for performance
- Use Lucide icons (already included)
- CSS Grid and Flexbox for layout
- Mobile-first CSS approach
- No framework changes — vanilla HTML/CSS/JS only
