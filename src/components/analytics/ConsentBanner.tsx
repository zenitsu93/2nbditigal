import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  CONSENT_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from 'src/lib/analyticsConsent';
import StarBorder from 'src/components/shared/StarBorder';

const ConsentBanner: FC = () => {
  const location = useLocation();
  const [consent, setConsent] = useState<AnalyticsConsent>(() => getAnalyticsConsent());

  useEffect(() => {
    const handler = () => setConsent(getAnalyticsConsent());
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const visible = consent === 'unknown' && !isAdminRoute;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-auto">
              <img
                src="/images/social-preview.png"
                alt="2NB Digital"
                className="h-full w-auto"
                loading="lazy"
              />
            </div>

            <button
              type="button"
              className="text-xs font-medium text-dark/60 underline underline-offset-4 hover:text-dark"
              onClick={() => setAnalyticsConsent('denied')}
            >
              Continuer sans accepter
            </button>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-dark/75">
            <p className="font-semibold text-dark">
              Nous utilisons des cookies analytiques pour mesurer l’audience de notre site et améliorer
              nos services.
            </p>
            <p>
              Aucune donnée sensible n’est collectée. Vous pouvez à tout moment revenir sur votre choix
              dans notre{' '}
              <a
                href="/privacy"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <StarBorder
              type="button"
              variant="muted"
              color="#9ca3af"
              className="w-full sm:w-auto"
              innerClassName="min-h-10 px-4 py-2.5 text-sm font-medium"
              onClick={() => setAnalyticsConsent('denied')}
            >
              Paramétrer plus tard
            </StarBorder>
            <StarBorder
              type="button"
              variant="primary"
              color="#d4af37"
              className="w-full sm:w-auto"
              innerClassName="min-h-10 px-6 py-2.5 text-sm font-semibold"
              onClick={() => setAnalyticsConsent('granted')}
            >
              Tout accepter
            </StarBorder>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;

