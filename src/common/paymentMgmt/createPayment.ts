import { createPayer } from './payer';
import { StartPaymentPayload } from './types';
import { Payment, PaymentParams, createPayment as request } from '../backend/payments';
import { CommonPaymentModel, InvoiceContext } from '../paymentModel';
import { withRetry } from '../utils';

export const createPayment = async (
    model: CommonPaymentModel,
    invoiceContext: InvoiceContext,
    payload: StartPaymentPayload,
): Promise<Payment> => {
    const payer = await createPayer(model, invoiceContext, payload);
    const { isExternalIDIncluded, metadata, recurring } = model.initContext;
    const params: PaymentParams = {
        flow: {
            type: 'PaymentFlowInstant',
        },
        payer,
        metadata,
        makeRecurrent: recurring,
        externalID: isExternalIDIncluded ? invoiceContext.externalID : undefined,
    };
    const { invoiceID, invoiceAccessToken } = invoiceContext.invoiceParams;
    const createPaymentWithRetry = withRetry(request);
    return await createPaymentWithRetry(model.apiEndpoint, invoiceAccessToken, invoiceID, params);
};
