import { FormInfo, FormName } from '../form-info';

export class PaymentMethodsFormInfo extends FormInfo {
    name = FormName.paymentMethods;

    constructor(public active = true) {
        super();
    }
}
