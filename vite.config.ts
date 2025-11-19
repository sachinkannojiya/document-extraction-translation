import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  resolve: {
    alias: {
      // Ensure pdfjs-dist resolves correctly
    },
  },
  server: {
    proxy: {
      // Proxy Azure Analysis API requests
      '/api/azure-analysis': {
        target: 'https://raws.e42.ai/edith/api/core/documents/v3/azure-analysis',
        changeOrigin: true,
        rewrite: (path) => '',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add the cookie header
            proxyReq.setHeader('Cookie', 'elementor_split_test_client_id=c030c8dc-4c4b-48cc-badc-29301a57912a');
          });
        },
      },
      // Proxy LLM Text API requests
      '/api/llm-text': {
        target: 'https://samarjit.lightinfosys.com/external_api/e42_llm_text',
        changeOrigin: true,
        rewrite: (path) => '',
      },
      // Proxy Translation API requests
      '/api/translate-json': {
        target: 'https://samarjit.lightinfosys.com/external_api/translate_json_to_english',
        changeOrigin: true,
        rewrite: (path) => '',
      },
    },
  },
})
