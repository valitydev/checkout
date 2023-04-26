import { CheckResult, UnavailableReason } from 'checkout/sagas/log-unavailable-result';
import { InitConfig, IntegrationType, PaymentMethodName as PaymentMethodNameConfig } from 'checkout/config';

const checkBankCard = (bankCard: boolean): CheckResult => {
    if (!bankCard) {
        return {
            available: false,
            reason: UnavailableReason.capability,
            message: "BankCard disabled (Integration param 'bankCard':'false')."
        };
    }
    return { available: true };
};

const checkForInvoiceAndTemplate = (initConfig: InitConfig): CheckResult => {
    const { initialPaymentMethod, bankCard } = initConfig;
    switch (initialPaymentMethod) {
        case PaymentMethodNameConfig.bankCard:
            return checkBankCard(bankCard);
        default:
            return {
                available: false,
                reason: UnavailableReason.capability,
                message: `Value '${initialPaymentMethod}' is not supported.`
            };
    }
};

export const checkInitialPaymentMethod = (initConfig: InitConfig): CheckResult => {
    const { initialPaymentMethod, integrationType } = initConfig;
    if (initialPaymentMethod === null) {
        return { available: true };
    }
    switch (integrationType) {
        case IntegrationType.invoiceTemplate:
        case IntegrationType.invoice:
            return checkForInvoiceAndTemplate(initConfig);
    }
};
