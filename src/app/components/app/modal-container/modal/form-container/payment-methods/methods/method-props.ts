import { Locale } from 'checkout/locale';
import { FormInfo, FormName } from 'checkout/state';
import { AppContext, PaymentRequestedPayload } from 'checkout/actions';
import { PaymentMethod } from 'checkout/hooks';

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
    context: AppContext;
}
