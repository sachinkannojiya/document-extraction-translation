interface DocumentPreviewProps {
  imageUrl: string;
}

export default function DocumentPreview({ imageUrl }: DocumentPreviewProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Document Preview
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-full overflow-auto rounded-lg">
          <img
            src={imageUrl}
            alt="Document preview"
            className="max-w-full h-auto rounded-lg shadow-xl border-2 border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

