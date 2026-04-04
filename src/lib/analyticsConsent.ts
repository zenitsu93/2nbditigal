export type AnalyticsConsent = 'granted' | 'denied' | 'unknown';

const KEY = 'analytics_consent_v1';
export const CONSENT_EVENT = 'analytics-consent-change';

function safeLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unknown';

  const ls = safeLocalStorage();
  if (!ls) return 'unknown';

  const value = ls.getItem(KEY);
  if (value === 'granted' || value === 'denied') return value;
  return 'unknown';
}

export function isAnalyticsAllowed(): boolean {
  return getAnalyticsConsent() === 'granted';
}

export function setAnalyticsConsent(consent: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;

  const ls = safeLocalStorage();
  if (!ls) return;

  ls.setItem(KEY, consent);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { consent } }));
}
