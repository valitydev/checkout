import { createContext } from 'react';

export type PayableInvoiceData = {
    invoiceID: string;
    invoiceAccessToken: string;
};

export const PayableInvoiceContext = createContext<{
    payableInvoiceData: PayableInvoiceData;
    setPayableInvoiceData: (data: PayableInvoiceData) => void;
}>(null);
