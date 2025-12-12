'use client';

import { cn, styles } from '../../styles';

/**
 * Props for Card component
 */
interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Padding size */
  padding?: 'normal' | 'large';
}

/**
 * Reusable card component with consistent styling
 *
 * @param props - Card props
 * @returns Rendered card component
 */
export default function Card({
  children,
  className,
  padding = 'normal',
}: CardProps) {
  const paddingClass =
    padding === 'large' ? styles.cardPaddingLarge : styles.cardPadding;

  return (
    <div className={cn(styles.card, paddingClass, className)}>
      {children}
    </div>
  );
}

