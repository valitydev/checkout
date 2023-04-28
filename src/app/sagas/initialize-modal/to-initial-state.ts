import { ModalState, NoAvailablePaymentMethodFormInfo, PaymentMethodsFormInfo } from 'checkout/state';
import { PaymentMethodName as PaymentMethodNameConfig } from 'checkout/config';
import { toInitialForm } from './to-initial-form';
import { toInitialModal } from './to-initial-modal';
import { logPrefix } from 'checkout/log-messages';
import { PaymentMethod } from 'checkout/hooks/init-available-payment-methods';

export const toInitialState = (methods: PaymentMethod[], initialPaymentMethod: PaymentMethodNameConfig): ModalState => {
    if (initialPaymentMethod) {
        // TODO implement this later
        console.warn(`${logPrefix} initialPaymentMethod param is not supported`);
    }
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
