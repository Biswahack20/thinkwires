# Styling & Responsive Design System

## 1. Design System Foundations
ThinkWires uses standard Vanilla CSS located in `apps/frontend/src/index.css`. All components use semantic CSS custom properties defined in `:root`.

### Color Palette Tokens
- `--color-primary-container`: Deep ThinkWires Blue `#003399`
- `--color-cobalt-bright`: Bright accent blue `#2563EB`
- `--color-emerald-accent`: Accent green `#059669`
- `--color-navy-dark`: Primary text and dark headers `#0F172A`
- `--color-slate-surface`: Form and card background `#F8FAFC`
- `--color-card-stroke`: Border stroke `#E2E8F0`

### Typography
- Primary Sans-Serif font family: `Inter`, system UI fallback.
- Icons: Google Material Symbols Outlined (`material-symbols-outlined`).

## 2. Responsive Breakpoints
The responsive layout system defines four primary tiers:

```css
/* Mobile Phones */
@media (max-width: 640px) {
  /* Forms stack vertically, full-width buttons, reduced card paddings */
}

/* Tablets & Small Laptops */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2-column grids, collapsed navigation */
}

/* Desktop Displays */
@media (min-width: 1025px) {
  /* Multi-column grids, fixed navigation headers, wide layouts */
}
```

## 3. Global Job Application Form Responsiveness
The `GlobalJobApplicationForm` (`.ApplyModal-*`) adheres to strict responsive guidelines:
- **Mobile (< 640px)**:
  - Form layout switches from 2-column to 1-column (`.ApplyModal-row` stacks vertically).
  - Maximum height adjusts to `94dvh` with internal scrolling to prevent mobile viewport clipping.
  - Buttons (`Cancel` and `Submit`) expand to 100% width for touch accessibility.
- **Desktop (>= 641px)**:
  - Fixed centered modal overlay with `backdrop-filter: blur(4px)`.
  - Max width constrained to `640px` with 2-column inputs for Email/Phone and Experience/Location.
