import { Gateway } from './types';
import { fetchApi } from '../../../common/utils';

export const getGateways = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
): Promise<Gateway[]> => {
    const queryParams = new URLSearchParams({
        invoiceId: invoiceID,
        paymentId: paymentID,
    }).toString();
    const path = `p2p/payments/gateways?${queryParams}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return await response.json();
    // return Promise.resolve([
    //     {
    //         id: 'test_01',
    //         name: 'СПБ',
    //     },
    //     {
    //         id: 'test_02',
    //         name: 'Сбербанк',
    //     },
    // ]);
};
