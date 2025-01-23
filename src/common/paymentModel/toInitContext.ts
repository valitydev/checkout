import { PaymentFlow, PaymentFlowHold, PaymentFlowInstant } from 'checkout/backend/payments';

import { InitContext } from './types';
import { InitConfig } from '../init';
import { isNil } from '../utils';

const toContactInfo = ({ phoneNumber, email, dateOfBirth, documentId }: InitConfig) => ({
    phoneNumber: isNil(phoneNumber) ? undefined : phoneNumber,
    email: isNil(email) ? undefined : email,
    dateOfBirth: isNil(dateOfBirth) ? undefined : dateOfBirth,
    documentId: isNil(documentId) ? undefined : documentId,
});

const isPaymentFlowInstant = (obj: any): obj is PaymentFlowInstant => {
    if (isNil(obj)) return false;
    return obj.type === 'PaymentFlowInstant';
};

const isPaymentFlowHold = (obj: any): obj is PaymentFlowHold => {
    if (isNil(obj)) return false;
    const isOnHoldExpiration = obj.onHoldExpiration === 'cancel' || obj.onHoldExpiration === 'capture';
    return obj.type === 'PaymentFlowHold' && isOnHoldExpiration;
};

const toPaymentFlow = (paymentFlow: object | null): PaymentFlow => {
    if (isPaymentFlowInstant(paymentFlow)) {
        return paymentFlow;
    }
    if (isPaymentFlowHold(paymentFlow)) {
        return paymentFlow;
    }
    return {
        type: 'PaymentFlowInstant',
    };
};

export const toInitContext = (initConfig: InitConfig): InitContext => ({
    skipUserInteraction: initConfig?.skipUserInteraction,
    isExternalIDIncluded: initConfig?.isExternalIDIncluded,
    terminalFormValues: initConfig.terminalFormValues,
    paymentMetadata: initConfig.metadata,
    contactInfo: toContactInfo(initConfig),
    redirectUrl: initConfig.redirectUrl,
    cancelUrl: initConfig.cancelUrl,
    metadata: initConfig.metadata,
    recurring: initConfig.recurring,
    paymentFlow: toPaymentFlow(initConfig.paymentFlow),
    deepLink: initConfig.deepLink,
});
