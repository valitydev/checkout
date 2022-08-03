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
    mobileCommerceForm = 'mobileCommerceForm',
    mobileCommerceReceiptForm = 'mobileCommerceReceiptForm',
    noAvailablePaymentMethodForm = 'noAvailablePaymentMethodForm',
    redirectForm = 'redirectForm',
    paymentTerminalBankCard = 'paymentTerminalBankCard',
    paymentTerminalForm = 'paymentTerminalForm',
    qrCodeInteractionForm = 'qrCodeInteractionForm'
}

export abstract class FormInfo implements Named {
    name: FormName;
    active: boolean;
    paymentStatus?: PaymentStatus;

    constructor(public previous?: FormName) {}
}
