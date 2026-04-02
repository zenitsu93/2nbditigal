const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

export const GA_MEASUREMENT_ID = id || undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initGtag(measurementId: string): void {
  if (initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function sendPageView(path: string): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
}
