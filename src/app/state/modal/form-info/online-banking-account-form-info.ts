import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';
import { ServiceProvider } from 'checkout/backend';

export class OnlineBankingAccountFormInfo extends FormInfo {
    name = FormName.onlineBankingAccountForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(public serviceProvider: ServiceProvider, previous?: FormName) {
        super(previous);
    }
}
