# RSS Feed Parser & Editor

A powerful, modern web application for fetching, parsing, editing, and exporting RSS and Atom feeds. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality

- **RSS/Atom Feed Fetching**
  - Fetch RSS 2.0 and Atom feeds from any URL
  - Server-side API route to avoid CORS issues
  - Automatic format detection (RSS 2.0 or Atom)
  - Comprehensive error handling with user-friendly messages
  - URL validation before fetching

- **Dynamic Field Parsing**
  - Automatically extracts all XML fields from feeds
  - Preserves XML attributes and nested structures
  - Handles both standard and custom RSS/Atom fields
  - Supports complex field values with JSON-encoded attributes

- **Feed Information Display**
  - Shows feed metadata (title, description, link)
  - Displays feed type (RSS 2.0 or Atom)
  - Shows item count statistics
  - Clean, organized feed information card

### Table Features

- **Interactive Data Table**
  - Displays all RSS items in a structured table format
  - Automatically detects and displays all fields from feed items
  - Responsive table layout with fixed column widths
  - Empty state handling for feeds with no items

- **Inline Row Editing**
  - Edit individual feed items directly in the table
  - Save or cancel changes per row
  - Preserves XML attributes during editing
  - Real-time field value updates

- **Resizable Columns**
  - Drag-to-resize column widths
  - Smart default widths based on field types
  - Minimum column width constraints
  - Smooth resizing experience

- **Specialized Field Display**
  - **Image Fields**: Displays images with proper sizing
  - **Date Fields**: Formatted date display
  - **Link Fields**: Clickable links that open in new tabs
  - **Long Text Fields**: Truncated preview with expandable view
  - **Default Fields**: Standard text display

- **Specialized Field Editors**
  - **Image Field Editor**: URL input for image fields
  - **Date Field Editor**: Date picker for date/time fields
  - **Long Text Field Editor**: Textarea for description/content fields
  - **Default Field Editor**: Standard input for other fields
  - Automatic field type detection based on field names

### XML Generation & Export

- **RSS XML Generation**
  - Generates valid RSS 2.0 or Atom XML from edited feed data
  - Preserves all fields and attributes
  - Proper XML escaping for special characters
  - Maintains feed structure and formatting

- **File Download**
  - Download generated XML as a file
  - Automatic filename generation based on feed title
  - Clean filename sanitization

### User Experience

- **Modern UI/UX**
  - Clean, intuitive interface built with Tailwind CSS
  - Responsive design that works on all screen sizes
  - Loading states during feed fetching
  - Error messages with clear descriptions
  - Empty states for better user guidance

- **Accessibility**
  - ARIA labels for screen readers
  - Keyboard navigation support
  - Semantic HTML structure
  - Proper focus management

- **Performance**
  - Client-side state management
  - Efficient re-rendering with React hooks
  - Optimized column resizing
  - Fast XML parsing and generation

## 🛠️ Technical Capabilities

### Supported Feed Formats

- **RSS 2.0**: Full support for RSS 2.0 specification
- **Atom**: Full support for Atom 1.0 specification
- **Custom Fields**: Handles any custom XML elements

### Field Type Detection

The application automatically detects field types based on:
- Field names (title, description, date, link, image, etc.)
- Field values (URLs, dates, HTML content)
- XML structure and attributes

### Data Preservation

- Preserves all original XML fields
- Maintains XML attributes during editing
- Handles nested XML structures
- Supports namespaced elements

### Error Handling

- **Validation Errors**: Invalid URLs, empty feeds
- **Fetch Errors**: Network issues, HTTP errors
- **Parse Errors**: Invalid XML structure
- User-friendly error messages with error types

## 📦 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **XML Parsing**: @xmldom/xmldom
- **Build Tool**: Next.js built-in bundler

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-assignment
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📖 Usage

1. **Fetch a Feed**
   - Enter an RSS or Atom feed URL in the input field
   - Click "Fetch RSS" or press Enter
   - Wait for the feed to load

2. **View Feed Information**
   - Review feed metadata (title, description, link)
   - Check the item count

3. **Edit Feed Items**
   - Click "Edit" on any row to enter edit mode
   - Modify field values using the appropriate editors
   - Click "Save" to apply changes or "Cancel" to discard

4. **Resize Columns**
   - Hover over column borders
   - Click and drag to resize
   - Release to set new width

5. **Export XML**
   - Click "Download Updated RSS XML" button
   - The XML file will be automatically downloaded
   - Open the file in any XML viewer or RSS reader

## 🎯 Key Features Summary

✅ Fetch RSS 2.0 and Atom feeds  
✅ Parse and display all feed fields dynamically  
✅ Edit feed items inline with specialized editors  
✅ Resize table columns with drag-to-resize  
✅ Display images, links, dates, and long text appropriately  
✅ Generate valid RSS/Atom XML from edited data  
✅ Download XML files  
✅ Handle errors gracefully  
✅ Responsive and accessible UI  
✅ Server-side fetching to avoid CORS issues  
✅ Preserve XML attributes and structure  
✅ Support custom RSS fields  

## 📝 Project Structure

```
app/
├── api/rss/          # Server-side RSS fetching API
├── rss/              # Main RSS application
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # RSS fetching services
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── constants/    # Application constants
└── page.tsx          # Home page (redirects to /rss)
```

## 🔧 Development

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript type checking is built into the Next.js build process.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.
