'use client';

import { styles } from '../styles';

/**
 * Component for the main page header
 *
 * @returns Rendered page header component
 */
export default function PageHeader() {
  return (
    <header className="mb-8">
      <h1 className={styles.text.heading}>RSS Feed Parser & Editor</h1>
      <p className={`${styles.text.body} ${styles.text.muted} mt-2 max-w-3xl`}>
        Parse, view, and edit RSS and Atom feeds. Enter a feed URL to get started,
        then customize and export your feed as XML.
      </p>
    </header>
  );
}

