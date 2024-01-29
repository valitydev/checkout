import { PayerType, PaymentResourcePayer } from 'checkout/backend';

import { createPaymentResource } from './createPaymentResource';
import { createSessionInfo } from './createSessionInfo';
import { toContactInfo } from './toContactInfo';
import { toPaymentTool } from './toPaymentTool';
import { PaymentModelInvoice } from '../../paymentModel';
import { StartPaymentPayload } from '../types';

export const createPayer = async (
    model: PaymentModelInvoice,
    payload: StartPaymentPayload,
): Promise<PaymentResourcePayer> => {
    const { apiEndpoint, invoiceParams, initContext } = model;
    const paymentTool = toPaymentTool(payload);
    const [{ paymentToolToken, paymentSession }, sessionInfo] = await Promise.all([
        createPaymentResource(apiEndpoint, invoiceParams.invoiceAccessToken, paymentTool),
        createSessionInfo(model, payload),
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
