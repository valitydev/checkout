import { ClientInfo } from './paymentModel';
import { fetchApi } from '../../utils';

export type PaymentTerminalData = {
    paymentToolType: 'PaymentTerminalData';
    provider: string;
    metadata: Record<string, any>;
};

export type CardData = {
    paymentToolType: 'CardData';
    cardNumber: string;
    expDate: string;
    cvv: string;
    cardHolder?: string;
};

export type PaymentTool = CardData | PaymentTerminalData;

export type PaymentResourceParams = {
    paymentTool: PaymentTool;
    clientInfo: ClientInfo;
};

export const createPaymentResource = async (
    capiEndpoint: string,
    accessToken: string,
    params: PaymentResourceParams,
) => {
    const path = `v2/processing/payment-resources`;
    const response = await fetchApi(capiEndpoint, accessToken, 'POST', path, params);
    return response.json();
};
