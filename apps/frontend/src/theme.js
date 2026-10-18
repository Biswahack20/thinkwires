/**
 * ThinkWires Design System — Central Theme Configuration
 *
 * This file exports all design tokens as a JavaScript object,
 * making them available for use in JS-driven styling logic,
 * inline styles, and theme-aware components.
 *
 * ─── How the Design System Works ──────────────────────────────────────────────
 *
 * ThinkWires uses a THREE-LAYER styling architecture:
 *
 *   1. CSS Custom Properties (`index.css`)
 *      The source of truth. All design tokens are defined as CSS variables
 *      on `:root` (light mode) and `[data-theme="dark"]` (dark mode).
 *      Example: `--color-primary: #0037B0;`
 *
 *   2. This File (`theme.js`)
 *      Mirrors all CSS tokens as a plain JavaScript object.
 *      Use this for programmatic access (e.g., canvas rendering, dynamic
 *      inline styles, generating a Storybook theme, or unit test assertions).
 *      Do NOT use these values as a replacement for CSS variables in JSX —
 *      prefer `className="..."` with utility classes from `index.css`.
 *
 *   3. Component Classes (`index.css` + `App.css`)
 *      Pre-composed semantic class names (`.btn`, `.card`, `.chip`) built
 *      from the CSS variables. Use these in JSX for 99% of styling needs.
 *
 * ─── Usage Examples ────────────────────────────────────────────────────────────
 *
 * [Correct] — use CSS class names in JSX:
 *   <button className="btn btn-primary">Click Me</button>
 *   <div className="card">...</div>
 *
 * [Correct] — use theme.js for programmatic logic:
 *   import theme from './theme.js';
 *   const chartColor = theme.colors.primary; // "#0037B0"
 *   ctx.fillStyle = chartColor;
 *
 * [Avoid] — hardcoding raw color hex values in JSX:
 *   <div style={{ color: '#0037B0' }}>...</div>
 *   // Instead: <div style={{ color: 'var(--color-primary)' }}>...</div>
 *
 * ─── Dark Mode ─────────────────────────────────────────────────────────────────
 * Dark mode is applied automatically by the ThemeProvider via the
 * `data-theme="dark"` attribute on <html>. CSS variables automatically
 * resolve to dark-mode overrides — no JavaScript re-theming required.
 *
 * @see ThemeProvider.jsx — manages theme state and persistence
 * @see useTheme.js       — React hook to read/toggle the active theme
 * @see index.css         — CSS variable definitions (source of truth)
 */

const theme = {
  /**
   * Color Tokens
   *
   * Organized into semantic groups following Material Design 3 conventions.
   * These mirror the CSS custom properties defined in `index.css`.
   */
  colors: {
    // ─── Primary — Core brand identity ─────────────────────────────────────
    /** Main brand blue — used for primary CTAs, links, active states */
    primary: '#0037B0',
    /** Elevated primary container — hover states, active selection rings */
    'primary-container': '#1D4ED8',
    /** Text/icon color on primary surfaces */
    'on-primary': '#FFFFFF',
    /** Text on primary containers */
    'on-primary-container': '#CAD3FF',
    /** Primary color optimized for dark contexts */
    'inverse-primary': '#B7C4FF',
    'primary-fixed': '#DCE1FF',
    'primary-fixed-dim': '#B7C4FF',
    'on-primary-fixed': '#001551',
    'on-primary-fixed-variant': '#0039B5',

    // ─── Cobalt accents — hover states & interactive highlights ────────────
    /** Bright cobalt for hover states and active UI elements */
    'cobalt-bright': '#2563EB',
    /** Softer cobalt for focus rings and glows */
    'cobalt-glow': '#3B82F6',

    // ─── Secondary — Support actions ───────────────────────────────────────
    secondary: '#49607E',
    'secondary-container': '#C4DCFF',
    'on-secondary': '#FFFFFF',
    'on-secondary-container': '#49617F',
    'secondary-fixed': '#D2E4FF',
    'secondary-fixed-dim': '#B0C8EB',
    'on-secondary-fixed': '#001C37',
    'on-secondary-fixed-variant': '#314865',

    // ─── Tertiary / Emerald — Success, availability, live status ───────────
    tertiary: '#004F35',
    'tertiary-container': '#006A48',
    'on-tertiary': '#FFFFFF',
    'on-tertiary-container': '#60EEB1',
    'tertiary-fixed': '#6FFBBE',
    'tertiary-fixed-dim': '#4EDEA3',
    'on-tertiary-fixed': '#002113',
    'on-tertiary-fixed-variant': '#005236',
    /** Bright emerald for live status dots, success metrics, "Available" chips */
    'emerald-accent': '#22C55E',

    // ─── Error — Validation, destructive actions ────────────────────────────
    error: '#BA1A1A',
    'error-container': '#FFDAD6',
    'on-error': '#FFFFFF',
    'on-error-container': '#93000A',

    // ─── Surfaces — Page and card backgrounds ──────────────────────────────
    /** Default page background */
    surface: '#FAF8FF',
    'surface-dim': '#D9D9E5',
    'surface-bright': '#FAF8FF',
    'surface-container-lowest': '#FFFFFF',
    'surface-container-low': '#F3F2FE',
    /** Standard card/container background */
    'surface-container': '#EDEDF9',
    /** Elevated card backgrounds */
    'surface-container-high': '#E8E7F3',
    'surface-container-highest': '#E2E1ED',
    /** Primary text on surfaces */
    'on-surface': '#1A1B23',
    /** Secondary/muted text on surfaces */
    'on-surface-variant': '#434655',
    'inverse-surface': '#2E3039',
    'inverse-on-surface': '#F0F0FB',
    'surface-tint': '#2151DA',
    'surface-variant': '#E2E1ED',

    // ─── Outline — Borders and dividers ────────────────────────────────────
    /** Standard border and divider color */
    outline: '#747686',
    /** Subtle/ghost borders for low-emphasis separators */
    'outline-variant': '#C4C5D7',

    // ─── Extended palette — Structural and layout colors ───────────────────
    /** Deep structural dark base for hero sections, footers */
    'navy-dark': '#0F172A',
    /** Neutral cool surface tint */
    'slate-surface': '#F8FAFC',
    /** Card stroke / border color */
    'card-stroke': '#E2E8F0',
    background: '#FAF8FF',
    'on-background': '#1A1B23',
  },

  /**
   * Typography Tokens
   *
   * Font: Plus Jakarta Sans (loaded via Google Fonts in index.html).
   * All tokens correspond to CSS utility classes in index.css,
   * e.g. `theme.typography['headline-lg']` matches `.text-headline-lg`.
   */
  typography: {
    /** Global font stack — always use this, never hardcode font names */
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",

    // ─── Display — Hero headings (landing page, marketing) ─────────────────
    'display-hero': {
      fontSize: '56px',
      fontWeight: 800,
      lineHeight: '64px',
      letterSpacing: '-0.02em',
    },
    'display-hero-mobile': {
      fontSize: '36px',
      fontWeight: 800,
      lineHeight: '44px',
      letterSpacing: '-0.01em',
    },

    // ─── Headlines — Section headings ──────────────────────────────────────
    'headline-xl': {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: '48px',
      letterSpacing: '-0.02em',
    },
    'headline-xl-mobile': {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: '36px',
      letterSpacing: '-0.01em',
    },
    'headline-lg': {
      fontSize: '30px',
      fontWeight: 700,
      lineHeight: '38px',
      letterSpacing: '-0.015em',
    },
    'headline-md': {
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: '30px',
    },
    'headline-sm': {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '26px',
    },

    // ─── Body — Paragraph and content text ─────────────────────────────────
    'body-xl': { fontSize: '18px', fontWeight: 400, lineHeight: '28px' },
    'body-md': { fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
    'body-sm': { fontSize: '14px', fontWeight: 400, lineHeight: '20px' },

    // ─── Labels — Metadata, categories, badges ─────────────────────────────
    'label-md': {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '18px',
      letterSpacing: '0.01em',
    },
    'label-sm': {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '0.02em',
    },

    // ─── Stat counters — Metric cards ──────────────────────────────────────
    'stat-counter': {
      fontSize: '44px',
      fontWeight: 800,
      lineHeight: '52px',
      letterSpacing: '-0.02em',
    },
  },

  /**
   * Spacing Tokens
   *
   * Used for margins, paddings, and gap values.
   * Prefer CSS variables (`var(--space-md)`) in stylesheets over importing
   * these directly.
   */
  spacing: {
    xs: '0.25rem', // 4px  — Icon gaps, micro-spacing
    sm: '0.5rem', //  8px  — Tight component inner padding
    md: '1rem', //   16px — Standard element padding
    lg: '1.5rem', // 24px — Section sub-spacing, card padding
    xl: '2.5rem', // 40px — Section vertical padding
    '2xl': '4rem', // 64px — Major section separators
    gutter: '1.5rem', //        Mobile horizontal page margin
    'gutter-desktop': '2rem', // Desktop horizontal page margin
    margin: '1.5rem', //        Mobile content margin
    'margin-desktop': '5rem', // Desktop content margin
  },

  /**
   * Border Radius Tokens
   *
   * Consistent rounding applied to buttons, cards, chips, and inputs.
   */
  rounded: {
    sm: '0.25rem', //  4px  — Subtle, input fields
    DEFAULT: '0.5rem', // 8px  — Standard buttons and cards
    md: '0.75rem', // 12px — Elevated cards
    lg: '1rem', //   16px — Modal dialogs, large cards
    xl: '1.5rem', // 24px — Feature panels
    full: '9999px', // Pill-shaped buttons and chips
  },

  /**
   * Elevation (Box Shadow) Tokens
   *
   * Four levels from flat (0) to heavy drop shadow (3).
   * Applied via CSS: `box-shadow: var(--elevation-2)`.
   */
  elevation: {
    0: 'none',
    1: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
    2: '0 12px 24px -6px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(37, 99, 235, 0.06)',
    3: '0 25px 50px -12px rgba(10, 37, 64, 0.25)',
  },

  /**
   * Responsive Breakpoints
   *
   * These mirror the CSS media query thresholds used in index.css.
   * Use in JavaScript-driven responsive logic (e.g., conditional rendering).
   *
   * @example
   * const isMobile = window.innerWidth < parseInt(theme.breakpoints.mobile);
   */
  breakpoints: {
    mobile: '768px', //  < 768px  — Single column, stacked layout
    tablet: '1280px', // 768–1280px — Two-column layout
    desktop: '1280px', // >= 1280px — Full multi-column layout
  },

  /**
   * Layout Tokens
   *
   * Maximum content width and grid column configuration.
   */
  layout: {
    /** Maximum content container width (centered on wide screens) */
    maxWidth: '1240px',
    /** Responsive column counts per breakpoint */
    columns: { mobile: 4, tablet: 8, desktop: 12 },
  },
};

export default theme;
