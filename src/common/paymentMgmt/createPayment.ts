import { FlowType, Payment, createPayment as request } from 'checkout/backend';

import { createPayer } from './payer';
import { StartPaymentPayload } from './types';
import { CommonPaymentModel, InvoiceContext } from '../paymentModel';

export const createPayment = async (
    model: CommonPaymentModel,
    invoiceContext: InvoiceContext,
    payload: StartPaymentPayload,
): Promise<Payment> => {
    const payer = await createPayer(model, invoiceContext, payload);
    const { isExternalIDIncluded, metadata, recurring } = model.initContext;
    const params = {
        flow: {
            type: FlowType.PaymentFlowInstant,
        },
        payer,
        metadata,
        makeRecurrent: recurring,
        externalID: isExternalIDIncluded ? invoiceContext.externalID : undefined,
    };
    const { invoiceID, invoiceAccessToken } = invoiceContext.invoiceParams;
    return await request(model.apiEndpoint, invoiceAccessToken, invoiceID, params);
};
