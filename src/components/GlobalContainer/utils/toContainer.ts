import { Container } from '../types';
import { PaymentModelChange } from '../usePaymentModel';

export const toContainer = (paymentModelState: PaymentModelChange): Container => {
    switch (paymentModelState.status) {
        case 'PRISTINE':
            return { name: 'viewContainer' };
        case 'PAYMENT_STATE_CHANGED':
            return { name: 'viewContainer' };
        default:
            return { name: 'viewContainer' };
    }
};
