import { KnownProviderCategories } from 'checkout/state/payment-method';
import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class PaymentTerminalFormInfo extends FormInfo {
    name = FormName.paymentTerminalForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(public category: KnownProviderCategories, previous?: FormName) {
        super(previous);
    }
}
