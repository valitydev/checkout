import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class OnlineBankingFormInfo extends FormInfo {
    name = FormName.onlineBankingForm;
    active = true;
    paymentStatus = PaymentStatus.pristine;
}
