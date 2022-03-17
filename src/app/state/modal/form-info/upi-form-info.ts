import { ServiceProvider } from 'checkout/backend';
import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class UPIFormInfo extends FormInfo {
    name = FormName.upiForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(public serviceProvider: ServiceProvider, previous?: FormName) {
        super(previous);
    }
}
