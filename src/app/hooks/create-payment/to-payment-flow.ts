import { FlowType, PaymentFlow } from 'checkout/backend';

import { PaymentFlowParams } from './types';

export const toPaymentFlow = ({ paymentFlowHold, holdExpiration }: PaymentFlowParams): PaymentFlow => {
    const hold = {
        type: FlowType.PaymentFlowHold,
        onHoldExpiration: holdExpiration,
    };
    const instant = { type: FlowType.PaymentFlowInstant };
    return paymentFlowHold ? hold : instant;
};
