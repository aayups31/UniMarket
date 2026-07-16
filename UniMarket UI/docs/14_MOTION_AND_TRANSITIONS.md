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
