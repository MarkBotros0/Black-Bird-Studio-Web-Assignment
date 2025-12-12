'use client';

import { cn, styles } from '../../styles';
import Spinner from './Spinner';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'success' | 'secondary';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'large';

/**
 * Props for Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Button content */
  children: React.ReactNode;
}

/**
 * Reusable button component with consistent styling
 *
 * @param props - Button props
 * @returns Rendered button component
 */
export default function Button({
  variant = 'primary',
  size = 'small',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = size === 'large' ? styles.button.large : styles.button.base;
  const variantClasses =
    disabled || loading
      ? styles.button.disabled
      : styles.button[variant];

  const spinnerVariant = variant === 'primary' || variant === 'success' ? 'white' : 'gray';
  const spinnerSize = size === 'large' ? 'medium' : 'small';

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size={spinnerSize} variant={spinnerVariant} />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

