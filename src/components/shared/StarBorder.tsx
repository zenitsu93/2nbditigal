import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './StarBorder.css';

export type StarBorderVariant =
  | 'primary'
  | 'secondary'
  | 'light'
  | 'outline'
  | 'muted'
  | 'danger'
  | 'warning';

export type StarBorderProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  as?: ElementType;
  variant?: StarBorderVariant;
  /** Couleur du halo animé */
  color?: string;
  speed?: string;
  thickness?: number;
  innerClassName?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
};

const StarBorder = forwardRef<HTMLElement, StarBorderProps>(
  (
    {
      as,
      variant = 'primary',
      color,
      speed = '5s',
      thickness = 1,
      className = '',
      innerClassName = '',
      children,
      style,
      disabled,
      ...rest
    },
    ref
  ) => {
    const Component = (as ?? 'button') as ElementType;
    const glowColor = color ?? '#d4af37';

    const mergedClassName = [
      'star-border-container',
      `star-border-${variant}`,
      disabled ? 'star-border-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const mergedStyle: CSSProperties = {
      padding: `${thickness}px 0`,
      ...style,
    };

    const gradientStyle: CSSProperties = {
      background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor} 22%, color-mix(in srgb, ${glowColor} 45%, transparent) 48%, transparent 62%)`,
      animationDuration: speed,
    };

    return (
      <Component
        ref={ref as never}
        className={mergedClassName}
        style={mergedStyle}
        disabled={Component === 'button' ? disabled : undefined}
        aria-disabled={disabled ? true : undefined}
        {...rest}
      >
        <div className="border-gradient-bottom" style={gradientStyle} />
        <div className="border-gradient-top" style={gradientStyle} />
        <div className={`star-border-inner ${innerClassName}`.trim()}>{children}</div>
      </Component>
    );
  }
);

StarBorder.displayName = 'StarBorder';

export default StarBorder;
