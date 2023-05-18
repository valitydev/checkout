import { createContext } from 'react';
import { PayableInvoiceData } from 'checkout/hooks';

export const PayableInvoiceContext = createContext<{
    payableInvoiceData: PayableInvoiceData;
    setPayableInvoiceData: (data: PayableInvoiceData) => void;
}>(null);
