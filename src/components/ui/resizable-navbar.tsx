"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router";
import { Icon } from "@iconify/react";
import Logo from "../entreprise/Logo";
import AnimatedButton from "../shared/AnimatedButton";

// Utility function
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

// Navbar Container
export const Navbar = ({ children, className }: { children: ReactNode; className?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-white/95 backdrop-blur-sm",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-3 sm:px-4">
        {children}
      </div>
    </motion.nav>
  );
};

// Navbar Body (Desktop)
export const NavBody = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn("hidden md:flex items-center justify-between py-3 md:py-4", className)}>
      {children}
    </div>
  );
};

// Navbar Logo
export const NavbarLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <Logo />
    </div>
  );
};

// Navbar Items
interface NavItem {
  name: string;
  href: string;
}

export const NavItems = ({ items, className }: { items: NavItem[]; className?: string }) => {
  const location = useLocation();

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {items.map((item, idx) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={idx}
            to={item.href}
            className={cn(
              "relative text-sm font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-dark/70 hover:text-primary"
            )}
          >
            {item.name}
            {isActive && (
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                layoutId="navbar-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

// Navbar Button
interface NavbarButtonProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  to?: string;
}

export const NavbarButton = ({
  variant = "primary",
  children,
  onClick,
  className,
  to,
}: NavbarButtonProps) => {
  const button = (
    <AnimatedButton
      variant={variant === "primary" ? "primary" : "secondary"}
      size="sm"
      onClick={onClick}
      className={className}
    >
      {children}
    </AnimatedButton>
  );

  if (to) {
    return <Link to={to}>{button}</Link>;
  }

  return button;
};

// Mobile Nav Container
export const MobileNav = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn("md:hidden", className)}>
      {children}
    </div>
  );
};

// Mobile Nav Header
export const MobileNavHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn("flex items-center justify-between py-3", className)}>
      {children}
    </div>
  );
};

// Mobile Nav Toggle
interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileNavToggle = ({ isOpen, onClick }: MobileNavToggleProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle menu"
    >
      <Icon
        icon={isOpen ? "solar:close-circle-line-duotone" : "solar:hamburger-menu-line-duotone"}
        className="text-2xl text-dark"
      />
    </button>
  );
};

// Mobile Nav Menu
interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const MobileNavMenu = ({ isOpen, onClose: _onClose, children }: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-t border-gray-200"
        >
          <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
