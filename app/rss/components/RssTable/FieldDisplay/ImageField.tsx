'use client';

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
 *
 * @param props - Component props
 * @returns Rendered image field component
 */
export default function ImageField({ src, alt }: ImageFieldProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-20 h-20 object-cover rounded"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}

