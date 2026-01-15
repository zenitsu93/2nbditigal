import { Link } from 'react-router';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {/* Logo Desktop - taille normale */}
      <img 
        src="/images/social-preview.png" 
        alt="2NB Digital Logo" 
        className="hidden md:block h-16 md:h-20 w-auto"
      />
      {/* Logo Mobile - taille réduite */}
      <img 
        src="/images/social-preview.png" 
        alt="2NB Digital Logo" 
        className="block md:hidden h-8 sm:h-10 w-auto"
      />
    </Link>
  );
};

export default Logo;

