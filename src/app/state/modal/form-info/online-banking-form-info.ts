import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export type OnlineBankingSubtype = 'onlineBanking' | 'netBanking';

export class OnlineBankingFormInfo extends FormInfo {
    name = FormName.onlineBankingForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;

    constructor(public subtype: OnlineBankingSubtype, public previous?: FormName) {
        super(previous);
    }
}
