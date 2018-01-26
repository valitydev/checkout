import { HoldExpirationType } from 'checkout/backend';
import { IntegrationType } from './integration-type';

export class InitConfig {
    integrationType: IntegrationType;
    terminals: boolean;
    wallets: boolean;
    paymentFlowHold: boolean;
    holdExpiration: HoldExpirationType;
    locale: string;
    popupMode: boolean;
    redirectUrl?: string;
    name?: string;
    description?: string;
    email?: string;

    constructor() {
        this.terminals = true;
        this.wallets = true;
        this.paymentFlowHold = false;
        this.holdExpiration = HoldExpirationType.cancel;
        this.locale = 'auto';
        this.popupMode = false;
    }
}
