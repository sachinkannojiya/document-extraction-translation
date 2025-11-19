interface DualLanguageFieldProps {
  field?: string | null;
  label: string;
  viewMode?: 'original' | 'english'; // Optional, kept for compatibility but not used
}

export default function DualLanguageField({ field, label }: DualLanguageFieldProps) {
  if (!field) return null;

  const displayValue = field.trim() || '';

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-sm text-slate-900 font-medium break-words">
        {displayValue || <span className="text-slate-400">-</span>}
      </div>
    </div>
  );
}
