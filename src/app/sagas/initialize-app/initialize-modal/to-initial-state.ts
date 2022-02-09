import { ModalState, NoAvailablePaymentMethodFormInfo, PaymentMethod, PaymentMethodsFormInfo } from 'checkout/state';
import { PaymentMethodName as PaymentMethodNameConfig } from 'checkout/config';
import { toInitialForm } from './to-initial-form';
import { toInitialModal } from './to-initial-modal';

export const toInitialState = (methods: PaymentMethod[], initialPaymentMethod: PaymentMethodNameConfig): ModalState => {
    if (methods.length === 0) {
        return toInitialModal([new NoAvailablePaymentMethodFormInfo()]);
    }

    // const isMultiMethods = methods.length > 1;
    // const formInfo = initialPaymentMethod
    //     ? toInitialPaymentMethod(isMultiMethods, initialPaymentMethod)
    //     : toInitialForm(isMultiMethods, methods[0]);
    //return toInitialModal(formInfo);

    if (methods.length > 1) {
        return toInitialModal([new PaymentMethodsFormInfo()]);
    }
    if (methods.length === 1) {
        return toInitialModal([toInitialForm(methods[0])]);
    }
};
