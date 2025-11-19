import { CustomerDetails } from '../utils/api';
import DualLanguageField from './DualLanguageField';

interface CustomerInfoProps {
  customerDetails?: CustomerDetails;
  viewMode: 'original' | 'english';
}

export default function CustomerInfo({ customerDetails, viewMode }: CustomerInfoProps) {
  if (!customerDetails) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Customer Information
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DualLanguageField field={customerDetails.name} label="Name" viewMode={viewMode} />
          <DualLanguageField field={customerDetails.address} label="Address" viewMode={viewMode} />
          <DualLanguageField field={customerDetails.tax_id} label="Tax ID" viewMode={viewMode} />
          <DualLanguageField field={customerDetails.customer_reference} label="Customer Reference" viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
