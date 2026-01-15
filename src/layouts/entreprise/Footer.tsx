import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import Logo from '../../components/entreprise/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    entreprise: [
      { name: 'Accueil', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Réalisations', href: '/realisations' },
      { name: 'Actualités', href: '/actualites' },
      { name: 'Contact', href: '/contact' },
    ],
    services: [
      { name: 'Développement Web', href: '/services#developpement' },
      { name: 'Transformation Digitale', href: '/services#transformation' },
      { name: 'Data & IA', href: '/services#data' },
      { name: 'Marketing Digital', href: '/services#marketing' },
      { name: 'Formation', href: '/services#formation' },
    ],
    ressources: [
      { name: 'Blog', href: '/actualites' },
      { name: 'FAQ', href: '/#faq' },
      { name: 'Support', href: '/contact' },
    ],
    legal: [
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'CGV', href: '/terms' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/2nbdigital',
      icon: 'logos:facebook',
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/22677534419',
      icon: 'logos:whatsapp-icon',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/2nbdigital',
      icon: 'logos:linkedin-icon',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/2nbdigital',
      icon: 'logos:instagram-icon',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@2nbdigital',
      icon: 'logos:youtube-icon',
    },
  ];

  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Votre partenaire de confiance pour la transformation digitale au Burkina Faso et en Afrique.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-secondary text-gray-400 hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <Icon icon={social.icon} className="text-xl" width={20} height={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Sitemap - Entreprise */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap - Services */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap - Ressources & Légal */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Ressources</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.ressources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mb-4 text-white">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} 2NB Digital. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Icon icon="solar:map-point-line-duotone" className="text-lg" />
              <span>Ouagadougou, Burkina Faso</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

