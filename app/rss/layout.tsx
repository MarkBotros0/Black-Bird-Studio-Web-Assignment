import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RSS Feed Parser & Editor',
  description: 'Parse, view, and edit RSS and Atom feeds with an intuitive interface',
};

/**
 * Layout component for RSS feed pages
 * Provides metadata and wraps child components
 *
 * @param props - Layout props
 * @param props.children - Child components to render
 * @returns Rendered layout component
 */
export default function RssLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

