// src/main.ts
import './style.css';
import { getTrackingUrlForGeo, isGeoAllowed } from './config/offers';
import { isWindowsOS, getFallbackCountryCode, setPersistedCountryCode } from './utils/geo';
import { trackEvent, initScrollTracking } from './utils/tracking';
import { getDictionary, inferLocaleFromCountryCode } from './i18n/loader';

// Types
type Dict = ReturnType<typeof getDictionary>;

// Main Initialization logic
document.addEventListener("DOMContentLoaded", () => {
  // 1. Establish Country & Valid Geo
  const countryCode = getFallbackCountryCode();
  const allowed = isGeoAllowed(countryCode);

  // 2. Decide locale based on Country
  const locale = inferLocaleFromCountryCode(countryCode);
  const dict = getDictionary(locale);

  // 3. Resolve A/B variant Hook
  const params = new URLSearchParams(window.location.search);
  const variantIndex = params.get('v') || '1';
  // Ensure valid variant (1,2, or 3)
  const vNum = ['1', '2', '3'].includes(variantIndex) ? variantIndex : '1';

  // State Tracking
  trackEvent('page_view', { geo: countryCode, variant: vNum, allowed });
  initScrollTracking();

  // 4. Gate checks
  if (!isWindowsOS()) {
    document.getElementById('os-gate')?.classList.remove('hidden');
    trackEvent('os_block_shown');
  } else if (!allowed) {
    document.getElementById('geo-gate')?.classList.remove('hidden');
    trackEvent('geo_block_shown');
  }

  // 5. Build Offer Link
  const trackingLink = getTrackingUrlForGeo(countryCode);

  // 6. Hydrate UI
  hydrateContent(dict, vNum as '1' | '2' | '3');
  setupInteractions(trackingLink);

  // Preselect language dropdown
  const langSelect = document.getElementById("lang-selector") as HTMLSelectElement;
  if (langSelect && Array.from(langSelect.options).some(o => o.value === countryCode)) {
    langSelect.value = countryCode;
  }
});


function hydrateContent(dict: Dict, vCode: '1' | '2' | '3') {
  // Hero
  const variant = dict.hero.variants[vCode];
  setText('hero-headline', variant.headline);
  setText('hero-subhead', variant.subhead);
  setText('hero-cta', variant.cta);
  setText('hero-ctaMicro', variant.ctaMicro);
  setText('trustMicro', dict.hero.trustMicro);

  const bulletsContainer = document.getElementById('hero-bullets');
  if (bulletsContainer) {
    bulletsContainer.innerHTML = variant.bullets.map(b => `<li>${b}</li>`).join('');
  }

  // Step Bar
  setText('s1', dict.hero.stepBar.s1);
  setText('s2', dict.hero.stepBar.s2);
  setText('s3', dict.hero.stepBar.s3);
  setText('s4', dict.hero.stepBar.s4);

  // Features
  setText('feat-title', dict.features.title);
  const featureGrid = document.getElementById('feature-grid');
  if (featureGrid) {
    featureGrid.innerHTML = dict.features.cards.map(c => `
      <div class="feature-card">
        <svg class="icon-box" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <h3>${c.title}</h3>
        <p class="text-muted">${c.desc}</p>
      </div>
    `).join('');
  }

  // Narrative
  setText('nar-text', dict.narrative.text);
  setText('nar-bullets', dict.narrative.bullets);

  // Loop
  setText('loop-title', dict.loop.title);
  setText('loop-cta', dict.loop.cta);
  const loopTimeline = document.getElementById('loop-timeline');
  if (loopTimeline) {
    loopTimeline.innerHTML = dict.loop.steps.map((s, i) => `
      <div class="loop-item">
        <h4>${i + 1}. ${s.title}</h4>
        <p>${s.desc}</p>
      </div>
    `).join('');
  }

  // Req
  setText('req-title', dict.requirements.title);

  if (dict.requirements.min && dict.requirements.rec) {
    setText('req-min-label', dict.requirements.min.label);
    setText('req-min-os', dict.requirements.min.os);
    setText('req-min-cpu', dict.requirements.min.cpu);
    setText('req-min-ram', dict.requirements.min.ram);
    setText('req-min-gpu', dict.requirements.min.gpu);
    setText('req-min-storage', dict.requirements.min.storage);

    setText('req-rec-label', dict.requirements.rec.label);
    setText('req-rec-os', dict.requirements.rec.os);
    setText('req-rec-cpu', dict.requirements.rec.cpu);
    setText('req-rec-ram', dict.requirements.rec.ram);
    setText('req-rec-gpu', dict.requirements.rec.gpu);
    setText('req-rec-storage', dict.requirements.rec.storage);
  }



  // Footer & Overlays
  setText('footer-privacy', dict.footer.privacy);
  setText('footer-disclosure', dict.footer.disclosure);
  setText('geoBlock-title', dict.geoBlock.title);
  setText('geoBlock-desc', dict.geoBlock.desc);
  setText('geoBlock-btn', dict.geoBlock.btn);
}

function setText(id: string, text: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setupInteractions(trackingLink: string) {
  // Wire up all CTA buttons
  const ctas = document.querySelectorAll('.cta-btn');
  ctas.forEach(cta => {
    (cta as HTMLAnchorElement).href = trackingLink;
    cta.addEventListener('click', (e) => {
      const loc = (e.currentTarget as HTMLElement).getAttribute('data-location') || 'unknown';
      trackEvent('cta_click', { button_location: loc });
    });
  });



  // Sticky Header observer
  const heroSection = document.getElementById('hero');
  const stickyHeader = document.getElementById('sticky-header');
  if (heroSection && stickyHeader) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyHeader.classList.remove('hidden');
          // Add a tiny delay to allow display block to apply before transform transition
          setTimeout(() => stickyHeader.classList.add('visible'), 10);
        } else {
          stickyHeader.classList.remove('visible');
          setTimeout(() => stickyHeader.classList.add('hidden'), 300); // match css transition
        }
      });
    }, { threshold: 0.1 });
    observer.observe(heroSection);
  }

  // Language Selector
  const langSelect = document.getElementById('lang-selector');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const targetCountry = (e.target as HTMLSelectElement).value;
      setPersistedCountryCode(targetCountry);
      window.location.reload();
    });
  }


}
