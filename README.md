# Invoice Data Extractor

A comprehensive web application that extracts **ALL DATA** from invoices in any language using the Qwen Vision Model from Fireworks AI. Displays both original language and English translation side-by-side.

## Features

- 📄 **Multi-Format Upload**: Upload invoice PDFs or images (JPEG, PNG)
- 🌍 **Multi-Language Support**: Automatically detects language and extracts data in both original and English
- 🔍 **Comprehensive Extraction**: Extracts EVERY field from invoices including:
  - Invoice header (number, date, PO numbers, references)
  - Supplier/Vendor details (complete address, contact, bank details, tax IDs)
  - Customer information (billing and shipping addresses)
  - Line items (descriptions, quantities, prices, taxes, discounts)
  - Financial summary (subtotals, taxes, shipping, totals)
  - Payment information (terms, methods, status)
  - Additional information (notes, terms, delivery info)
  - Stamps, signatures, and metadata
- 👁️ **Multiple View Modes**: 
  - Original language only
  - English translation only
  - Side-by-side comparison
- 📊 **Completeness Score**: Shows percentage of expected fields extracted
- 💾 **Export Options**: Download extracted data as JSON or CSV
- 🎨 **Modern UI**: Clean, responsive design with collapsible sections

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Fireworks AI API key ([Get one here](https://fireworks.ai))

### Installation

```bash
cd phoenix-mall/UI
npm install
```

### Environment Configuration

Create a `.env` file in the `UI` directory:

```bash
VITE_FIREWORKS_API_KEY=your_api_key_here
```

**Note**: The API key is used client-side. For production, consider using a backend proxy to keep your API key secure.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Usage

1. **Upload an Invoice**: 
   - Drag and drop a PDF or image file (JPEG, PNG)
   - Or click to browse and select a file

2. **Processing**: 
   - The app converts PDFs to images (or uses uploaded images directly)
   - Sends the image to Fireworks AI Qwen2-VL-72B model
   - Extracts comprehensive invoice data in both original language and English

3. **View Results**: 
   - See the invoice preview
   - Review extracted data organized by sections
   - Toggle between Original/English/Side-by-side views
   - Check completeness score
   - Export data as JSON or CSV

## API Integration

### Fireworks AI
- **Endpoint**: `https://api.fireworks.ai/inference/v1/chat/completions`
- **Model**: `accounts/fireworks/models/qwen2-vl-72b-instruct`
- **Input**: Base64 encoded image with comprehensive extraction prompt
- **Output**: Structured JSON with dual-language fields

### File Processing
- **PDFs**: Converted to images using pdf.js (client-side)
- **Images**: Directly converted to base64 for API submission
- **Supported Formats**: PDF, JPEG, PNG

## Data Structure

The extracted data follows a comprehensive structure:

```json
{
  "source_language": "detected language",
  "invoice_data": {
    "header": { ... },
    "supplier": { ... },
    "customer": { ... },
    "line_items": [ ... ],
    "financial_summary": { ... },
    "payment_info": { ... },
    "additional_info": { ... },
    "stamps_and_signatures": { ... },
    "metadata": { ... }
  }
}
```

Each text field includes both `original` and `english` properties for dual-language support.

## Project Structure

```
UI/
├── src/
│   ├── components/
│   │   ├── PDFUpload.tsx          # File upload component
│   │   ├── DocumentPreview.tsx    # Image preview component
│   │   ├── InvoiceHeader.tsx      # Invoice header display
│   │   ├── SupplierInfo.tsx       # Supplier information
│   │   ├── CustomerInfo.tsx       # Customer information
│   │   ├── LineItemsTable.tsx     # Line items table
│   │   ├── FinancialSummary.tsx   # Financial summary
│   │   ├── PaymentInfo.tsx       # Payment information
│   │   ├── AdditionalInfo.tsx    # Additional information
│   │   ├── LanguageToggle.tsx    # Language view toggle
│   │   ├── ExportButtons.tsx     # Export functionality
│   │   ├── CompletenessScore.tsx # Completeness indicator
│   │   └── DualLanguageField.tsx # Dual language field display
│   ├── utils/
│   │   ├── api.ts                 # Fireworks API integration
│   │   ├── pdfConverter.ts        # PDF to image conversion
│   │   ├── imageConverter.ts      # Image to base64 conversion
│   │   └── export.ts             # Export utilities
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **pdf.js** - PDF rendering and conversion
- **Fireworks AI** - Qwen2-VL-72B Vision LLM for comprehensive invoice extraction

## Features in Detail

### Comprehensive Extraction
The application extracts every possible field from invoices, including:
- Header information (invoice numbers, dates, references)
- Complete supplier/vendor details with bank information
- Customer billing and shipping addresses
- Detailed line items with descriptions, quantities, prices
- Complete financial breakdown (subtotals, taxes, discounts, totals)
- Payment terms and methods
- Additional notes, terms, and conditions
- Stamps, signatures, and document metadata

### Dual Language Support
- Automatically detects source language
- Extracts text in original language
- Provides English translations
- Side-by-side comparison view

### Export Options
- **JSON**: Full structured data export
- **CSV**: Flattened data for spreadsheet applications

### Completeness Score
Calculates and displays the percentage of expected fields that were successfully extracted, helping users understand data quality.

## Error Handling

- Handles API rate limits with clear error messages
- Validates file formats before processing
- Provides retry logic for failed API calls
- Gracefully handles partial extraction results
- Shows warnings for missing expected fields

## Performance

- Client-side PDF/image processing (no server required)
- Optimized image encoding for API submission
- Efficient rendering with React component optimization
- Lazy loading for large datasets

## Security Notes

⚠️ **Important**: The Fireworks API key is currently used client-side. For production deployments, consider:
- Using a backend proxy to keep API keys secure
- Implementing rate limiting
- Adding authentication/authorization
- Logging and monitoring API usage

## License

MIT
