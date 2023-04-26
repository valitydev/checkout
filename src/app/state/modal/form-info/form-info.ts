import { Named } from '../named';
import { PaymentStatus } from './payment-status';

export enum FormName {
    paymentMethods = 'paymentMethods',
    cardForm = 'cardForm',
    resultForm = 'resultForm',
    walletForm = 'walletForm',
    walletProviders = 'walletProviders',
    tokenProviderForm = 'tokenProviderForm',
    helpForm = 'helpForm',
    noAvailablePaymentMethodForm = 'noAvailablePaymentMethodForm',
    redirectForm = 'redirectForm',
    paymentTerminalBankCard = 'paymentTerminalBankCard',
    paymentTerminalForm = 'paymentTerminalForm',
    paymentTerminalSelector = 'paymentTerminalSelector',
    qrCodeInteractionForm = 'qrCodeInteractionForm'
}

export abstract class FormInfo implements Named {
    name: FormName;
    active: boolean;
    paymentStatus?: PaymentStatus;

    constructor(public previous?: FormName) {}
}
