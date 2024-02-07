import { PayerType, PaymentResourcePayer } from 'checkout/backend';

import { createPaymentResource } from './createPaymentResource';
import { createSessionInfo } from './createSessionInfo';
import { toContactInfo } from './toContactInfo';
import { toPaymentTool } from './toPaymentTool';
import { CommonPaymentModel, InvoiceContext } from '../../paymentModel';
import { StartPaymentPayload } from '../types';

export const createPayer = async (
    model: CommonPaymentModel,
    invoiceContext: InvoiceContext,
    payload: StartPaymentPayload,
): Promise<PaymentResourcePayer> => {
    const { apiEndpoint, initContext } = model;
    const { invoiceParams } = invoiceContext;
    const paymentTool = toPaymentTool(payload);
    const [{ paymentToolToken, paymentSession }, sessionInfo] = await Promise.all([
        createPaymentResource(apiEndpoint, invoiceParams.invoiceAccessToken, paymentTool),
        createSessionInfo(model, invoiceContext, payload),
    ]);
    const contactInfo = toContactInfo(initContext.contactInfo, payload.values);
    return {
        payerType: PayerType.PaymentResourcePayer,
        paymentToolToken,
        paymentSession,
        contactInfo,
        sessionInfo,
    };
};
