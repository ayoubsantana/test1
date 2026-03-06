import enUS from './en-US.json';
import frFR from './fr-FR.json';

type Translations = typeof enUS;

export const dictionaries: Record<string, any> = {
    "en-US": enUS,
    "fr-FR": frFR,
    // Fallbacks for regions we don't have json for yet
    "en-GB": enUS,
    "en-CA": enUS,
    "de-DE": enUS, // Replace with de-DE.json when translated
    "nl-NL": enUS,
    "nb-NO": enUS,
};

export function getDictionary(locale: string = "en-US"): Translations {
    return dictionaries[locale] || dictionaries["en-US"];
}

export function inferLocaleFromCountryCode(countryCode: string): string {
    switch (countryCode.toUpperCase()) {
        case 'FR': return 'fr-FR';
        case 'DE':
        case 'AT':
        case 'CH': return 'de-DE';
        case 'NL': return 'nl-NL';
        case 'NO': return 'nb-NO';
        case 'GB':
        case 'AU':
        case 'NZ': return 'en-GB';
        case 'CA': return 'en-CA';
        case 'US':
        default:
            return 'en-US';
    }
}
