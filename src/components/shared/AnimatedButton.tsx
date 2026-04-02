import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import StarBorder, { type StarBorderVariant } from './StarBorder';

interface AnimatedButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const variantMap: Record<NonNullable<AnimatedButtonProps['variant']>, StarBorderVariant> = {
  primary: 'primary',
  secondary: 'secondary',
  light: 'light',
  outline: 'outline',
};

const glowMap: Record<NonNullable<AnimatedButtonProps['variant']>, string> = {
  primary: '#d4af37',
  secondary: '#9ca3af',
  light: '#9ca3af',
  outline: '#d4af37',
};

const sizeInner: Record<NonNullable<AnimatedButtonProps['size']>, string> = {
  xs: 'min-h-8 px-2 py-1 text-xs',
  sm: 'min-h-9 px-3 py-1.5 text-xs sm:px-3 sm:text-sm',
  md: 'min-h-[42px] px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
  lg: 'min-h-12 px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg',
  xl: 'min-h-14 px-5 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl',
};

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }, ref) => {
    const vb = variantMap[variant];
    const glow = glowMap[variant];

    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="inline-block max-w-full"
      >
        <StarBorder
          ref={ref}
          as="button"
          type={type}
          variant={vb}
          color={glow}
          speed="5s"
          thickness={1}
          className={className}
          innerClassName={sizeInner[size]}
          {...props}
        >
          <span className="flex items-center justify-center gap-2">{children}</span>
        </StarBorder>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
