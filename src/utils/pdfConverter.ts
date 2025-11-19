import * as pdfjsLib from 'pdfjs-dist';

// Set worker source - use CDN for better compatibility
// Alternatively, you can copy the worker file to public folder and use: `/pdf.worker.min.js`
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PdfPageImage {
  base64: string;
  pageNumber: number;
}

/**
 * Converts a PDF file to base64 encoded images
 * @param file - The PDF file to convert
 * @param scale - Scale factor for rendering (default: 2.0 for better quality)
 * @returns Array of base64 encoded images, one per page
 */
export async function pdfToBase64Images(
  file: File,
  scale: number = 2.0
): Promise<PdfPageImage[]> {
  console.log('[PDF Converter] Starting PDF conversion');
  console.log('[PDF Converter] File name:', file.name);
  console.log('[PDF Converter] File size:', file.size, 'bytes');
  console.log('[PDF Converter] Scale factor:', scale);

  const arrayBuffer = await file.arrayBuffer();
  console.log('[PDF Converter] PDF loaded, array buffer size:', arrayBuffer.byteLength, 'bytes');

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  console.log('[PDF Converter] PDF document loaded successfully');
  
  const images: PdfPageImage[] = [];
  const numPages = pdf.numPages;
  console.log('[PDF Converter] Total pages:', numPages);

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    console.log(`[PDF Converter] Processing page ${pageNum} of ${numPages}`);
    
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    console.log(`[PDF Converter] Page ${pageNum} viewport:`, viewport.width, 'x', viewport.height);

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    console.log(`[PDF Converter] Rendering page ${pageNum} to canvas`);
    await page.render(renderContext).promise;
    console.log(`[PDF Converter] Page ${pageNum} rendered successfully`);

    // Convert canvas to base64
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    console.log(`[PDF Converter] Page ${pageNum} converted to base64, length:`, base64.length);
    
    images.push({
      base64,
      pageNumber: pageNum,
    });
  }

  console.log('[PDF Converter] PDF conversion completed, total images:', images.length);
  return images;
}

