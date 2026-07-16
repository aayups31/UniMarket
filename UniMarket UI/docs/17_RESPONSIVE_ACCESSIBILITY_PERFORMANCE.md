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
