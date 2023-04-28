import { KnownProviderCategories } from 'checkout/hooks/init-available-payment-methods';
import { FormInfo, FormName } from './form-info';

export class PaymentTerminalSelectorFormInfo extends FormInfo {
    name = FormName.paymentTerminalSelector;
    active = true;

    constructor(public category: KnownProviderCategories, previous?: FormName) {
        super(previous);
    }
}
