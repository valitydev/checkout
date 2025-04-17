import { PaymentFlow, PaymentFlowHold, PaymentFlowInstant } from 'checkout/backend/payments';

import { InitContext, InitContextContactInfo } from './types';
import { InitConfig } from '../init';
import { isNil } from '../utils';

const toContactInfo = ({
    phoneNumber,
    email,
    dateOfBirth,
    documentId,
    firstName,
    lastName,
}: InitConfig): InitContextContactInfo => {
    const formatField = (value: string | boolean | undefined) => {
        if (isNil(value) || value === false) return undefined;
        if (value === true) return true;
        return String(value);
    };

    return {
        phoneNumber: isNil(phoneNumber) ? undefined : phoneNumber,
        email: isNil(email) ? undefined : email,
        dateOfBirth: formatField(dateOfBirth),
        documentId: formatField(documentId),
        firstName: formatField(firstName),
        lastName: formatField(lastName),
    };
};

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
