import { useState } from 'react';
import PDFUpload from './components/PDFUpload';
import InvoiceHeader from './components/InvoiceHeader';
import SupplierInfo from './components/SupplierInfo';
import CustomerInfo from './components/CustomerInfo';
import LineItemsTable from './components/LineItemsTable';
import FinancialSummary from './components/FinancialSummary';
import BankDetails from './components/BankDetails';
import LanguageToggle from './components/LanguageToggle';
import {
  processInvoiceFile,
  translateInvoiceDataToEnglish,
  ExtractedInvoiceData,
} from './utils/api';

type ViewMode = 'original' | 'english';

function App() {
  const [originalData, setOriginalData] = useState<ExtractedInvoiceData | null>(null);
  const [translatedData, setTranslatedData] = useState<ExtractedInvoiceData | null>(null);
  const [fullLLMResponse, setFullLLMResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('original');

  const handleFileSelect = async (selectedFile: File) => {
    console.log('[App] ========================================');
    console.log('[App] File upload initiated');
    console.log('[App] File name:', selectedFile.name);
    console.log('[App] File type:', selectedFile.type);
    console.log('[App] File size:', selectedFile.size, 'bytes');
    console.log('[App] ========================================');

    // Reset state
    setOriginalData(null);
    setTranslatedData(null);
    setFullLLMResponse(null);
    setError(null);
    setIsProcessing(true);

    try {
      // Process file with Azure Analysis + LLM APIs
      console.log('[App] Processing file with Azure Analysis + LLM APIs');
      const { extractedData, fullLLMResponse: llmResponse } = await processInvoiceFile(selectedFile);
      console.log('[App] Processing completed: Received extracted data');
      console.log('[App] Extracted data structure:', {
        sourceLanguage: extractedData.source_language,
        documentType: extractedData.document_type,
        hasInvoiceDetails: !!extractedData.invoice_details,
        hasSupplierDetails: !!extractedData.supplier_details,
        hasCustomerDetails: !!extractedData.customer_details,
        lineItemsCount: extractedData.line_items?.length || 0,
      });
      
      setOriginalData(extractedData);
      setFullLLMResponse(llmResponse);
      setViewMode('original'); // Reset to original view
      console.log('[App] ========================================');
      console.log('[App] Processing workflow completed successfully');
      console.log('[App] ========================================');
    } catch (err) {
      console.error('[App] ========================================');
      console.error('[App] Processing workflow failed');
      console.error('[App] Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[App] Error message:', err instanceof Error ? err.message : String(err));
      console.error('[App] Error stack:', err instanceof Error ? err.stack : 'N/A');
      console.error('[App] ========================================');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsProcessing(false);
      console.log('[App] Processing state reset to false');
    }
  };

  const handleViewModeChange = async (mode: ViewMode) => {
    console.log('[App] View mode change requested:', mode);
    
    // If switching to English and we don't have translated data yet, fetch it
    if (mode === 'english' && !translatedData && fullLLMResponse) {
      console.log('[App] Switching to English - fetching translation');
      setIsTranslating(true);
      setError(null);
      
      try {
        // Pass the full LLM response to translation API
        const translated = await translateInvoiceDataToEnglish(fullLLMResponse);
        console.log('[App] Translation completed successfully');
        setTranslatedData(translated);
        setViewMode('english');
      } catch (err) {
        console.error('[App] Translation failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to translate to English');
        // Keep original view mode if translation fails
      } finally {
        setIsTranslating(false);
      }
    } else {
      // Just switch the view mode
      setViewMode(mode);
    }
  };

  // Determine which data to display based on view mode
  const displayedData = viewMode === 'english' && translatedData ? translatedData : originalData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Invoice Data Extractor
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Extract comprehensive invoice data with AI • Supports multiple languages
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <PDFUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-red-800 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-5 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-blue-800 font-semibold text-lg">
                  Processing invoice...
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Uploading to Azure Analysis and processing with LLM. This may take a moment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Translation Indicator */}
        {isTranslating && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-5 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="animate-spin h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-semibold text-lg">
                  Translating to English...
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Please wait while we translate the invoice data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {displayedData && (
          <div className="space-y-6">
            {/* Language Toggle */}
            <LanguageToggle 
              viewMode={viewMode} 
              onViewModeChange={handleViewModeChange}
              sourceLanguage={originalData?.source_language}
            />

            {/* Extracted Data */}
            {(displayedData.invoice_details || displayedData.supplier_details || displayedData.customer_details || displayedData.line_items) && (
              <div className="space-y-6">
                <InvoiceHeader invoiceDetails={displayedData.invoice_details} viewMode={viewMode} />
                
                <div className="grid grid-cols-1 gap-6">
                  <SupplierInfo supplierDetails={displayedData.supplier_details} viewMode={viewMode} />
                  <CustomerInfo customerDetails={displayedData.customer_details} viewMode={viewMode} />
                </div>

                <LineItemsTable lineItems={displayedData.line_items} viewMode={viewMode} />

                <FinancialSummary summary={displayedData.summary} viewMode={viewMode} />

                <BankDetails bankDetails={displayedData.bank_details} viewMode={viewMode} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
