'use client';

import RssTable from './components/RssTable';
import RssUrlInput from './components/RssUrlInput';
import ErrorDisplay from './components/ErrorDisplay';
import FeedInfo from './components/FeedInfo';
import EmptyState from './components/EmptyState';
import LoadingSpinner from './components/LoadingSpinner';
import PageHeader from './components/PageHeader';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import { useRssFeed } from './hooks/useRssFeed';
import { styles } from './styles';

/**
 * Main RSS Feed Parser & Editor page component
 * Handles RSS feed fetching, parsing, editing, and XML generation
 *
 * @returns Rendered RSS page component
 */
export default function RssPage() {
  const {
    url,
    setUrl,
    feed,
    loading,
    error,
    handleFetch,
    handleItemsChange,
    handleGenerateXml,
  } = useRssFeed();

  return (
    <div className={styles.layout.container}>
      <div className={`${styles.layout.content} ${feed ? 'pb-24' : ''}`}>
        <PageHeader />

        <RssUrlInput
          url={url}
          loading={loading}
          onUrlChange={setUrl}
          onFetch={handleFetch}
        />

        {error && <ErrorDisplay error={error} />}

        {loading && !feed && <LoadingSpinner />}

        {feed && (
          <>
            <FeedInfo feed={feed} />
            <Card>
              <RssTable items={feed.items} onItemsChange={handleItemsChange} />
            </Card>
          </>
        )}

        {!feed && !loading && !error && <EmptyState />}
      </div>

      {/* Fixed download button at bottom center */}
      {feed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="success"
            size="large"
            onClick={handleGenerateXml}
            aria-label="Download Updated RSS XML file"
            className="shadow-lg"
          >
            Download Updated RSS XML
          </Button>
        </div>
      )}
    </div>
  );
}

