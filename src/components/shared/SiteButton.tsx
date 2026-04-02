import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import StarBorder, { type StarBorderVariant } from './StarBorder';

/** Couleurs Flowbite utilisées dans le projet */
export type SiteButtonColor =
  | 'primary'
  | 'light'
  | 'gray'
  | 'failure'
  | 'warning'
  | 'success';

const colorToVariant = (color: SiteButtonColor): StarBorderVariant => {
  switch (color) {
    case 'light':
      return 'light';
    case 'gray':
      return 'muted';
    case 'failure':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'success':
      return 'primary';
    case 'primary':
    default:
      return 'primary';
  }
};

const colorToGlow = (color: SiteButtonColor): string => {
  switch (color) {
    case 'failure':
      return '#f87171';
    case 'warning':
      return '#fb923c';
    case 'light':
    case 'gray':
      return '#9ca3af';
    case 'success':
      return '#34d399';
    case 'primary':
    default:
      return '#d4af37';
  }
};

const sizeInner: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'min-h-8 px-2.5 py-1 text-xs',
  sm: 'min-h-9 px-3 py-1.5 text-sm',
  md: 'min-h-[42px] px-5 py-2 text-sm',
  lg: 'min-h-12 px-5 py-2.5 text-base',
  xl: 'min-h-14 px-6 py-3 text-base',
};

export interface SiteButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color?: SiteButtonColor;
  size?: keyof typeof sizeInner;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, SiteButtonProps>(
  ({ color = 'primary', size = 'md', className = '', children, disabled, type = 'button', ...rest }, ref) => {
    const variant = colorToVariant(color);
    const glow = colorToGlow(color);

    return (
      <StarBorder
        ref={ref}
        as="button"
        type={type}
        variant={variant}
        color={glow}
        speed="5s"
        thickness={1}
        disabled={disabled}
        className={className}
        innerClassName={sizeInner[size]}
        {...rest}
      >
        {children}
      </StarBorder>
    );
  }
);

Button.displayName = 'SiteButton';
