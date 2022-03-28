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
    onlineBankingForm = 'onlineBankingForm',
    onlineBankingAccountForm = 'onlineBankingAccountForm',
    noAvailablePaymentMethodForm = 'noAvailablePaymentMethodForm',
    upiForm = 'upiForm',
    redirectForm = 'redirectForm',
    paymentTerminalBankCard = 'paymentTerminalBankCard'
}

export abstract class FormInfo implements Named {
    name: FormName;
    active: boolean;
    paymentStatus?: PaymentStatus;

    constructor(public previous?: FormName) {}
}
