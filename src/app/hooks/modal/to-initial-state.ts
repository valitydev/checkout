import {
    FormInfo,
    ModalForms,
    ModalState,
    NoAvailablePaymentMethodFormInfo,
    PaymentMethodsFormInfo
} from 'checkout/state';

import { PaymentMethod } from '../init-app';
import { toInitialForm } from './to-initial-form';

const toInitialModal = (formInfo: FormInfo[]): ModalForms => new ModalForms(formInfo, true);

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