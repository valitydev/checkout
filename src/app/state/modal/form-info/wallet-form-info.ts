import { ServiceProvider } from 'checkout/backend';
import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class WalletFormInfo extends FormInfo {
    paymentStatus: PaymentStatus;
    activeProvider: ServiceProvider;

    constructor(activeProvider: ServiceProvider, previous?: FormName) {
        super(previous);
        this.name = FormName.walletForm;
        this.active = true;
        this.paymentStatus = PaymentStatus.pristine;
        this.activeProvider = activeProvider;
    }
}
