import { LineItem } from '../utils/api';

interface LineItemsTableProps {
  lineItems?: LineItem[];
  viewMode?: 'original' | 'english'; // Optional, kept for compatibility but not used
}

function formatCurrency(value: number | null | undefined, currency?: string | null): string {
  if (value === null || value === undefined) return '-';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return currency ? `${currency} ${formatted}` : formatted;
}

export default function LineItemsTable({ lineItems }: LineItemsTableProps) {
  if (!lineItems || lineItems.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No line items found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Line Items ({lineItems.length})
        </h3>
      </div>
      <div className="overflow-x-auto bg-gradient-to-br from-white to-slate-50">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Line #</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Tax Rate</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Tax Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Line Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {lineItems.map((item, index) => {
              const description = item.description || '-';
              const unit = item.unit || '';
              
              return (
                <tr 
                  key={index} 
                  className={`transition-colors ${
                    index % 2 === 0 
                      ? 'bg-white hover:bg-blue-50' 
                      : 'bg-slate-50 hover:bg-blue-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {item.line_no !== null && item.line_no !== undefined ? item.line_no : index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs">
                    {description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {item.quantity !== null && item.quantity !== undefined 
                      ? `${item.quantity}${unit ? ` ${unit}` : ''}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {item.tax_rate !== null && item.tax_rate !== undefined 
                      ? `${item.tax_rate}%` 
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {formatCurrency(item.tax_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    {formatCurrency(item.line_total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
