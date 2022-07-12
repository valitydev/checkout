import { Locale } from 'checkout/locale';
import { FormInfo, PaymentMethod, FormName } from 'checkout/state';
import { PaymentRequestedPayload } from 'checkout/actions';

export interface MethodProps {
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
    pay: (payload: PaymentRequestedPayload) => any;
    amountPrefilled: boolean;
    emailPrefilled: boolean;
    phoneNumberPrefilled: boolean;
    method: PaymentMethod;
    prevFormName: FormName;
    localeCode: string;
}
