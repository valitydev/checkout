import { KnownProviderCategories } from 'checkout/state';
import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class UPIFormInfo extends FormInfo {
    name = FormName.upiForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(public category: KnownProviderCategories, previous?: FormName) {
        super(previous);
    }
}
