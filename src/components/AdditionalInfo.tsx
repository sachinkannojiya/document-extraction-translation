import DualLanguageField from './DualLanguageField';

// Local type since AdditionalInfo is not exported from api.ts
interface AdditionalInfoType {
  notes?: string | null;
  terms_and_conditions?: string | null;
  special_instructions?: string | null;
  delivery_date?: string | null;
  delivery_method?: string | null;
  project_name?: string | null;
  department?: string | null;
  authorized_by?: string | null;
  prepared_by?: string | null;
}

interface AdditionalInfoProps {
  additionalInfo?: AdditionalInfoType;
  viewMode: 'original' | 'english';
}

export default function AdditionalInfo({ additionalInfo, viewMode }: AdditionalInfoProps) {
  if (!additionalInfo) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Additional Information
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DualLanguageField field={additionalInfo.notes} label="Notes" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.terms_and_conditions} label="Terms & Conditions" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.special_instructions} label="Special Instructions" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.delivery_date} label="Delivery Date" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.delivery_method} label="Delivery Method" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.project_name} label="Project Name" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.department} label="Department" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.authorized_by} label="Authorized By" viewMode={viewMode} />
          <DualLanguageField field={additionalInfo.prepared_by} label="Prepared By" viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}

