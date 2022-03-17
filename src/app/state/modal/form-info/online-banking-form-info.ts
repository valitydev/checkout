import { KnownProviderCategories } from 'checkout/state/payment-method';
import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class OnlineBankingFormInfo extends FormInfo {
    name = FormName.onlineBankingForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(public category: KnownProviderCategories, public previous?: FormName) {
        super(previous);
    }
}
