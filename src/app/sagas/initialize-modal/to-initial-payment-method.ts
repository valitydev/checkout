import { CardFormInfo, FormInfo, FormName, PaymentMethodsFormInfo } from 'checkout/state';

const toInitialFormInfo = (isMultiMethods: boolean): FormInfo => {
    const previous = isMultiMethods ? FormName.paymentMethods : null;
    return new CardFormInfo(previous);
};

export const toInitialPaymentMethod = (isMultiMethods: boolean): FormInfo[] => {
    const initialFormInfo = toInitialFormInfo(isMultiMethods);
    const initialPaymentMethods = new PaymentMethodsFormInfo();
    initialPaymentMethods.active = false;
    return isMultiMethods ? [initialPaymentMethods, initialFormInfo] : [initialFormInfo];
};
