import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const targetUrl = 'https://raws.e42.ai/edith/api/core/documents/v3/azure-analysis';
    
    // Get the raw body - Vercel provides this as a buffer/stream
    // For FormData, we need to forward it as-is
    const body = req.body;
    
    // Build headers for the target API
    const headers: Record<string, string> = {
      'Cookie': 'elementor_split_test_client_id=c030c8dc-4c4b-48cc-badc-29301a57912a',
    };
    
    // Forward Content-Type header (important for FormData boundary)
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'] as string;
    }
    
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      // Forward body as-is (could be FormData, buffer, or stream)
      body: body as any,
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Azure Analysis API proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
