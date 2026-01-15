import { FC, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';

const ScrollToTop: FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si on est sur la page d'accueil et qu'il y a un hash (ex: #faq)
    if (pathname === '/' && hash) {
      // Attendre que le DOM soit prêt
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 100; // Hauteur du header approximative
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Sinon, scroll en haut de la page
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const EntrepriseLayout: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default EntrepriseLayout;

