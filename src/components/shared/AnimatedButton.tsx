import { motion } from 'framer-motion';
import { Button as FlowbiteButton, type ButtonProps as FlowbiteButtonProps } from 'flowbite-react';
import { ReactNode, forwardRef } from 'react';

interface AnimatedButtonProps extends Omit<FlowbiteButtonProps, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300';
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm',
    md: 'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    lg: 'px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg',
    xl: 'px-5 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="inline-block"
    >
      <FlowbiteButton
        ref={ref}
        color={variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : variant === 'outline' ? 'outline' : 'light'}
        size={size}
        className={`${baseClasses} ${sizeClasses[size]} ${className} shadow-lg hover:shadow-xl transition-shadow duration-300`}
        {...props}
      >
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          initial={{ opacity: 1 }}
          whileHover={{ opacity: 1, x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        <motion.div
          className="absolute inset-0 bg-white/30"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </FlowbiteButton>
    </motion.div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;

