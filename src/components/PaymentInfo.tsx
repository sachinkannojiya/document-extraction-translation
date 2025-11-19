import DualLanguageField from './DualLanguageField';

// Local type since PaymentInfo is not exported from api.ts
interface PaymentInfoType {
  payment_terms?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  payment_date?: string | null;
}

interface PaymentInfoProps {
  paymentInfo?: PaymentInfoType;
  viewMode: 'original' | 'english';
}

export default function PaymentInfo({ paymentInfo, viewMode }: PaymentInfoProps) {
  if (!paymentInfo) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Payment Information
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DualLanguageField field={paymentInfo.payment_terms} label="Payment Terms" viewMode={viewMode} />
          <DualLanguageField field={paymentInfo.payment_method} label="Payment Method" viewMode={viewMode} />
          <DualLanguageField field={paymentInfo.payment_status} label="Payment Status" viewMode={viewMode} />
          <DualLanguageField field={paymentInfo.payment_date} label="Payment Date" viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}

