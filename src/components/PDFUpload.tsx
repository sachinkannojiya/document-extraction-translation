import { useState, useRef } from 'react';
import { isImageFile } from '../utils/imageConverter';

interface PDFUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function PDFUpload({ onFileSelect, isProcessing }: PDFUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || isImageFile(file)) {
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file or image (JPEG, PNG)');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || isImageFile(file)) {
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file or image (JPEG, PNG)');
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 shadow-lg ${
          dragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02] shadow-blue-200'
            : 'border-slate-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50'
        } ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isProcessing ? onButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-slate-100'} transition-colors`}>
            <svg
              className={`w-16 h-16 ${dragActive ? 'text-blue-600' : 'text-slate-400'} transition-colors`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className={`text-xl font-semibold ${dragActive ? 'text-blue-700' : 'text-slate-700'} transition-colors`}>
              {isProcessing ? 'Processing...' : 'Drop your invoice here'}
            </p>
            <p className={`text-sm ${dragActive ? 'text-blue-600' : 'text-slate-500'} mt-2 transition-colors`}>
              PDF, JPEG, or PNG • Click to browse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

