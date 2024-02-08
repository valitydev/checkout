import { createContext } from 'react';

import { StartPaymentPayload } from '../paymentMgmt';

export type PaymentModelContextProps = {
    startPayment: (payload: StartPaymentPayload) => void;
    startWaitingPaymentResult: () => void;
};

export const PaymentContext = createContext<PaymentModelContextProps>({
    startPayment: () => {},
    startWaitingPaymentResult: () => {},
});
