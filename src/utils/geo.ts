// src/utils/geo.ts

/**
 * Very basic, best-effort OS detection.
 */
export function isWindowsOS(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf("win") !== -1;
}

/**
 * We map languages to country codes roughly, since we only have browser locale, not actual IP geo.
 * The prompt specifies US traffic by default, and CH follows browser lang.
 */
export function getFallbackCountryCode(): string {
    // Try persisted first
    const persisted = localStorage.getItem("preferred_country");
    if (persisted) return persisted;

    // Inference from browser language
    const lang = navigator.language || "";

    if (lang.startsWith("en-GB") || lang.startsWith("en-AU") || lang.startsWith("en-NZ")) return "GB"; // Simplification for INTL bucket
    if (lang.startsWith("en-CA") || lang.startsWith("fr-CA")) return "CA";
    if (lang.startsWith("fr")) return "FR";
    if (lang.startsWith("de") || lang.startsWith("de-AT") || lang.startsWith("de-CH")) return "DE";
    if (lang.startsWith("nl")) return "NL";
    if (lang.startsWith("nb") || lang.startsWith("no")) return "NO";

    // Default to US test traffic
    return "US";
}

export function setPersistedCountryCode(countryCode: string) {
    localStorage.setItem("preferred_country", countryCode.toUpperCase());
}
