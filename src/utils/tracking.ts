// src/utils/tracking.ts

// Basic tracking interface avoiding vendor lock-in
declare global {
    interface Window {
        dataLayer?: any[];
    }
}

export function trackEvent(eventName: string, payload?: Record<string, any>) {
    const event = {
        event: eventName,
        ...payload,
        timestamp: new Date().toISOString(),
    };

    // Push to dataLayer if available
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push(event);
    } else {
        // Console fallback
        console.log(`[Analytics Track] ${eventName}`, payload || "");
    }
}

// Scroll tracking
export function initScrollTracking() {
    const milestones = [25, 50, 75, 90];
    const reached = new Set<number>();

    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        milestones.forEach(m => {
            if (scrollPercent >= m && !reached.has(m)) {
                reached.add(m);
                trackEvent(`scroll_${m}`);
            }
        });
    }, { passive: true });
}
