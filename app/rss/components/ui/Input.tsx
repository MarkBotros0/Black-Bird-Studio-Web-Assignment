'use client';

import { cn, styles } from '../../styles';

/**
 * Props for Input component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input variant */
  variant?: 'default' | 'field';
}

/**
 * Reusable input component with consistent styling
 *
 * @param props - Input props
 * @returns Rendered input component
 */
export default function Input({
  variant = 'default',
  className,
  ...props
}: InputProps) {
  const inputClasses =
    variant === 'field' ? styles.input.field : styles.input.base;

  return <input className={cn(inputClasses, className)} {...props} />;
}

