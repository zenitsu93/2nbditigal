import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from 'src/lib/analyticsConsent';

const ConsentBanner: FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [consent, setConsent] = useState<AnalyticsConsent>(() => getAnalyticsConsent());

  const visible = consent === 'unknown' && !isAdminRoute;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <h2 className="text-lg font-semibold text-dark">Cookies et mesure d&apos;audience</h2>
        <p className="mt-3 text-sm leading-relaxed text-dark/75">
          Nous utilisons des cookies pour mesurer l&apos;audience et améliorer le site. Vous pouvez
          accepter ou refuser les cookies analytiques.{' '}
          <Link to="/privacy" className="text-primary font-medium underline hover:no-underline">
            Politique de confidentialité
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="order-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 sm:order-1"
            onClick={() => {
              setAnalyticsConsent('denied');
              setConsent('denied');
            }}
          >
            Refuser
          </button>
          <button
            type="button"
            className="order-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 sm:order-2"
            onClick={() => {
              setAnalyticsConsent('granted');
              setConsent('granted');
            }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
