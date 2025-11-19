import { InvoiceDetails } from '../utils/api';
import DualLanguageField from './DualLanguageField';

interface InvoiceHeaderProps {
  invoiceDetails?: InvoiceDetails;
  viewMode: 'original' | 'english';
}

export default function InvoiceHeader({ invoiceDetails, viewMode }: InvoiceHeaderProps) {
  if (!invoiceDetails) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoice Details
        </h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DualLanguageField field={invoiceDetails.invoice_number} label="Invoice Number" viewMode={viewMode} />
          <DualLanguageField field={invoiceDetails.invoice_date} label="Invoice Date" viewMode={viewMode} />
          <DualLanguageField field={invoiceDetails.due_date} label="Due Date" viewMode={viewMode} />
          <DualLanguageField field={invoiceDetails.po_number} label="PO Number" viewMode={viewMode} />
          <DualLanguageField field={invoiceDetails.contract_number} label="Contract Number" viewMode={viewMode} />
          <DualLanguageField field={invoiceDetails.payment_terms} label="Payment Terms" viewMode={viewMode} />
          <DualLanguageField field={invoiceDetails.currency} label="Currency" viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
