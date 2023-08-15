import { PaymentStatus } from './payment-status';
import { Named } from '../named';

export enum FormName {
    paymentMethods = 'paymentMethods',
    cardForm = 'cardForm',
    resultForm = 'resultForm',
    walletForm = 'walletForm',
    walletProviders = 'walletProviders',
    noAvailablePaymentMethodForm = 'noAvailablePaymentMethodForm',
    redirectForm = 'redirectForm',
    paymentTerminalForm = 'paymentTerminalForm',
    paymentTerminalSelector = 'paymentTerminalSelector',
    qrCodeInteractionForm = 'qrCodeInteractionForm',
}

export abstract class FormInfo implements Named {
    name: FormName;
    active: boolean;
    paymentStatus?: PaymentStatus;

    constructor(public previous?: FormName) {}
}
