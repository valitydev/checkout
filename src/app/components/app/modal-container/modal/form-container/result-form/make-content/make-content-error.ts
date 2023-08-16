import { PaymentError } from 'checkout/backend';
import { Locale } from 'checkout/locale';

import { failed } from './make-from-payment-change';
import { ResultFormContent } from './result-form-content';

export const makeContentError = (l: Locale, error: PaymentError): ResultFormContent => failed(l, error);
