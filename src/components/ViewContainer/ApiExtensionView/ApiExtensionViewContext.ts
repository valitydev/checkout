import { createContext } from 'react';

export type ApiExtensionViewContextProps = {
    apiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentId: string;
};

export const ApiExtensionViewContext = createContext<ApiExtensionViewContextProps>({
    apiEndpoint: '',
    invoiceAccessToken: '',
    invoiceID: '',
    paymentId: '',
});
