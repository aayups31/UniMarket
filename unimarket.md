# UniMarket – Development Roadmap (Next Phase)

## Goal

Build the first functional MVP of UniMarket focused entirely on the University of Waterloo. The objective is not feature completeness, but a polished, trustworthy, and production-quality marketplace experience.

---

# Phase 1 — Authentication & User Onboarding

## Authentication

Use **Supabase Auth** with email and password authentication. Signup requires a Waterloo email, a strong password, and one verification link sent through Supabase's default email provider. After verification, normal login uses email and password and does not send another email. Branded templates are deferred until production preparation.

### Requirements

- Only allow emails ending in:

```
@uwaterloo.ca
```

Any other domain should be rejected before authentication.

---

## User Registration

After successful email verification, collect the following information:

- Full Name
- University Email (prefilled + locked)
- Program
- Year
- Address / Residence
    - Optional examples:
        - ICON
        - UWP
        - REV
        - CMH
        - Lester
        - Other

Store user information inside the Users table.

---

## Users Table

Fields:

- id
- full_name
- email
- program
- year
- address
- university
- email_verified
- role
- created_at
- updated_at

Role defaults to:

```
student
```

Moderator accounts:

```
moderator
```

---

# Moderator Account

Provision a moderator account through a trusted administrative path using an
exact Waterloo address:

```
Email:
moderator@uwaterloo.ca
```

Requirements:

- Hidden profile
- Does not appear in marketplace
- Cannot create public listings
- Can:
    - delete listings
    - remove inappropriate content
    - view reports (future)

---

# Phase 2 — Marketplace

After login:

```
Marketplace Home
```

---

## Initial Categories

Keep categories intentionally small.

### Electronics

Examples

- Monitors
- Laptop
- Keyboard
- Mouse
- Headphones
- Tablet

---

### Household Items

Examples

- Desk
- Chair
- Mini Fridge
- Microwave
- Lamp
- Kitchen Items

---

### Books

Examples

- Textbooks
- Novels
- Study Guides

---

### Clothing

Examples

- Hoodies
- Jackets
- Shoes
- Accessories

---

# Listings

Each listing contains:

- Title
- Description
- Price
- Category
- Images
- Seller
- Date Posted

Optional (future)

- Condition
- Negotiable
- Pickup Location

---

Users should be able to:

- Create Listing
- Edit Own Listing
- Delete Own Listing

Moderator can delete any listing.

---

# Marketplace Feed

Homepage should contain:

- Search Bar
- Categories
- Featured Listings
- Recent Listings

Search should search:

- title
- description
- category

---

# UI / UX Vision

## Overall Style

The experience should feel like:

> "This was built specifically for Waterloo students."

NOT

> "Generic marketplace with a Waterloo logo."

---

## Design Principles

- Minimal
- Premium
- Modern
- Fast
- Clean typography
- Excellent spacing
- No visual clutter

Avoid:

- generic gradients
- AI-looking fonts
- glassmorphism everywhere
- over-animated interfaces

Animations should be subtle and purposeful.

---

## Waterloo Identity

Incorporate:

- Waterloo colours
- Waterloo branding inspiration
- Waterloo-inspired layouts
- Campus-specific terminology

Examples

- Verified Waterloo Student
- Marketplace for Waterloo
- Built for Waterloo Students

The experience should immediately feel local.

---

## Interaction Design

Use smooth:

- page transitions
- hover effects
- fades
- wipes
- loading states
- skeleton loaders

Every interaction should feel intentional.

---

# Security

Use production-ready practices.

Authentication

- Supabase Auth
- Protected Routes
- Session validation
- Secure middleware

Database

- Row Level Security (RLS)
- Policies
- Server-side validation

Uploads

- Validate images
- Restrict file size
- Safe storage buckets

Forms

- Input validation
- Sanitization
- Rate limiting where applicable

Never trust client-side validation.

---

# Technologies

Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion

Backend

- Supabase
- PostgreSQL
- Row Level Security

Deployment

- Vercel

---

# Engineering Standards

The project should be written as if preparing for production.

Requirements

- Modular folder structure
- Strong typing
- Reusable components
- Consistent naming
- Clean architecture
- Proper error handling
- Accessible UI
- Responsive design

Avoid quick fixes or hacky implementations.

---

# Testing

Every feature should be tested before moving forward.

Authentication

- Valid Waterloo email
- Invalid email domain
- Email/password signup, verification, login, and recovery
- Login
- Logout
- Session persistence

Marketplace

- Create listing
- Edit listing
- Delete listing
- Search listings
- Category filtering

Moderator

- Delete any listing
- Hidden moderator profile
- Access restrictions

---

# MVP Success Criteria

A Waterloo student should be able to:

1. Sign up using a verified @uwaterloo.ca email.
2. Complete their profile.
3. Browse a clean Waterloo-themed marketplace.
4. Search and filter listings.
5. Create a listing.
6. Edit or delete their own listings.
7. Trust that the marketplace is exclusive to verified Waterloo students.

If these are achieved with a polished, intuitive experience, the MVP is successful.
