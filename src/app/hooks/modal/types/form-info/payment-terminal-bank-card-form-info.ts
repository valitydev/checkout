import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class PaymentTerminalBankCardFormInfo extends FormInfo {
    name = FormName.paymentTerminalBankCard;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(previous?: FormName) {
        super(previous);
    }
}
