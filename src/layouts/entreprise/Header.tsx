import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Icon } from '@iconify/react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../../components/ui/resizable-navbar';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Réalisations', href: '/realisations' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/contact">
            <NavbarButton variant="primary" className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
              <Icon icon="solar:phone-calling-line-duotone" className="mr-1 md:mr-2" height={16} width={16} />
              <span className="hidden sm:inline">Nous contacter</span>
              <span className="sm:hidden">Contact</span>
            </NavbarButton>
          </Link>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={`mobile-link-${idx}`}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative text-sm sm:text-base font-medium transition-colors py-2 ${
                  isActive ? 'text-primary' : 'text-dark/70 hover:text-primary'
                }`}
              >
                <span className="block">{item.name}</span>
              </Link>
            );
          })}
          <div className="flex w-full flex-col gap-4 pt-2">
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <NavbarButton variant="primary" className="w-full text-sm px-4 py-2.5">
                <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} width={18} />
                Nous contacter
              </NavbarButton>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default Header;

