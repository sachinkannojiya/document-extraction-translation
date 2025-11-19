// API endpoints - Using Vite proxy in development, direct URLs in production
// In development, Vite proxy forwards these to the actual APIs
// In production, use direct API URLs
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const AZURE_ANALYSIS_API = isDevelopment 
  ? '/api/azure-analysis' 
  : 'https://raws.e42.ai/edith/api/core/documents/v3/azure-analysis';
const LLM_TEXT_API = isDevelopment
  ? '/api/llm-text'
  : 'https://samarjit.lightinfosys.com/external_api/e42_llm_text';
const TRANSLATION_API = isDevelopment
  ? '/api/translate-json'
  : 'https://samarjit.lightinfosys.com/external_api/translate_json_to_english';

const INVOICE_STRUCTURING_PROMPT = `You are an invoice-structuring model. 

Input: You will receive full OCR-extracted Markdown from Azure Read (including headings, tables, blocks, bullets, repeated text, and noise). 

Goal: Parse and interpret the Markdown and convert it into a clean JSON object following the schema below. 

Guidelines:

Do NOT translate any values.

Use extracted text exactly as found, even if noisy.

If a field is missing, return None.

Detect the document's language from the Markdown and return the ISO code in source_language.

Do not guess or infer values that are not present.

Create as many line_items as present in the Markdown tables or text.

Keep all numbers unformatted (no commas).

Keep date formats exactly as found.

Output ONLY the JSON. No explanation.

{
  "document_type": "invoice",
  "source_language": "string",
  "invoice_details": {
    "invoice_number": "string|None",
    "invoice_date": "string|None",
    "due_date": "string|None",
    "po_number": "string|None",
    "contract_number": "string|None",
    "currency": "string|None",
    "payment_terms": "string|None"
  },
  "supplier_details": {
    "name": "string|None",
    "address": "string|None",
    "tax_id": "string|None",
    "email": "string|None",
    "phone": "string|None",
    "website": "string|None"
  },
  "customer_details": {
    "name": "string|None",
    "address": "string|None",
    "tax_id": "string|None",
    "customer_reference": "string|None"
  },
  "line_items": [
    {
      "line_no": "number|None",
      "description": "string|None",
      "quantity": "number|None",
      "unit": "string|None",
      "unit_price": "number|None",
      "tax_rate": "number|None",
      "tax_amount": "number|None",
      "line_total": "number|None"
    }
  ],
  "summary": {
    "subtotal": "number|None",
    "tax_total": "number|None",
    "shipping": "number|None",
    "adjustments": "number|None",
    "total_amount": "number|None",
    "amount_in_words": "string|None"
  },
  "bank_details": {
    "bank_name": "string|None",
    "account_number": "string|None",
    "iban_ifsc_swift": "string|None",
    "branch": "string|None",
    "payment_instructions": "string|None"
  }
}`;

// Updated interfaces - using simple strings instead of DualLanguageField
export interface InvoiceDetails {
  invoice_number?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  po_number?: string | null;
  contract_number?: string | null;
  currency?: string | null;
  payment_terms?: string | null;
}

export interface SupplierDetails {
  name?: string | null;
  address?: string | null;
  tax_id?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
}

export interface CustomerDetails {
  name?: string | null;
  address?: string | null;
  tax_id?: string | null;
  customer_reference?: string | null;
}

export interface LineItem {
  line_no?: number | null;
  description?: string | null;
  quantity?: number | null;
  unit?: string | null;
  unit_price?: number | null;
  tax_rate?: number | null;
  tax_amount?: number | null;
  line_total?: number | null;
}

export interface Summary {
  subtotal?: number | null;
  tax_total?: number | null;
  shipping?: number | null;
  adjustments?: number | null;
  total_amount?: number | null;
  amount_in_words?: string | null;
}

export interface BankDetails {
  bank_name?: string | null;
  account_number?: string | null;
  iban_ifsc_swift?: string | null;
  branch?: string | null;
  payment_instructions?: string | null;
}

export interface ExtractedInvoiceData {
  document_type?: string;
  source_language?: string;
  invoice_details?: InvoiceDetails;
  supplier_details?: SupplierDetails;
  customer_details?: CustomerDetails;
  line_items?: LineItem[];
  summary?: Summary;
  bank_details?: BankDetails;
}

interface AzureAnalysisResponse {
  success: boolean;
  message: string;
  data: {
    key_value_pairs: any;
    full_markdown: string;
    tables_markdown: string[];
  };
}

/**
 * Step 1: Upload file to Azure Analysis API
 */
export async function uploadFileToAzureAnalysis(file: File): Promise<string> {
  console.log('[Azure Analysis API] Starting file upload');
  console.log('[Azure Analysis API] File name:', file.name);
  console.log('[Azure Analysis API] File type:', file.type);
  console.log('[Azure Analysis API] File size:', file.size, 'bytes');

  const formData = new FormData();
  formData.append('file', file);

  console.log('[Azure Analysis API] Sending POST request to:', AZURE_ANALYSIS_API);
  if (isDevelopment) {
    console.log('[Azure Analysis API] Note: Vite proxy will forward to Azure API');
  }

  const headers: HeadersInit = {};
  // Add Cookie header in production (in development, Vite proxy handles it)
  if (!isDevelopment) {
    headers['Cookie'] = 'elementor_split_test_client_id=c030c8dc-4c4b-48cc-badc-29301a57912a';
  }

  const response = await fetch(AZURE_ANALYSIS_API, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  console.log('[Azure Analysis API] Response status:', response.status);
  console.log('[Azure Analysis API] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Azure Analysis API] Error response:', errorText);
    throw new Error(`Azure Analysis API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: AzureAnalysisResponse = await response.json();
  console.log('[Azure Analysis API] Response received successfully');
  console.log('[Azure Analysis API] Success:', data.success);
  console.log('[Azure Analysis API] Message:', data.message);

  if (!data.success) {
    throw new Error(`Azure Analysis API returned error: ${data.message}`);
  }

  if (!data.data || !data.data.full_markdown) {
    console.error('[Azure Analysis API] Missing full_markdown in response');
    console.error('[Azure Analysis API] Response data:', JSON.stringify(data, null, 2));
    throw new Error('Azure Analysis API response missing full_markdown field');
  }

  console.log('[Azure Analysis API] Full markdown length:', data.data.full_markdown.length);
  console.log('[Azure Analysis API] Full markdown preview:', data.data.full_markdown.substring(0, 200) + '...');

  return data.data.full_markdown;
}

/**
 * Step 2: Send markdown to LLM API for structuring
 * Returns both the extracted data and the full LLM response
 */
export async function processMarkdownWithLLM(fullMarkdown: string): Promise<{
  extractedData: ExtractedInvoiceData;
  fullResponse: any;
}> {
  console.log('[LLM Text API] Starting markdown processing');
  console.log('[LLM Text API] Markdown length:', fullMarkdown.length);
  console.log('[LLM Text API] Markdown preview:', fullMarkdown.substring(0, 200) + '...');

  const params = new URLSearchParams();
  params.append('input_text', fullMarkdown);
  params.append('prompt', INVOICE_STRUCTURING_PROMPT);
  params.append('provider', 'groq');
  params.append('model', 'llama-3.3-70b-versatile');

  console.log('[LLM Text API] Sending POST request to:', LLM_TEXT_API);
  console.log('[LLM Text API] Request params:', {
    input_text_length: fullMarkdown.length,
    prompt_length: INVOICE_STRUCTURING_PROMPT.length,
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
  });

  const response = await fetch(LLM_TEXT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  console.log('[LLM Text API] Response status:', response.status);
  console.log('[LLM Text API] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[LLM Text API] Error response:', errorText);
    throw new Error(`LLM Text API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const responseText = await response.text();
  console.log('[LLM Text API] Raw response received');
  console.log('[LLM Text API] Response length:', responseText.length);
  console.log('[LLM Text API] Response preview:', responseText.substring(0, 500));

  let extractedData: ExtractedInvoiceData;
  let fullResponse: any;

  try {
    // Try to parse as JSON directly
    const jsonData = JSON.parse(responseText);
    console.log('[LLM Text API] Parsed JSON successfully');
    console.log('[LLM Text API] Response structure:', Object.keys(jsonData));
    
    // Store the full response
    fullResponse = jsonData;
    
    // Check if response has nested structure
    // Handle: {"message": "success", "data": {"Answer": {...}}}
    if (jsonData.data?.Answer) {
      console.log('[LLM Text API] Found data.Answer structure');
      extractedData = jsonData.data.Answer;
    }
    // Handle: {"response": "...", "data": {...}, "result": {...}}
    else if (jsonData.response || jsonData.data || jsonData.result) {
      const content = jsonData.response || jsonData.data || jsonData.result;
      if (typeof content === 'string') {
        extractedData = JSON.parse(content);
      } else {
        extractedData = content;
      }
    } 
    // Direct invoice data
    else {
      extractedData = jsonData;
    }
  } catch (parseError) {
    console.warn('[LLM Text API] Direct JSON parse failed, trying to extract JSON from text');
    console.warn('[LLM Text API] Parse error:', parseError);
    
    // Try to extract JSON from markdown code blocks or plain text
    let jsonString = responseText.trim();
    
    // Remove markdown code blocks if present
  if (jsonString.includes('```')) {
    jsonString = jsonString.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  }

    // Extract JSON object
  const firstBrace = jsonString.indexOf('{');
  const lastBrace = jsonString.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.slice(firstBrace, lastBrace + 1);
    }
    
    try {
      fullResponse = JSON.parse(jsonString);
      extractedData = fullResponse;
      console.log('[LLM Text API] Successfully extracted and parsed JSON');
    } catch (extractError) {
      console.error('[LLM Text API] Failed to extract JSON from response');
      console.error('[LLM Text API] Extract error:', extractError);
      console.error('[LLM Text API] Response text:', responseText);
      throw new Error('Failed to parse JSON from LLM Text API response');
    }
  }

  console.log('[LLM Text API] Extracted data structure:', {
    document_type: extractedData.document_type,
    source_language: extractedData.source_language,
    has_invoice_details: !!extractedData.invoice_details,
    has_supplier_details: !!extractedData.supplier_details,
    has_customer_details: !!extractedData.customer_details,
    line_items_count: extractedData.line_items?.length || 0,
  });

  return { extractedData, fullResponse };
}

/**
 * Translate invoice data to English
 * Takes the full LLM response and passes it directly to translation API
 */
export async function translateInvoiceDataToEnglish(
  fullLLMResponse: any
): Promise<ExtractedInvoiceData> {
  console.log('[Translation API] Starting translation to English');
  console.log('[Translation API] Full LLM response structure:', Object.keys(fullLLMResponse));

  // Remove "raw" key from data if it exists
  if (fullLLMResponse.data && 'raw' in fullLLMResponse.data) {
    console.log('[Translation API] Removing "raw" key from data object');
    const { raw, ...dataWithoutRaw } = fullLLMResponse.data;
    fullLLMResponse = {
      ...fullLLMResponse,
      data: dataWithoutRaw,
    };
  }

  // The API expects raw JSON string directly in the body (NOT wrapped in json_data field)
  // Content-Type: application/x-www-form-urlencoded but body is raw JSON string
  // This matches curl: --data '{...}' with Content-Type: application/x-www-form-urlencoded
  const jsonBody = JSON.stringify(fullLLMResponse);
  
  console.log('[Translation API] Data structure being sent:', {
    has_message: !!fullLLMResponse.message,
    has_data: !!fullLLMResponse.data,
    has_answer: !!fullLLMResponse.data?.Answer,
    has_raw: 'raw' in (fullLLMResponse.data || {}),
    data_keys: Object.keys(fullLLMResponse.data || {}),
  });

  console.log('[Translation API] Sending POST request to:', TRANSLATION_API);
  console.log('[Translation API] JSON string being sent (first 500 chars):', jsonBody.substring(0, 500));
  console.log('[Translation API] Body length:', jsonBody.length, 'characters');

  const response = await fetch(TRANSLATION_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: jsonBody, // Send raw JSON string directly (not wrapped in json_data)
  });

  console.log('[Translation API] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Translation API] Error response:', errorText);
    console.error('[Translation API] JSON data that was sent:', jsonBody.substring(0, 500));
    throw new Error(`Translation API error: ${response.status} ${response.statusText} - ${errorText.substring(0, 200)}`);
  }

  const responseData = await response.json();
  console.log('[Translation API] Response received successfully');
  console.log('[Translation API] Response structure:', Object.keys(responseData));

  // Extract translated data from nested structure
  // Response format: {"message": "success", "data": {"message": "success", "data": {"Answer": {...}}}}
  let translatedData: ExtractedInvoiceData;

  if (responseData.data?.data?.Answer) {
    console.log('[Translation API] Found data.data.Answer structure');
    translatedData = responseData.data.data.Answer;
  } else if (responseData.data?.Answer) {
    console.log('[Translation API] Found data.Answer structure');
    translatedData = responseData.data.Answer;
  } else if (responseData.Answer) {
    console.log('[Translation API] Found Answer structure');
    translatedData = responseData.Answer;
  } else {
    console.error('[Translation API] Unexpected response structure:', JSON.stringify(responseData, null, 2));
    throw new Error('Translation API returned unexpected response structure');
  }

  console.log('[Translation API] Translated data structure:', {
    document_type: translatedData.document_type,
    source_language: translatedData.source_language,
    has_invoice_details: !!translatedData.invoice_details,
    has_supplier_details: !!translatedData.supplier_details,
    has_customer_details: !!translatedData.customer_details,
    line_items_count: translatedData.line_items?.length || 0,
  });

  return translatedData;
}

/**
 * Main processing function: Upload file and process with LLM
 * Returns both extracted data and full LLM response
 */
export async function processInvoiceFile(file: File): Promise<{
  extractedData: ExtractedInvoiceData;
  fullLLMResponse: any;
}> {
  console.log('[Invoice Processor] Starting invoice processing workflow');
  console.log('[Invoice Processor] File:', file.name, file.type, file.size);

  // Step 1: Upload to Azure Analysis
  console.log('[Invoice Processor] Step 1: Uploading file to Azure Analysis API');
  const fullMarkdown = await uploadFileToAzureAnalysis(file);
  console.log('[Invoice Processor] Step 1 completed: Received full_markdown');

  // Step 2: Process markdown with LLM
  console.log('[Invoice Processor] Step 2: Processing markdown with LLM API');
  const { extractedData, fullResponse } = await processMarkdownWithLLM(fullMarkdown);
  console.log('[Invoice Processor] Step 2 completed: Received structured data');

  console.log('[Invoice Processor] Processing workflow completed successfully');
  return { extractedData, fullLLMResponse: fullResponse };
}
