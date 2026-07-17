# UniMarket Final MVP UI Handbook

# UniMarket — Final MVP UI Package

This package defines the final visual and interaction direction for the University of Waterloo MVP of UniMarket.

The current product is already functional and noticeably stronger than its first version. The remaining task is not “add more UI.” It is to replace flat, repetitive, box-driven design with a more immersive, image-led, Waterloo-specific product identity.

## North-star feeling

> UniMarket should feel like Waterloo built its own premium marketplace — not like a generic marketplace with Waterloo colours layered on afterward.

## Final design priorities

1. Preserve speed, clarity, trust, accessibility, and mobile usability.
2. Move from pure black, bright white, and saturated yellow to layered ink, warm stone, and restrained brass/gold.
3. Reduce repeated cards, equal grids, visible borders, and rectangular planarity.
4. Use real product photography, campus imagery, and original Waterloo-inspired graphics.
5. Make the marketplace feel alive without fabricating users, transactions, or demand.
6. Make Waterloo identity emerge through co-op rhythms, campus locations, student life, and verified university identity.
7. Keep UniMarket clearly independent unless official affiliation is obtained.

## Reading order

1. `00_FINAL_DIRECTION.md`
2. `01_CURRENT_UI_AUDIT.md`
3. `02_VISUAL_AND_COLOR_SYSTEM.md`
4. `03_TYPOGRAPHY_AND_COMPOSITION.md`
5. `04_WATERLOO_IDENTITY.md`
6. `05_IMAGERY_AND_ART_DIRECTION.md`
7. Screen-specific documents
8. `10_ANTI_VIBE_CODED_RULES.md`
9. `11_IMPLEMENTATION_AND_QA.md`

## One decisive test

Hide the UniMarket logo and the word “Waterloo.” Would a Waterloo student still feel that the product understands co-op, move-in, move-out, campus pickup, and local student life?

If not, the product is themed rather than personalized.


---

<!-- 00_FINAL_DIRECTION.md -->

# Final Direction

## Current position

The UI is already above the level of a typical student project. The typography is confident, the messaging is grounded, the listing flow is well structured, and the product has a clear black/gold identity.

The remaining weakness is visual sameness:

- rectangle after rectangle
- equal card grids
- large flat colour fields
- repeated borders
- long cream surfaces
- too few images
- too much UI acting as decoration

This makes the product look well-generated rather than fully art-directed.

## Final visual objective

The MVP should combine:

```text
premium marketplace usability
+
editorial campaign art direction
+
Waterloo student-life context
+
calm dark-mode depth
```

## Desired mood

Use:

- deep navy-black instead of pure black
- warm stone instead of bright white
- muted brass instead of constant bright yellow
- realistic product photos
- campus atmosphere
- subtle texture and grain
- asymmetric layouts
- large image anchors
- flowing section transitions
- fewer visible containers

Avoid:

- full-screen saturated yellow except for a rare launch moment
- every section inside a rounded card
- repeated four-column grids
- generic line-icon boxes
- decorative gradients with no relationship to campus or product
- fake activity

## Product hierarchy

The design must optimize in this order:

1. clarity
2. trust
3. speed
4. campus specificity
5. beauty
6. delight

Beauty must strengthen the first four.


---

<!-- 01_CURRENT_UI_AUDIT.md -->

# Current UI Audit

## Landing page

### Strong

- bold opening headline
- clear CTA hierarchy
- credible, Waterloo-specific copy
- honest illustrative marketplace preview
- strong editorial typography

### Weak

- flat black hero is harsh over a full viewport
- right-side preview is another bordered rectangle
- the page depends heavily on text and boxes
- campus identity is mostly colour and wording
- dark-to-light transitions are abrupt
- category section returns to equal squares

### Final change

- use layered ink and subtle campus photography in the hero
- replace the UI-preview box with an image-led product collage or one immersive product frame
- blend sections using gradients, overlapping images, and a shared gold line
- introduce one real campus visual in every two major sections

## Why Waterloo

The current consulting-style rows are clean but predictable.

Replace four equal horizontal rows with a more editorial composition:

```text
large statement
+
campus image or map
+
2–3 concise reasons
```

## How it works

The three equal columns feel templated.

Use a flowing journey:

1. Waterloo inbox
2. browse or pass it on
3. meet around campus

Let one stage be image-led, one typographic, and one functional.

## Marketplace home

### Strong

- greeting is personalized
- search is central
- campus strip is specific
- empty state is honest
- navigation is clear

### Weak

- large rounded hero card
- narrow black side panel feels attached rather than integrated
- category cards repeat the same shape
- empty inventory leaves too much blank space
- no product photography means no visual life

### Final change

- integrate hero into a darker page shell
- use campus image/map texture on the right
- redesign categories with images and varied proportions
- add an image-rich, honest founding-state section
- use product images as soon as real listings exist

## Create listing

### Strong

- “Pass it on” is excellent
- form flow is thoughtful
- live preview is useful
- placeholders and guidance are strong

### Weak

- long cream page
- wall of rectangular selectors
- condition options consume too much space
- preview card looks generic
- publish section is another boxed panel

### Final change

- dark outer shell with warm central form
- compact condition selector
- image-backed categories
- darker live preview
- fewer border boxes
- progressive disclosure where possible


---

<!-- 02_VISUAL_AND_COLOR_SYSTEM.md -->

# Visual and Colour System

## Two connected worlds

### Campaign world

Used for:

- landing
- authentication
- launch moments
- onboarding success

Characteristics:

- deep and immersive
- image-led
- editorial
- bold but controlled

### Product world

Used for:

- marketplace
- create listing
- listing details
- messages
- profile

Characteristics:

- dark or warm-neutral shell
- high readability
- product imagery
- subtle campus identity
- restrained gold

## Recommended palette

### Ink

```css
--ink-1000: #05070B;
--ink-950:  #080C13;
--ink-900:  #0D131D;
--ink-850:  #131B27;
--ink-800:  #1B2532;
```

### Stone

```css
--stone-50:  #F7F4EE;
--stone-100: #F0ECE4;
--stone-200: #E6E0D6;
--stone-300: #D6CEC0;
--stone-700: #6C675F;
```

### Gold

```css
--gold-200: #F9E7A2;
--gold-300: #F2D56F;
--gold-400: #E7BC35;
--gold-500: #C99812;
--gold-600: #9A7200;
```

Use bright yellow only for:

- primary CTA
- selected state
- onboarding success
- one signature visual line

Use brass for:

- labels
- dividers
- fine linework
- small icon details
- restrained emphasis

## Dark product surfaces

```css
--surface-main:   #111923;
--surface-raised: #17212D;
--surface-soft:   #1E2936;
--surface-warm:   #211F1B;
```

## Seamless transitions

Do not stack:

```text
black
white
yellow
black
```

Instead:

- ink hero fading into charcoal
- charcoal blending into stone
- stone interrupted by a dark image band
- gold line connecting sections
- repeated map/grid texture across worlds

## Gold ratio

Keep gold to approximately 3–7% of a product screen.

## Borders

Most surfaces should use tone, spacing, and shadow instead of borders.

Dark:

```css
border: 1px solid rgba(255,255,255,0.07);
```

Light:

```css
border: 1px solid rgba(12,16,22,0.08);
```


---

<!-- 03_TYPOGRAPHY_AND_COMPOSITION.md -->

# Typography and Composition

## Type roles

### Product sans

Use Geist, Inter, or a similarly neutral licensed sans for:

- navigation
- forms
- prices
- listings
- messages
- buttons
- metadata

### Condensed identity font

Use Barlow Condensed or another properly licensed condensed sans for:

- Waterloo labels
- campus strip
- “GO BLACK / GO GOLD”
- section numbers
- vertical rails
- small editorial captions

### Editorial serif

Use a licensed serif such as Instrument Serif or Georgia for:

- “Pass it on.”
- selected campaign statements
- one strong empty-state title
- limited landing-page moments

Do not use serif for dense product UI.

## Break equal grids

Avoid repeated four-equal-card structures.

Use:

- 2/3 + 1/3 splits
- one large image and two smaller modules
- staggered rows
- cropped content at viewport edges
- horizontal image bands
- asymmetrical mosaics

## Negative space

Blank space is premium only when it is anchored by:

- large type
- an image
- directional composition
- a visual rail
- a meaningful caption

Blank cream space with no visual anchor feels unfinished.

## Rectangular repetition

A screen may contain cards, but should not be composed entirely of cards.

Target balance:

```text
40% open layout
30% imagery
20% structured surfaces
10% accents/overlays
```


---

<!-- 04_WATERLOO_IDENTITY.md -->

# Waterloo Identity

## Identity through context

Use:

- @uwaterloo.ca verification
- co-op and study-term language
- move-in and move-out moments
- campus pickup areas
- program and year
- local weather/season only when reliably available
- campus photography
- original map linework
- controlled black/gold spirit

## Local language

Use naturally:

- Waterloo
- Warrior
- co-op
- study term
- Ring Road
- DC
- SLC
- MC
- E7
- UWP
- V1
- REV
- CMH
- ICON
- Lester
- Columbia
- Phillip
- University Plaza

## Copy examples

```text
Good evening, Aayu.
Find what you need before the next term begins.
```

```text
Heading out for co-op?
Pass on what you will not need.
```

```text
Pickup around ICON
```

```text
Waterloo starts here.
```

```text
Listed for Waterloo.
```

## Signature phrases

Use sparingly:

- Waterloo buys from Waterloo.
- Built for students, not strangers.
- From one Warrior to another.
- Verified here. Picked up nearby.
- Pass it on.
- GO BLACK. GO GOLD.

Do not attach “Warrior” to every control.

## Official marks

Use University of Waterloo or Warriors assets only with permission.

Do not:

- merge them with the UniMarket logo
- recolour them
- animate them
- use them as generic decoration
- imply endorsement

Prefer an independent UniMarket mark and original Waterloo-inspired motifs.


---

<!-- 05_IMAGERY_AND_ART_DIRECTION.md -->

# Imagery and Art Direction

## Why imagery matters

The marketplace feels empty because the UI itself currently supplies almost all visual content.

Real imagery adds:

- life
- authenticity
- product desire
- context
- depth
- rhythm

## Product photography

Use realistic photos of:

- monitors
- keyboards
- mini fridges
- lamps
- chairs
- desks
- textbooks
- calculators
- jackets
- microwaves
- bicycles
- kitchen items

Style:

- student environment
- natural light
- slightly imperfect
- realistic framing
- muted/warm grade
- no ecommerce cutout look
- no obvious AI artefacts

## Campus photography

Use selectively:

- Dana Porter
- SLC
- E7
- Ring Road
- campus paths
- residence exteriors
- winter campus
- student rooms
- architecture details

Use as:

- dark hero texture
- full-width divider
- side panel
- low-opacity background
- section transition

Do not turn the marketplace into a campus tourism page.

## Original graphics

Create:

- campus route lines
- building-label typography
- subtle coordinate grids
- architectural contours
- four-line gold motif
- cropped W shapes
- map fragments

Avoid floating blobs and arbitrary gradients.

## MVP image library

Prepare:

- 1 dark campus hero
- 1 warm campus divider
- 4 category images
- 8 demo listing images for testing
- 1 map-line graphic
- 1 subtle grain texture

Demo listings must be clearly labelled as illustrative, not live inventory.

Use only owned, licensed, public-domain, or approved images.


---

<!-- 06_LANDING_AND_AUTH.md -->

# Landing and Authentication

## Landing hero

Keep the core message:

```text
A marketplace built for students, not strangers.
```

Reduce forced line breaks and let one phrase carry the gold accent.

### Right-side visual

Replace the small bordered UI preview with one of:

- product collage
- student-room transformation
- campus image with marketplace overlays
- one large edge-to-edge product frame

### Background

Use:

- layered ink
- subtle campus image
- faint map/grid
- soft gold haze
- small campus caption
- restrained grain

## Section transitions

Blend hero into the next section using:

- image overlap
- dark-to-stone gradient
- shared gold horizon
- repeated map line

## Why Waterloo

Use one large visual and fewer explanatory rows.

## How it works

Create a flowing visual journey:

```text
Waterloo inbox
→ browse or pass it on
→ campus pickup
```

Avoid equal columns.

## Categories

Use an image mosaic with different proportions.

## Final CTA

Do not use a full saturated yellow viewport.

Use deep ink, warm stone, or an image-led split with one gold CTA.

## Authentication

Left campaign panel:

```text
GO
BLACK
GO
GOLD

Waterloo buys
from Waterloo.
```

Right functional panel:

```text
Check your Waterloo inbox
Your campus is one click away.
```

Use warm stone rather than bright white.

After verification:

```text
Welcome, Warrior.
```

Use a brief four-line gold wipe before entering the marketplace.


---

<!-- 07_MARKETPLACE_HOME.md -->

# Marketplace Home

## Shell

Use:

```text
deep ink navigation
+
dark personalized hero
+
warm stone feed
```

This creates a darker, smoother experience without making every product screen black.

## Hero

Remove the large white rounded-card feeling.

Use a full-width dark editorial header with search embedded inside it.

Copy:

```text
Good morning, Aayu.
What do you need before your next co-op?
```

The right side may contain:

- cropped campus photo
- map fragment
- one seasonal campaign
- “Waterloo buys from Waterloo” visual

Avoid the narrow attached black panel.

## Search

Use a soft raised dark field with a restrained gold focus state.

## Categories

Replace five equal cards with a varied mosaic:

- one large All Listings tile
- two medium image tiles
- two compact text/image tiles

Use real category imagery.

## Recently listed

When listings exist:

- image-first 3–4 column grid on desktop
- 2 columns tablet
- 1–2 columns mobile
- minimal borders
- price and location highly readable

When empty:

```text
Waterloo starts here.
Be one of the first students to pass something on.
```

Add a campus image, product collage, or vertical “FIRST LISTING” rail.

## Background fillers

Use:

- image band between hero and feed
- faint map behind categories
- dark footer
- photographic crop behind empty state
- editorial caption rail

Do not fabricate activity.


---

<!-- 08_LISTINGS_AND_CREATE_FLOW.md -->

# Listings and Create Flow

## Listing cards

Cards should be image-first.

Structure:

```text
image
title
price
pickup area · time
verified seller
```

Use:

- very subtle border or no border
- small hover lift
- image zoom below 2%
- one verification state
- minimal chips

Break the feed every 6–8 items with:

- a wide featured listing
- campus image
- seasonal strip
- category editorial tile
- safety reminder

## Create listing shell

Recommended:

```text
dark outer canvas
+
warm central form
+
dark sticky preview
```

## Header

Keep:

```text
Pass it on.
```

Add subtle map or campus texture behind it.

## Progress

Use a thin rail:

```text
Photos — Details — Price & pickup — Publish
```

## Photos

Make upload the largest visual moment.

## Category

Use image-text options instead of four identical boxes.

## Condition

Use a compact segmented selector:

```text
New | Like new | Good | Fair | Well used
```

Show explanation only for the selected state.

## Live preview

Make it look like the actual final listing card, with:

- realistic image ratio
- location
- seller
- condition
- offers state
- dark or warm surface

## Publish

Use a dark confirmation block with one gold CTA.

Success:

```text
Listed for Waterloo.
```


---

<!-- 09_MOTION_COPY_ACCESSIBILITY.md -->

# Motion, Copy, Accessibility, and Performance

## Motion

Motion should connect surfaces, not decorate them.

Signature moments:

- CTA expands into auth
- four-line gold onboarding wipe
- listing card expands into detail view
- live preview becomes published card

Timing:

```text
micro: 120–180ms
component: 180–260ms
page: 300–450ms
signature: 450–650ms
```

No animation should block input.

Respect reduced motion.

## Copy voice

Use:

- clear
- local
- confident
- human
- lightly expressive

Avoid:

- revolutionizing
- seamless ecosystem
- unlock
- next-generation
- empowering students
- discover endless possibilities
- fake urgency

## Accessibility

- semantic HTML
- keyboard navigation
- visible focus
- contrast-checked gold
- alt text
- minimum 44px touch targets
- accessible upload controls
- errors linked to fields
- selected states that do not rely only on colour

## Performance

Targets:

```text
LCP under 2.5s
CLS near zero
INP under 200ms
```

Use optimized responsive images, lazy loading, compressed textures, minimal animation JS, and no uncompressed background videos.


---

<!-- 10_ANTI_VIBE_CODED_RULES.md -->

# Anti–Vibe-Coded Rules

## Never ship

- four equal cards when asymmetry would work
- every section inside a rounded container
- excessive visible borders
- emoji category icons
- fake statistics
- fake testimonials
- random gradients
- floating decorative blobs
- generic startup language
- identical radii everywhere
- large blank cream areas with no visual anchor
- excessive saturated gold
- pages made only of text, icons, and rectangles
- inconsistent icon styles
- obvious AI image artefacts
- official university marks without permission

## Required questions

Before approving a component:

1. What user problem does it solve?
2. Does it create trust or marketplace utility?
3. Does it add genuine Waterloo context?
4. Is this another unnecessary rectangle?
5. Does it need a border?
6. Would imagery communicate this better?
7. Does it work without animation?
8. Is the copy specific and human?

## Rectangle budget

Aim for:

```text
40% open layout
30% imagery
20% structured product surfaces
10% accents and overlays
```


---

<!-- 11_IMPLEMENTATION_AND_QA.md -->

# Implementation and QA

## Phase 1 — Palette and shell

- replace pure black with layered ink
- replace white with warm stone
- reduce bright yellow
- soften borders
- create dark product shell

## Phase 2 — Landing and auth

- add campus/product imagery
- remove preview-card dependence
- smooth section transitions
- redesign category grid
- revise final CTA
- implement GO BLACK / GO GOLD auth composition

## Phase 3 — Marketplace

- integrate dark hero
- remove attached side panel
- implement image mosaic categories
- enrich honest empty state
- create image-first listing feed

## Phase 4 — Create listing

- dark shell + warm form
- compact condition selector
- image-backed category selector
- improved preview
- dark publish confirmation

## Phase 5 — Content

- source licensed campus images
- prepare demo product image set
- create original map/grid graphics
- define one image grade

## Phase 6 — Motion

- shared route transition
- onboarding wipe
- listing expansion
- publish transformation
- reduced-motion support

## Final QA

### Identity

- [ ] Feels Waterloo-specific beyond colour
- [ ] Co-op and campus context are natural
- [ ] No false official affiliation
- [ ] Official marks used only with permission

### Visual depth

- [ ] Real imagery is present
- [ ] No page is only rectangles
- [ ] Gold is restrained
- [ ] Dark/light surfaces blend smoothly
- [ ] Category layout is asymmetric

### Marketplace

- [ ] Listing cards are image-first
- [ ] Empty state is honest
- [ ] Demo content is labelled
- [ ] Search is obvious
- [ ] Mobile feed works

### Create listing

- [ ] Form remains fast
- [ ] Condition selector is compact
- [ ] Upload is visually strong
- [ ] Preview matches final card
- [ ] Draft survives errors

### Accessibility and performance

- [ ] Keyboard tested
- [ ] Focus visible
- [ ] Contrast checked
- [ ] Reduced motion works
- [ ] Images optimized
- [ ] Production build passes

## Final test

> If the logo disappeared, would the product still feel like a premium Waterloo marketplace?