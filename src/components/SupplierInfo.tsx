import { SupplierDetails } from '../utils/api';
import DualLanguageField from './DualLanguageField';

interface SupplierInfoProps {
  supplierDetails?: SupplierDetails;
  viewMode: 'original' | 'english';
}

export default function SupplierInfo({ supplierDetails, viewMode }: SupplierInfoProps) {
  if (!supplierDetails) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Supplier Information
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DualLanguageField field={supplierDetails.name} label="Name" viewMode={viewMode} />
          <DualLanguageField field={supplierDetails.address} label="Address" viewMode={viewMode} />
          <DualLanguageField field={supplierDetails.tax_id} label="Tax ID" viewMode={viewMode} />
          <DualLanguageField field={supplierDetails.email} label="Email" viewMode={viewMode} />
          <DualLanguageField field={supplierDetails.phone} label="Phone" viewMode={viewMode} />
          <DualLanguageField field={supplierDetails.website} label="Website" viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
