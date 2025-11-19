type ViewMode = 'original' | 'english';

interface LanguageToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sourceLanguage?: string;
}

export default function LanguageToggle({ viewMode, onViewModeChange, sourceLanguage }: LanguageToggleProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {sourceLanguage && (
        <div className="text-sm text-slate-600">
          <span className="font-semibold">Detected Language:</span>{' '}
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
            {sourceLanguage}
          </span>
        </div>
      )}
      <button
        onClick={() => onViewModeChange(viewMode === 'english' ? 'original' : 'english')}
        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
          viewMode === 'english'
            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
      >
        {viewMode === 'english' ? 'English' : 'Original'}
      </button>
    </div>
  );
}

