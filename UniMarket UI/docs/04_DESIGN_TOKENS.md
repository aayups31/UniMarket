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
