'use client';

import Image from 'next/image';

/**
 * Props for ImageField component
 */
interface ImageFieldProps {
  /** Image URL */
  src: string;
  /** Alt text for the image */
  alt: string;
}

/**
 * Component for displaying image fields
 * Uses Next.js Image component for optimization
 *
 * @param props - Component props
 * @returns Rendered image field component
 */
export default function ImageField({ src, alt }: ImageFieldProps) {
  return (
    <div className="relative w-20 h-20 rounded overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        unoptimized // RSS feed images may be from external sources, disable optimization
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
}

