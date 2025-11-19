import { Summary } from '../utils/api';
import DualLanguageField from './DualLanguageField';

interface FinancialSummaryProps {
  summary?: Summary;
  viewMode: 'original' | 'english';
}

function formatCurrency(value: number | null | undefined, currency?: string | null): string {
  if (value === null || value === undefined) return '-';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return currency ? `${currency} ${formatted}` : formatted;
}

function NumericFieldDisplay({ value, label }: { value?: number | null; label: string }) {
  if (value === null || value === undefined) return null;

  const displayValue = formatCurrency(value);

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-lg font-bold text-blue-600">{displayValue}</div>
    </div>
  );
}

export default function FinancialSummary({ summary, viewMode }: FinancialSummaryProps) {
  if (!summary) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Financial Summary
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumericFieldDisplay value={summary.subtotal} label="Subtotal" />
          <NumericFieldDisplay value={summary.tax_total} label="Tax Total" />
          <NumericFieldDisplay value={summary.shipping} label="Shipping" />
          <NumericFieldDisplay value={summary.adjustments} label="Adjustments" />
        </div>
        <div className="mt-6 pt-6 border-t-2 border-blue-200">
          <NumericFieldDisplay value={summary.total_amount} label="Total Amount" />
        </div>
        {summary.amount_in_words && (
          <div className="mt-4">
            <DualLanguageField field={summary.amount_in_words} label="Amount in Words" viewMode={viewMode} />
          </div>
        )}
      </div>
    </div>
  );
}
