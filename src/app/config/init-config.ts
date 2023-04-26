import { HoldExpirationType } from 'checkout/backend';
import { IntegrationType } from './integration-type';
import { PaymentMethodName } from './payment-method-name';

export class InitConfig {
    integrationType?: IntegrationType;
    invoiceID?: string;
    invoiceAccessToken?: string;
    invoiceTemplateID?: string;
    invoiceTemplateAccessToken?: string;
    bankCard?: boolean;
    wallets?: boolean;
    onlineBanking?: boolean;
    netBanking?: boolean;
    upi?: boolean;
    terminalBankCard?: boolean;
    terminalWallets?: boolean;
    pix?: boolean;
    paymentFlowHold?: boolean;
    holdExpiration?: HoldExpirationType;
    locale?: string;
    redirectUrl?: string;
    name?: string;
    description?: string;
    email?: string;
    phoneNumber?: string;
    amount?: number;
    obscureCardCvv?: boolean;
    requireCardHolder?: boolean;
    initialPaymentMethod?: PaymentMethodName;
    recurring?: boolean;
    theme?: string;
    brandless?: boolean;
    metadata?: object;
    terminalFormValues?: object;
    skipUserInteraction?: boolean;
    isExternalIDIncluded?: boolean;
}
