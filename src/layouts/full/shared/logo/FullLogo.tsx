import { Link } from 'react-router';

const FullLogo = () => {
  return (
    <Link to="/admin" className="flex flex-col items-center gap-1">
      <img
        src="/images/social-preview.png"
        alt="2NB Digital Logo"
        className="h-8 sm:h-10 w-auto"
      />
      <span className="text-xs text-gray-500 font-medium">Admin Panel</span>
    </Link>
  );
};

export default FullLogo;

