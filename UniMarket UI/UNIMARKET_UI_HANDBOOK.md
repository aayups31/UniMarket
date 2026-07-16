# UniMarket UI Identity Handbook

---

# North Star

## What UniMarket is

UniMarket is a verified, campus-specific marketplace where university students buy and sell within their own university community.

The Waterloo MVP is the first expression of a larger architecture:

```text
one shared marketplace engine
+
one verified university identity
+
one deeply tailored campus experience
```

## The design mission

UniMarket should not merely function better than Facebook Marketplace or Kijiji. It should feel more considered, more personal, and more trustworthy.

The experience should make a Waterloo student feel:

1. **I belong here.**
2. **I understand this immediately.**
3. **I trust the people and the product.**
4. **This was made around how my campus actually works.**

## The visual ambition

The quality bar is an Awwwards-level sense of art direction paired with a production marketplace’s clarity and speed.

That does not mean giant cinematic type on every page, scroll hijacking, excessive transitions, ambiguous navigation, or experimental forms that sacrifice speed.

It means memorable composition, high-quality typography, signature motion, campus-specific identity, beautiful empty states, polished microinteractions, precise spacing, meaningful personalization, and no generic components left unconsidered.

## The product hierarchy

UniMarket should optimize in this order:

1. Clarity
2. Trust
3. Speed
4. Campus identity
5. Beauty
6. Delight

Beauty must strengthen the first four, never compete with them.

## One-sentence filter

> UniMarket is premium campus infrastructure disguised as an effortless student marketplace.

## What success looks like

A first-time Waterloo student should understand the product in under five seconds, sign in without confusion, find or post an item in minutes, and leave with the impression:

> “This feels like Waterloo built its own marketplace.”

---

# Current UI Audit

This audit is based on the supplied authentication and marketplace screenshots in `references/`.

## Current authentication screen

### What already works

- Strong black-and-warm-white split layout
- Clear hierarchy between brand panel and functional panel
- Good use of gold as an accent
- Premium spacing and clean form area
- Trustworthy, modern product tone
- Stronger than a typical student startup auth page

### What weakens identity

- “Built for Waterloo” pill feels like a generic startup badge
- Three benefit cards feel component-library driven
- “Campus finds, without the noise” is polished but generic
- Left panel explains features rather than expressing campus identity
- Right panel is functional but could reference the Waterloo inbox more directly
- The overall composition could belong to many campus startups after replacing the accent color

### Direction

Turn the left panel into a Waterloo campaign poster rather than a product-benefit panel.

```text
GO
BLACK
GO
GOLD

Waterloo buys
from Waterloo.

A private marketplace for verified
@uwaterloo.ca students.

DC · SLC · E7 · UWP · ICON · LESTER
```

Keep the right side calm and functional:

```text
Check your Waterloo inbox

Your campus is one click away.
```

## Current marketplace homepage

### What already works

- Clean and readable
- Strong top navigation
- Clear create-listing call to action
- Search and categories are immediately understandable
- Warm neutral canvas feels more premium than a default dashboard
- Good foundation for a high-end product UI

### What weakens identity

- “Find it on campus” could belong to any university
- Category cards feel like standard marketplace components
- The empty state is generic
- Large blank areas are not being used compositionally
- User information in the nav feels functional rather than personal
- No co-op, term, residence, campus-area, or program context
- Waterloo identity currently relies mostly on yellow

### Direction

Reframe the homepage around the student, not the marketplace taxonomy.

```text
Good afternoon, Aayu.
What do you need before your next co-op?

[ campus-aware search ]

Popular around Waterloo
Recently listed near you
Move-in / move-out essentials
For class
For your place
Free on campus
```

When inventory is empty, avoid pretending the marketplace is active:

```text
Waterloo starts here.

Be one of the first students to pass something on.
```

## What must not change

Do not convert the homepage into a dark cinematic landing page. The light canvas supports commerce imagery, improves readability, makes black and gold feel sharper, differentiates the product interface from the marketing site, and prevents visual fatigue.

The goal is not “more effects.” The goal is stronger authorship.

---

# Brand and Positioning

## Brand role

UniMarket is an independent marketplace brand with a Waterloo-native first experience.

It should feel close to the campus community without impersonating official university infrastructure.

## Positioning statement

> UniMarket is the verified marketplace for students at your university, starting at Waterloo.

## Waterloo MVP statement

> Buy and sell with verified Waterloo students in a marketplace built around campus life.

## Core distinction

Facebook Marketplace is built for everyone.

UniMarket is built around:

- one university
- one trusted student domain
- one local marketplace
- one shared campus rhythm

## Brand personality

UniMarket is confident, local, precise, warm, secure, quietly ambitious, design-conscious, and never try-hard.

UniMarket is not childish, slang-heavy, corporate, futuristic for no reason, aggressively sporty, overly prestigious, or exclusive in a hostile way.

## Product lines

- Waterloo buys from Waterloo.
- Built for students, not strangers.
- Your campus. Your marketplace.
- Verified here. Picked up nearby.

Use “GO BLACK. GO GOLD.” as a spirit motif, not the product value proposition.

## Naming hierarchy

```text
UniMarket
Waterloo Marketplace
Verified through @uwaterloo.ca
```

Do not overuse “Warrior” in every surface. Save it for completed sign-up, a welcome screen, a launch campaign, a seasonal banner, or a community milestone.

---

# Waterloo Identity

## Principle

Waterloo identity should emerge from the experience rather than sit on top of it.

A strong Waterloo screen uses local language, campus timing, pickup areas, student identity, co-op and term behavior, and disciplined black-and-gold art direction.

It does not rely on a large official logo, yellow on every component, mascot imagery everywhere, forced campus jokes, or copied university website patterns.

## Campus language

Use accurately and sparingly:

- Waterloo
- Warrior
- `@uwaterloo.ca`
- co-op term
- study term
- move-in
- move-out
- campus pickup
- DC
- SLC
- MC
- E7
- UWP
- V1
- REV
- CMH
- University Plaza
- ICON
- Lester
- Columbia
- Phillip

## Personalization moments

### First sign-in

```text
Welcome, Warrior.
Your Waterloo marketplace is ready.
```

### Returning user

```text
Good afternoon, Aayu.
Here’s what Waterloo students are listing today.
```

### Co-op period

```text
Heading out for co-op?
Pass on what you do not need.
```

### Move-in season

```text
New term. New space.
Find the essentials around Waterloo.
```

Do not fabricate inventory-specific claims.

## Signature visual motifs

Use original, non-official motifs:

- four horizontal gold bands
- blueprint-style campus grid
- condensed vertical typography
- black edge bars
- fine gold rules
- subtle coordinate or building-label typography
- warm ivory commerce canvas
- dark navy-black campaign surfaces

## Vertical spirit lockup

```text
GO
BLACK
GO
GOLD
```

Recommended treatment:

- tall condensed type
- stacked vertically
- partially cropped
- 5–10% opacity as background, or 100% in a controlled campaign moment
- never placed behind form fields
- no glow-heavy treatment

## Official marks

Before using official Waterloo or Warriors marks in production, confirm permission, use approved assets, preserve clear space, and do not recolor, distort, animate, merge with UniMarket branding, or imply endorsement.

---

# Design Tokens

## Core palette

### Dark campaign surfaces

```css
--um-ink-1000: #05070A;
--um-ink-950:  #080B12;
--um-ink-900:  #0D111A;
--um-ink-850:  #141923;
--um-ink-800:  #1B212C;
```

### Warm commerce canvas

```css
--um-canvas:       #F7F5F0;
--um-canvas-soft:  #FBFAF7;
--um-surface:      #FFFFFF;
--um-surface-warm: #F1EEE7;
```

### Gold system

```css
--um-gold-300: #FFE889;
--um-gold-400: #FFD84F;
--um-gold-500: #FFC928;
--um-gold-600: #DFA600;
--um-gold-700: #A97900;
```

### Text and border

```css
--um-text-strong:  #111318;
--um-text:         #333842;
--um-text-muted:   #747B87;
--um-text-inverse: #F7F7F4;

--um-border:       rgba(17, 19, 24, 0.10);
--um-border-dark:  rgba(255, 255, 255, 0.10);
--um-gold-border:  rgba(223, 166, 0, 0.34);
```

### Semantic

```css
--um-success: #168A55;
--um-warning: #C98500;
--um-danger:  #C73C45;
--um-info:    #356FD6;
```

## Color ratio

Product screens:

```text
65% warm canvas / white
20% ink and dark text
10% neutral surfaces
5% gold emphasis
```

Campaign/auth dark panels:

```text
75% ink
15% white and grey text
10% gold
```

## Radius

```css
--radius-xs: 8px;
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 22px;
--radius-xl: 30px;
--radius-pill: 999px;
```

Do not make every surface a rounded card.

## Shadows

```css
--shadow-xs: 0 1px 2px rgba(12, 15, 20, 0.05);
--shadow-sm: 0 8px 22px rgba(12, 15, 20, 0.08);
--shadow-md: 0 18px 45px rgba(12, 15, 20, 0.12);
--shadow-gold: 0 18px 55px rgba(223, 166, 0, 0.12);
```

## Focus

```css
--focus-ring: 0 0 0 3px rgba(255, 201, 40, 0.30);
```

## Icon system

Use one coherent outlined icon family. No emojis in the final UI. Use 1.75–2px strokes, rounded joins, standard 16/20/24px sizes, neutral by default, gold for active or verified states.

---

# Typography

## Goal

Typography should carry the premium feeling before motion or decoration does.

The system needs three roles: Product UI, condensed campus identity, and editorial campaign moments.

## Product UI

```css
font-family: "Geist", "Inter", Arial, sans-serif;
```

Use for navigation, forms, listing cards, prices, messages, profile data, buttons, and filters.

## Campus identity

```css
font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
```

Use for “GO BLACK. GO GOLD.”, section eyebrows, campus strip labels, launch banners, vertical typography, and compact metadata.

Use uppercase selectively with tracking between `0.06em` and `0.14em`.

## Editorial display

```css
font-family: Georgia, "Times New Roman", serif;
```

Use sparingly for campaign hero lines, launch moments, high-impact empty states, and editorial campus stories.

Do not use serif for prices, buttons, filters, or dense data.

## Scale

```text
Display XL: 72–104px desktop / 48–64px mobile
Display L:  52–72px desktop / 40–52px mobile
H1:         44–56px desktop / 34–42px mobile
H2:         30–40px desktop / 26–32px mobile
H3:         22–28px
Body L:     18–20px
Body:       15–17px
Small:      13–14px
Micro:      11–12px
```

## Rules

- No more than three type families
- No gradient body text
- No script fonts in the product
- No oversized type without a compositional reason
- Avoid fake luxury through excessive serif use
- Maintain readable line lengths
- Prices use strong product sans typography
- Form labels remain visible even when placeholders disappear

---

# Layout and Spacing

## Product layout philosophy

UniMarket should feel spacious without feeling empty.

Whitespace should create hierarchy, confidence, focus, and room for product imagery. It should not create dead zones, disconnected sections, or unfinished-looking pages.

## Container widths

```text
Full shell:        1440–1600px max
Content container: 1180–1320px max
Form container:     720–860px max
Reading width:      620–720px max
```

## Grid

Desktop: 12 columns, 24px gutters, 64–96px outer margins.

Tablet: 8 columns, 20px gutters.

Mobile: 4 columns, 16px gutters, 20px page padding.

## Vertical rhythm

- 48px compact product section
- 64px standard
- 96px editorial
- 128px only for major campaign moments

## Navbar

Recommended:

```text
[ UniMarket ] [ Browse ] [ My listings ] [ Create listing ]      [ identity ] [ sign out ]
```

Requirements:

- 64–72px height
- sticky with subtle border
- no excessive blur
- Create Listing remains primary
- avoid cluttering top nav with every future feature

## Responsive principle

Mobile is not a compressed desktop. Recompose with stacked actions, bottom-sheet filters, sticky bottom CTA, collapsed identity details, and preserved type hierarchy.

---

# Authentication Experience

## Purpose

Authentication is the first proof that UniMarket is truly campus-specific.

## Structure

Desktop split screen:

```text
Left: Waterloo campaign identity
Right: authentication task
```

Mobile:

```text
Compact identity header
Authentication task
Small campus footer
```

## Left panel

Remove generic product-benefit pills and cards. Use a campaign poster composition.

```text
UniMarket

GO
BLACK
GO
GOLD

Waterloo buys
from Waterloo.

A private marketplace for verified
@uwaterloo.ca students.

Built for move-ins, move-outs,
co-op terms, and everything between.

DC · SLC · E7 · UWP · ICON · LESTER
```

Visual treatment:

- deep ink background
- faint blueprint/campus grid
- restrained radial gold light
- vertical condensed typography
- no random icons
- no AI-style pills
- no feature-card row

## Email entry

```text
Enter your Waterloo email
Only verified @uwaterloo.ca students can join.
```

Placeholder:

```text
yourname@uwaterloo.ca
```

## Magic-link / OTP screen

```text
Check your Waterloo inbox
Your campus is one click away.
```

```text
We sent a secure sign-in link to ap35sing@uwaterloo.ca.
```

Quiet note:

```text
Open the newest link on this device. It expires shortly and can only be used once.
```

## Welcome transition

```text
Welcome, Warrior.
Your Waterloo marketplace is ready.
```

Use a brief four-band gold wipe under 700ms and respect reduced motion.

## Profile completion

Collect name, program, year, and approximate residence/area. Do not request or publicly expose exact address.

---

# Marketplace Home

## Goal

The homepage should feel like a personal Waterloo dashboard for campus commerce, not a generic listings grid.

## Hero

Use a contextual greeting:

```text
Good afternoon, Aayu.
What do you need before your next co-op?
```

Fallback:

```text
Waterloo’s marketplace.
Built for students, not strangers.
```

## Search

Search is the primary action. Rotate placeholders by context:

- Search monitors, textbooks, furniture…
- Find something around Waterloo…
- Looking for a desk before move-in?
- Search for your next co-op setup…

Do not imply inventory exists if it does not.

## Campus context strip

```text
DC · SLC · E7 · UWP · ICON · LESTER · COLUMBIA · PHILLIP
```

This is a quiet identity element and may become interactive later.

## Categories

Initial categories:

- Electronics
- Books
- Household
- Clothing

Presentation should be premium and icon-led, but not oversized.

## Empty marketplace state

Do not fabricate activity.

```text
Waterloo starts here.

Be one of the first students to pass something on.
```

Support:

```text
Your listing could help another student furnish a room, prepare for class, or move into a new term.
```

CTA:

```text
Create the first listing
```

## Populated hierarchy

1. Recently listed
2. Near your area
3. For class
4. For your place
5. Free on campus
6. Move-in / move-out essentials
7. Saved items

Only show sections with real data.

## Personalization

Safe personalization includes time of day, user name, program/year, selected pickup area, saved searches, recently viewed categories, and term season.

Avoid creepy or over-specific language.

## Listing cards

Include image, title, price, condition, pickup area, posted time, and verified Waterloo seller state.

Hover: 2px rise, 1–2% image scale, stronger border, save reveal, no large glow.

## Background

Retain the warm neutral canvas. Add identity with faint linework, a thin gold rule, contextual typography, subtle cropped “WATERLOO” or “BLACK / GOLD” at low opacity, and asymmetry—not more cards.

---

# Create Listing

## Goal

Creating a listing should feel like a high-end product experience while remaining recognizably a form.

A student should complete a strong listing in under two minutes.

## Required fields

- images
- title
- description
- category
- condition
- price
- approximate pickup location

## Page structure

Desktop:

```text
Left: form
Right: sticky live preview
```

Mobile:

```text
Single-column form
Sticky publish bar
Preview opens in full-screen sheet
```

## Header

```text
Pass it on.
Create a listing for another Waterloo student.
```

Use “Create a listing” as the clear functional label too.

## Image upload

```text
Add photos
Show the item clearly from a few angles.
```

Requirements: 1–6 images, reorder, remove, progress, validation, first image marked as cover, drag-and-drop desktop, native picker mobile.

## Title

Placeholder:

```text
Dell 24-inch monitor with stand
```

Helper:

```text
Include the item type, brand, and one useful detail.
```

## Description

```text
Selling before co-op. Works perfectly and includes the stand, HDMI cable, and power cable. Small cosmetic marks on the back; no damage to the screen.
```

## Category

- Electronics
- Books
- Household
- Clothing

No emojis in final product.

## Condition

- New
- Like New
- Good
- Fair
- Well Used

Each includes one sentence of explanation.

## Price

- CAD prefix
- support $0 / Free
- optional Open to offers
- max two decimals

## Location

Use approximate areas only:

- Waterloo Campus
- University Plaza
- ICON
- UWP
- REV
- V1
- CMH
- Lester
- Columbia
- Phillip
- Other nearby area

Helper:

```text
Share the exact meetup point privately after agreeing on the sale.
```

## Drafts

Autosave, explicit Save Draft, restore unfinished listing, leave-page warning, discard confirmation.

## Success

```text
Listed for Waterloo.
Your item is now visible to verified students on campus.
```

---

# Listing Details

## Goal

The detail page should feel trustworthy, image-led, and calm.

## Desktop

```text
Image gallery | Listing information
```

## Mobile

```text
Gallery
Title
Price
Seller
Key details
Description
Safety
Sticky contact action
```

## Hierarchy

1. Title
2. Price
3. Condition and category
4. Approximate area
5. Seller identity
6. Description
7. Posted date
8. Safety information

## Seller card

```text
Aayu S.
Verified Waterloo Student
Computer Science · 3A
Member since 2026
```

Do not expose exact address, student number, personal phone number by default, or private profile data.

## Contact

Primary: Message seller

Secondary: Save

## Safety

```text
Meet in a public campus location and inspect the item before completing the exchange.
```

---

# Messaging

## Goal

Messaging should feel direct, safe, and anchored to the listing.

## Desktop

```text
Conversation list | Active conversation | Listing context
```

## Mobile

```text
Conversation list → Active conversation
```

## Header

Always show listing thumbnail, title, price, availability, and View listing.

## Suggested starters

- Hi, is this still available?
- Would you accept $100?
- Could we meet near campus?
- Is the item still in the same condition as shown?

## Safety

- no phone number shown by default
- no exact address in profile
- report and block controls
- visible moderation entry point

## Visual identity

Messaging is quieter than marketing: neutral canvas, gold only for key actions, subtle campus label, no decorative conversation animations, fast send and optimistic UI.

---

# Profile and Trust

## Goal

Profiles should prove membership and accountability without becoming social-media profiles.

## Public profile

Show only:

- first name + last initial
- verified Waterloo student
- program
- year
- joined date
- active listings
- completed transaction count later
- ratings later, only after meaningful volume

## Private data

Never show publicly:

- full email
- exact address
- phone number
- student number
- authentication metadata

## Reputation

Do not launch with fake trust scores. Start with verifiable facts: university email verified, member since, active listings, response time later, completed exchanges later.

## Profile design

```text
Aayu Pratap Singh
Computer Science · 3A
Verified through @uwaterloo.ca
```

Use one strong gold verification mark, not many badges.

---

# Admin and Moderation

## Principle

Moderation should be powerful internally and invisible publicly.

## Admin identity

The moderator account does not appear as a public seller, has no searchable profile, cannot rely on client-side role checks, and receives permissions from secure server-side role enforcement.

## Capabilities

- remove listing
- record reason
- view listing owner
- review reports
- restore listing
- preserve audit log
- suspend user later
- block prohibited categories later

## Delete flow

Require reason, confirmation, server-side authorization, and audit record.

## UI

Admin tools live in a separate protected interface. Do not show destructive actions in normal listing UI unless authorized.

---

# Motion and Transitions

## Principle

Motion should make the interface feel authored, not animated. It should communicate hierarchy, state change, direction, confidence, and campus identity at key moments.

## Timing

```text
Microinteraction: 120–180ms
Card:             180–240ms
Panel:            220–320ms
Page:             300–450ms
Signature wipe:   450–700ms
```

## Easing

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

## Signature transition

Original four-band gold wipe:

```text
black
deep gold
gold
bright gold
```

Use only for successful onboarding, first marketplace entry, campus launch campaigns, and successful publish.

## Standard motion

- card hover: translateY(-2px)
- image hover: scale(1.015)
- filter panel: slide + fade
- modal: opacity + small scale
- list appearance: subtle stagger
- search suggestions: height + opacity
- save icon: quick state morph

## Cursor effects

Cursor-follow glow belongs on marketing/campaign surfaces only. Do not use it in forms, marketplace feed, messaging, or future payment flows.

## Reduced motion

Respect `prefers-reduced-motion`.

---

# Copywriting

## Voice

UniMarket sounds clear, local, confident, helpful, lightly expressive, and never over-written.

## Avoid

- revolutionizing campus commerce
- seamless ecosystem
- unlock your potential
- empowering students
- next-generation marketplace
- AI-powered unless describing a real feature
- fake urgency
- forced Gen Z slang

## Preferred patterns

### Clear first

```text
Create a listing
Message seller
Search Waterloo
Choose a pickup area
```

### Campus-aware second

```text
Waterloo buys from Waterloo.
Built for move-ins, move-outs, co-op terms, and everything between.
```

## Auth

```text
Enter your Waterloo email
Check your Waterloo inbox
Welcome, Warrior.
```

## Homepage

```text
Good afternoon, Aayu.
What do you need before your next co-op?
```

## Empty inventory

```text
Waterloo starts here.
Be one of the first students to pass something on.
```

## Create listing

```text
Pass it on.
Create a listing for another Waterloo student.
```

## Microcopy rule

Copy should sound like a product team wrote it after observing students, not like a brand generator produced it.

---

# Empty, Loading, Error, and Success States

## Empty states

### No listings

```text
Waterloo starts here.
Create one of the first listings for the campus community.
```

### No search results

```text
No matches around Waterloo.
Try a broader search or remove a filter.
```

### No messages

```text
No conversations yet.
Message a seller when something catches your eye.
```

## Loading

Prefer skeletons over generic spinners: listing cards, image galleries, conversations, and profiles.

## Errors

Be specific:

- We could not upload that image. Try a JPG, PNG, or WebP under 5 MB.
- That listing could not be published. Your draft is safe.
- The sign-in link expired. Request a new one.
- You no longer have permission to edit this listing.

Never clear user work after failure.

## Success

```text
Listed for Waterloo.
Welcome, Warrior.
Listing removed.
```

---

# Responsive Design, Accessibility, and Performance

## Mobile first

Requirements:

- 44px minimum touch targets
- sticky bottom primary actions
- native-feeling image upload
- no horizontal overflow
- keyboard-safe forms
- bottom-sheet filters
- readable price and metadata
- fast back navigation
- preserved draft state

## Accessibility

- semantic HTML
- correct heading hierarchy
- visible labels
- visible focus
- screen-reader names
- alt text
- non-color selection states
- reduced motion
- sufficient contrast
- accessible form errors
- logical keyboard order

Gold on white should not be used for essential text without contrast verification.

## Performance

```text
LCP under 2.5s
CLS near zero
INP under 200ms
```

Use optimized responsive images, compressed uploads, lazy loading, minimal animation bundles, server-rendered initial shell, stable layouts, cached categories/theme config, and optimistic UI where safe.

A slow Awwwards-looking marketplace is not premium. It is frustrating.

---

# Anti–Vibe-Coded Rules

A product looks vibe coded when it feels assembled from fashionable decisions rather than designed from a coherent system.

## Never ship

- random gradients
- fake metrics
- fake testimonials
- oversized headings with no purpose
- identical rounded cards for every section
- excessive pill badges
- multiple icon styles
- excessive glassmorphism
- generic startup copy
- unexplained decorative blobs
- hover effects on everything
- glowing borders on every card
- more than three font families
- emojis in final category UI
- motion that delays navigation
- university identity reduced to colors

## Component test

Every component must answer:

1. What user problem does this solve?
2. Why is it here?
3. Why does it look this way?
4. Does it belong to the same system?
5. Is it still useful without animation?
6. Does it feel specific to Waterloo through context rather than decoration?

## Screen test

- Is the primary action obvious?
- Is information easy to scan?
- Is there one memorable identity element?
- Is gold restrained?
- Is typography intentional?
- Is the page fast?
- Are empty/error/loading states designed?
- Does the page avoid pretending traction?
- Would a Waterloo student recognize their context?

---

# Component Inventory

## Foundations

- AppShell
- ProductNavbar
- MobileTabBar
- CampusStrip
- PageHeader
- SectionHeader
- GoldRule
- VerificationMark
- UniversityThemeProvider

## Authentication

- AuthCampaignPanel
- UniversityEmailField
- OtpInput
- MagicLinkStatus
- WelcomeTransition
- ProfileCompletionForm

## Marketplace

- MarketplaceHero
- SearchBar
- SearchSuggestions
- CategorySelector
- FilterBar
- FilterSheet
- ListingGrid
- ListingCard
- EmptyMarketplaceState
- CampusContextModule

## Listing creation

- ImageDropzone
- ImageReorderGrid
- TitleField
- DescriptionField
- CategoryCards
- ConditionSelector
- PriceField
- OffersToggle
- PickupAreaCombobox
- ListingLivePreview
- DraftStatus
- PublishReview

## Details

- ListingGallery
- ListingSummary
- SellerTrustCard
- SafetyNotice
- MessageSellerButton

## Messaging

- ConversationList
- ConversationRow
- MessageThread
- MessageComposer
- ListingContextHeader
- ReportAction

## Profile

- ProfileHeader
- VerifiedStudentState
- ActiveListings
- PrivateProfileSettings

## Admin

- ModeratorShell
- ReportQueue
- ListingReviewPanel
- RemoveListingDialog
- AuditLog

---

# University Theme Engine

## Principle

The backend and product logic remain shared. University identity is data-driven.

Do not hardcode Waterloo colors, strings, and locations across components.

## Suggested model

```ts
export type UniversityTheme = {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  colors: {
    ink: string;
    canvas: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    ui: string;
    condensed: string;
    editorial: string;
  };
  copy: {
    communityName: string;
    welcome: string;
    verification: string;
    marketplaceTagline: string;
  };
  locations: string[];
  seasonalCampaigns: SeasonalCampaign[];
  legalDisclosure: string;
};
```

## Waterloo configuration

```ts
{
  id: "uwaterloo",
  name: "University of Waterloo",
  shortName: "Waterloo",
  domain: "uwaterloo.ca",
  colors: {
    ink: "#080B12",
    canvas: "#F7F5F0",
    primary: "#FFC928",
    secondary: "#DFA600",
    accent: "#FFE889"
  },
  typography: {
    ui: "Geist",
    condensed: "Barlow Condensed",
    editorial: "Georgia"
  },
  copy: {
    communityName: "Waterloo Marketplace",
    welcome: "Welcome, Warrior.",
    verification: "Verified through @uwaterloo.ca",
    marketplaceTagline: "Waterloo buys from Waterloo."
  },
  locations: [
    "Waterloo Campus", "University Plaza", "ICON", "UWP", "REV",
    "V1", "CMH", "Lester", "Columbia", "Phillip"
  ]
}
```

A new university should require domain mapping, theme configuration, local areas, campus-aware copy, and launch campaign assets—not a duplicated application.

---

# UI Implementation Roadmap

## Phase 1 — Foundations

- design tokens
- font loading
- theme provider
- app shell
- navigation
- button/input primitives
- accessible focus system
- motion utilities
- responsive container system

## Phase 2 — Authentication identity

- campaign auth panel
- Waterloo email entry
- magic-link/OTP state
- profile completion
- welcome transition
- mobile auth composition

## Phase 3 — Marketplace shell

- personalized hero
- search
- category selector
- empty marketplace state
- populated listing grid
- listing card
- responsive filters

## Phase 4 — Create listing

- image upload
- fields
- live preview
- autosave
- validation
- publish review
- success state

## Phase 5 — Listing details

- gallery
- seller trust card
- safety
- contact action
- save

## Phase 6 — Messaging

- conversation list
- thread
- listing context
- responsive behavior

## Phase 7 — Moderation

- protected admin shell
- listing removal
- reason and audit log

## Phase 8 — Polish

- skeletons
- empty states
- errors
- reduced motion
- accessibility audit
- performance audit
- visual consistency audit
- mobile testing
- cross-browser testing

## Acceptance criteria

A screen is not complete until it has default, hover/focus, loading, empty, and error states; responsive and keyboard behavior; analytics where needed; and secure authorization behavior.

---

# Final QA Checklist

## Identity

- [ ] Feels specific to Waterloo without relying only on yellow
- [ ] Uses campus-aware copy appropriately
- [ ] Does not imply official university affiliation
- [ ] Official marks are used only with permission
- [ ] “Warrior” is used sparingly

## Visual

- [ ] Typography roles are consistent
- [ ] Gold is restrained
- [ ] No random gradients
- [ ] No excessive cards or pills
- [ ] One memorable signature element per key screen
- [ ] Light and dark surfaces feel part of one system

## Product

- [ ] Main action is obvious
- [ ] Search is central
- [ ] Listing creation is under two minutes
- [ ] Empty states are honest
- [ ] No fake traction
- [ ] Exact addresses are not shown

## Motion

- [ ] Animations communicate state
- [ ] Nothing delays action
- [ ] Reduced motion works
- [ ] Cursor effects are limited to campaign surfaces

## Accessibility

- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Contrast checked
- [ ] Screen-reader labels
- [ ] Form errors linked to fields
- [ ] Touch targets at least 44px

## Anti–vibe-coded

- [ ] Every component has a reason
- [ ] Copy sounds human
- [ ] Components do not look copied from unrelated templates
- [ ] The screen still works without motion
- [ ] Campus identity comes from context
