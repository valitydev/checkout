import { FlowType, Payment, createPayment as request } from 'checkout/backend';

import { createPayer } from './payer';
import { StartPaymentPayload } from './types';
import { PaymentModelInvoice } from '../paymentModel';

export const createPayment = async (model: PaymentModelInvoice, payload: StartPaymentPayload): Promise<Payment> => {
    const payer = await createPayer(model, payload);
    const { isExternalIDIncluded, metadata } = model.initContext;
    const params = {
        flow: {
            type: FlowType.PaymentFlowInstant,
        },
        payer,
        metadata,
        makeRecurrent: false,
        externalID: isExternalIDIncluded ? model.externalID : undefined,
    };
    const { invoiceID, invoiceAccessToken } = model.invoiceParams;
    return await request(model.apiEndpoint, invoiceAccessToken, invoiceID, params);
};
