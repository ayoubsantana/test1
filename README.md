# Once Human Landing Page (CRO Optimized)

A high-converting, performance-focused landing page for the game "Once Human," built with Vite, Vanilla TypeScript, and minimal CSS.

## Features Built-in
- **A/B Testing**: Easily test Hero section hooks using the `?v=1`, `?v=2`, or `?v=3` query parameter.
- **Dynamic Tracking URLs**: Routes users to different tracking links based on their GEO bucket (US, CA, INTL) to maximize payouts. 
- **Lightweight i18n**: Pre-configured JSON dictionaries for translations.
- **OS & Geo Gating**: Blocks non-Windows users with an overlay advising them to wishlist on mobile and prevents unsupported GEOs from clicking tracking links.
- **High Performance**: No heavy frameworks, vanilla TS, lazy-loaded video modal, and optimized DOM hydration limit blocking time.
- **Event Tracking Framework**: Pre-configured hooks pushes custom conversion events and scroll depth events to `window.dataLayer` for easy Analytics integration.

## Installation & Running Locally

1. Install Dependencies:
   ```bash
   npm install
   ```

2. Start the Dev Server:
   ```bash
   npm run dev
   ```

3. Build for Production:
   ```bash
   npm run build
   ```
   *The built files will be located in the `dist` folder, ready for static hosting.*

## Configuration Guide

### Tracking URLs
Open `src/config/offers.ts`. Replace the placeholder strings inside the `TRACKING_URLS` object with the actual affiliate links provided by your network.

### A/B Testing
To serve different variants, append the parameter to the URL:
- `https://your-domain.com/?v=1` (Survival + Base-building Hook)
- `https://your-domain.com/?v=2` (Co-op. + Threat Hook)
- `https://your-domain.com/?v=3` (Exploration + Progression Hook)

### Assets
Place your optimized background Image (`oncehuman-bg.jpg`) and Trailer thumbnail (`oncehuman-thumb.jpg`) into the `public/` directory or link them externally. Currently, they use remote placeholders.

## CRO Notes
- **Above the Fold**: The goal of the hero section is to get the user to understand the *value* in under 3 seconds. Test the 3 variants to find message-market fit.
- **Friction Reduction**: We maintain a continuous "Step Bar" so the user understands that playing is a fast process (Download -> Install -> Launch -> Play). 
- **Sticky CTA**: On desktop, the CTA header appears after scrolling down 10%. On mobile, the CTA stays pinned. This ensures the primary conversion point is always 1 click away.
- **Trust Elements**: Repeated mentions of "Via Steam" and "Windows PC" resolve common objections instantly, filtering out unqualified traffic without annoying the user.
- **FAQ Accordion**: Built specifically to preemptively answer objections that cause bounces (e.g., "Is it PvP or PvE?", "Can I play solo?").
