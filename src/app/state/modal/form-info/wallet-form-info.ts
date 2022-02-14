import { KnownDigitalWalletProviders } from 'checkout/state';
import { FormInfo, FormName } from './form-info';
import { PaymentStatus } from './payment-status';

export class WalletFormInfo extends FormInfo {
    paymentStatus: PaymentStatus;
    activeProvider: KnownDigitalWalletProviders;

    constructor(activeProvider: KnownDigitalWalletProviders, previous?: FormName) {
        super(previous);
        this.name = FormName.walletForm;
        this.active = true;
        this.paymentStatus = PaymentStatus.pristine;
        this.activeProvider = activeProvider;
    }
}
