import { ModalState, NoAvailablePaymentMethodFormInfo, PaymentMethodsFormInfo } from 'checkout/state';
import { toInitialForm } from './to-initial-form';
import { toInitialModal } from './to-initial-modal';
import { PaymentMethod } from 'checkout/hooks/init-available-payment-methods';

export const toInitialState = (methods: PaymentMethod[]): ModalState => {
    if (methods.length === 1) {
        return toInitialModal([toInitialForm(methods[0])]);
    }
    if (methods.length === 0) {
        return toInitialModal([new NoAvailablePaymentMethodFormInfo()]);
    }
    if (methods.length > 1) {
        return toInitialModal([new PaymentMethodsFormInfo()]);
    }
};
