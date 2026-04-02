import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { GA_MEASUREMENT_ID, initGtag, sendPageView } from 'src/lib/gtag';
import { CONSENT_EVENT, isAnalyticsAllowed } from 'src/lib/analyticsConsent';

/**
 * GA4 : charge gtag une fois et envoie un page_view à chaque navigation (SPA).
 * Désactivé si VITE_GA_MEASUREMENT_ID est absent.
 */
const GoogleAnalytics: FC = () => {
  const location = useLocation();
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(() => isAnalyticsAllowed());

  useEffect(() => {
    const handler = () => setAnalyticsAllowed(isAnalyticsAllowed());
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    if (!analyticsAllowed) return;

    initGtag(GA_MEASUREMENT_ID);

    const path = `${location.pathname}${location.search}${location.hash}`;
    sendPageView(path);
  }, [analyticsAllowed, location.pathname, location.search, location.hash]);

  return null;
};

export default GoogleAnalytics;
