import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class PaymentTerminalFormInfo extends FormInfo {
    name = FormName.paymentTerminalForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(
        public providerID: string,
        previous?: FormName,
    ) {
        super(previous);
    }
}
