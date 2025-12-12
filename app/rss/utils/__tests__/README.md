# Unit Tests

This directory contains comprehensive unit tests for all RSS utility functions.

## Test Coverage

The test suite covers:

- **xmlExtraction.ts**: XML element field extraction, namespace handling, attribute extraction
- **fieldParsing.ts**: Field value parsing, JSON handling, link extraction, attribute management
- **fieldTypeDetection.ts**: Field type categorization (title, description, date, link, image, etc.)
- **filenameUtils.ts**: Filename sanitization and XML filename generation
- **parseRss.ts**: RSS/Atom feed parsing (client-side)
- **parseRssServer.ts**: RSS/Atom feed parsing (server-side)
- **parseRssCommon.ts**: Common parsing logic for both client and server
- **generateRssXml.ts**: XML generation and file download functionality

## API Route Tests

The API route tests (`app/api/rss/__tests__/route.test.ts`) cover:

- Request validation
- URL validation
- Fetch error handling
- Timeout handling
- Parse error handling
- Response formatting

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Best Practices

- All tests use descriptive names following the pattern: `should [expected behavior]`
- Tests are organized by function/feature using `describe` blocks
- Edge cases and error conditions are thoroughly tested
- Mocks are used for external dependencies (fetch, DOM APIs)
- Tests are isolated and don't depend on each other

