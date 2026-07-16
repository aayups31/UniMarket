# UniMarket — Create Listing Experience
### Design Specification (MVP v1)

---

# Philosophy

Creating a listing should feel premium.

Not corporate.

Not overwhelming.

Not like filling out paperwork.

Not like Facebook Marketplace.

Not like Kijiji.

Not like Craigslist.

Instead, the experience should feel like something designed by Apple, Linear, Notion and Airbnb.

The user should enjoy creating a listing.

Every interaction should feel intentional.

The interface should disappear and let the user focus entirely on their item.

---

# Core Design Principles

The Create Listing page should communicate:

- trust
- simplicity
- craftsmanship
- quality
- speed

Every design decision should reinforce that UniMarket is built specifically for Waterloo students.

The page should never feel generic.

---

# User Experience Goals

A first-time user should be able to create a beautiful listing in under 2 minutes.

The form should naturally guide them from top to bottom.

There should never be a moment where the user asks:

> "What do I do next?"

The experience should feel almost conversational.

---

# Visual Style

The page should feel:

✓ premium

✓ modern

✓ minimal

✓ spacious

✓ calm

✓ responsive

✓ elegant

The experience should rely on:

- whitespace
- typography
- hierarchy
- subtle motion
- micro interactions

—not visual clutter.

---

# Overall Layout

Large centered container.

Maximum width:

```
780px
```

Generous whitespace.

Every section separated with breathing room.

The form should scroll naturally.

Nothing should feel cramped.

Desktop should feel luxurious.

Mobile should feel effortless.

---

# Header

Large title.

```
Create Listing
```

Subtitle

```
Sell something to another Waterloo student in just a few minutes.
```

Below this:

Small progress indicator

```
Images
↓

Details
↓

Pricing

↓

Publish
```

---

# Images Section

This should be the hero.

Large upload area.

Rounded corners.

Beautiful empty state.

Placeholder illustration.

Text:

```
Drag & Drop Images

or

Browse Files
```

Helper

```
Add clear photos from multiple angles.
The first image becomes the cover photo.
```

Requirements

- Drag & Drop

- Multiple upload

- Image preview

- Reorder images

- Remove image

- Upload progress

- Smooth animation

Image cards should gently animate into place.

No jarring transitions.

---

# Title

Label

```
Title
```

Placeholder

```
Dell 24-inch Monitor with Stand
```

Helper

```
Keep it short and descriptive.
```

Live character counter.

Validation only after interaction.

---

# Description

Large textarea.

Placeholder

```
Selling before my co-op term.

Monitor works perfectly.

Includes:

• Stand
• HDMI cable
• Power cable

No dead pixels.
Small cosmetic marks on the back.
```

Helper

```
Describe what you're selling honestly.

Mention what's included and any defects.
```

Auto expand while typing.

---

# Category

Instead of a dropdown.

Beautiful category cards.

Large.

Clickable.

Hover animation.

Categories

💻 Electronics

📚 Books

🏠 Household Items

👕

Clothing

Only one selectable.

Selected card should animate.

---

# Condition

Instead of dropdown.

Segmented cards.

```
New

Like New

Good

Fair

Well Used
```

Each option contains

Title

+

Short explanation

Example

```
Like New

Barely used with almost no signs of wear.
```

---

# Price

Input

```
$ CAD
```

Placeholder

```
120
```

Below

Toggle

```
Open to Offers
```

Helper

```
Choose a fair price based on the condition.
```

---

# Pickup Area

Never request exact address.

Instead

```
Pickup Area
```

Placeholder

```
ICON, Lester Street, UWP...
```

Autocomplete suggestions.

Popular Waterloo areas

- ICON

- UWP

- REV

- CMH

- V1

- Lester Street

- University Plaza

- Waterloo Campus

Allow custom entry.

---

# Live Preview

Desktop only.

Sticky preview card.

Updates in real-time while typing.

Shows

Image

Title

Price

Condition

Category

Location

Seller

Exactly how buyers will see it.

This dramatically increases confidence before publishing.

---

# Buttons

Bottom row

Secondary

```
Save Draft
```

Primary

```
Publish Listing
```

Primary button should feel premium.

Subtle hover.

Soft shadow.

No glowing neon.

---

# Empty States

Everything should feel intentional.

Never show blank screens.

Use:

small illustrations

friendly guidance

beautiful spacing

Example

```
No photos yet.

Add your first image to make your listing stand out.
```

---

# Motion Design

Animations should feel expensive.

Not flashy.

Use

- Framer Motion

- Spring animations

- Fade

- Scale

- Shared Layout transitions

- Smooth hover

- Soft page transitions

Never over animate.

Animations should communicate:

quality.

---

# Colors

Inspired by Waterloo.

Not literally copying Waterloo branding.

Use

Primary

```
#FFD54F
```

Accent

```
Black
```

Neutral palette

Lots of white space.

Light gray surfaces.

Gold only where attention is needed.

---

# Typography

Professional typography.

No AI-looking fonts.

Use:

Geist

or

Inter

Consistent hierarchy.

Excellent spacing.

Readable at every size.

---

# Components

Use

- shadcn/ui

- Radix UI

- TailwindCSS

Every component should feel handcrafted.

Avoid default browser styling.

---

# Accessibility

Keyboard navigation.

Screen reader labels.

Visible focus states.

Proper contrast.

Responsive.

Accessible by default.

---

# Validation

Validation should feel helpful.

Never punish users.

Bad

```
Invalid Input
```

Good

```
Please add at least one image before publishing.
```

Bad

```
Missing title
```

Good

```
Give your listing a title so other students know what you're selling.
```

---

# Security

Validate on server.

Never trust client input.

Use

Supabase RLS

Input validation

Image validation

Rate limiting

Secure uploads

---

# Performance

Lazy load images.

Optimise uploads.

Compress previews.

Fast navigation.

Instant interactions.

No loading flashes.

---

# Final Feeling

The user should finish creating a listing and think:

> "That was easier than Facebook Marketplace."

It should feel like software built with craftsmanship.

Minimal.

Beautiful.

Trustworthy.

Designed specifically for Waterloo students.

A user should immediately feel:

> **"This wasn't built for everyone.
This was built for us."**