// src/config/offers.ts

export type GeoBucket = "US" | "CA" | "INTL" | "UNSUPPORTED";

// Track URLs provided by user (placeholders)
export const TRACKING_URLS = {
  US: "https://to.wendiro.com/<US_PATH_OR_PARAMS>",     // Payout $10, Offer 9995
  CA: "https://to.wendiro.com/<CA_PATH_OR_PARAMS>",     // Payout $7, Offer 10172
  INTL: "https://to.wendiro.com/<INTL_PATH_OR_PARAMS>", // Payout $7, Offer 10173
  UNSUPPORTED: "https://store.steampowered.com/search/?term=once+human"
};

// Allowed GEOs mapping
export const ALLOWED_GEOS: Record<string, GeoBucket> = {
  "US": "US",
  "CA": "CA",
  "DE": "INTL",
  "FR": "INTL",
  "GB": "INTL", // UK
  "AU": "INTL",
  "NL": "INTL",
  "AT": "INTL",
  "NO": "INTL",
  "CH": "INTL",
  "NZ": "INTL",
};

export function getTrackingUrlForGeo(countryCode: string): string {
  const bucket = ALLOWED_GEOS[countryCode.toUpperCase()] || "UNSUPPORTED";
  return TRACKING_URLS[bucket];
}

export function isGeoAllowed(countryCode: string): boolean {
  return !!ALLOWED_GEOS[countryCode.toUpperCase()];
}
