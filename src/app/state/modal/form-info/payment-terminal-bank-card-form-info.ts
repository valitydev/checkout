import { PaymentStatus } from 'checkout/state';
import { FormInfo, FormName } from './form-info';

export class PaymentTerminalBankCardFormInfo extends FormInfo {
    name = FormName.paymentTerminalBankCard;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(previous?: FormName) {
        super(previous);
    }
}
