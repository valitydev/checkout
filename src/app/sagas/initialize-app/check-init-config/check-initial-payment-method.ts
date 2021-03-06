import { CheckResult, UnavailableReason } from 'checkout/sagas/log-unavailable-result';
import { InitConfig, IntegrationType, PaymentMethodName as PaymentMethodNameConfig } from 'checkout/config';
import { BankCardTokenProvider, PaymentMethod, PaymentMethodName } from 'checkout/backend';

const checkBankCard = (bankCard: boolean, paymentMethods: PaymentMethod[]): CheckResult => {
    if (!bankCard) {
        return {
            available: false,
            reason: UnavailableReason.capability,
            message: "BankCard disabled (Integration param 'bankCard':'false')."
        };
    }
    const found = paymentMethods.find(
        (method: PaymentMethod & { tokenProviders?: BankCardTokenProvider[] }) =>
            method.method === PaymentMethodName.BankCard && !Array.isArray(method.tokenProviders)
    );
    return found
        ? { available: true }
        : {
              available: false,
              reason: UnavailableReason.capability,
              message: "Value 'bankCard' can not applied. Payment method BankCard is not available for merchant."
          };
};

const checkTokenizedBankCard = (
    isMethod: boolean,
    paymentMethods: PaymentMethod[],
    tokenProvider: BankCardTokenProvider,
    humanReadableParamName: string,
    paramName: string
) => {
    if (!isMethod) {
        const humanReadableParamNameWithCapital = `${humanReadableParamName[0].toUpperCase() +
            humanReadableParamName.slice(1)}`;
        return {
            available: false,
            reason: UnavailableReason.capability,
            message: `${humanReadableParamNameWithCapital} disabled (Integration param '${paramName}':'false').`
        };
    }
    const tokenizedPaymentMethod = paymentMethods.find(
        (method: PaymentMethod & { tokenProviders?: BankCardTokenProvider[] }) =>
            method.method === PaymentMethodName.BankCard &&
            Array.isArray(method.tokenProviders) &&
            method.tokenProviders.findIndex((provider) => provider === tokenProvider) >= 0
    );
    return tokenizedPaymentMethod
        ? { available: true }
        : {
              available: false,
              reason: UnavailableReason.capability,
              message: `Value '${paramName}' can not applied. Token provider '${tokenProvider}' for payment method 'BankCard' is not available for merchant.`
          };
};

const checkMobileCommerce = (mobileCommerce: boolean, paymentMethods: PaymentMethod[]): CheckResult => {
    if (!mobileCommerce) {
        return {
            available: false,
            reason: UnavailableReason.capability,
            message: "Mobile commerce disabled (Integration param 'mobileCommerce':'false')."
        };
    }
    const found = paymentMethods.find((method) => method.method === PaymentMethodName.MobileCommerce);
    return found
        ? { available: true }
        : {
              available: false,
              reason: UnavailableReason.capability,
              message:
                  "Value 'mobileCommerce' can not applied. Payment method mobileCommerce is not available for merchant."
          };
};

const checkForInvoiceAndTemplate = (initConfig: InitConfig, paymentMethods: PaymentMethod[]): CheckResult => {
    const { initialPaymentMethod, bankCard, applePay, googlePay, samsungPay, mobileCommerce } = initConfig;
    switch (initialPaymentMethod) {
        case PaymentMethodNameConfig.bankCard:
            return checkBankCard(bankCard, paymentMethods);
        case PaymentMethodNameConfig.applePay:
            return checkTokenizedBankCard(
                applePay,
                paymentMethods,
                BankCardTokenProvider.applepay,
                'apple pay',
                'applePay'
            );
        case PaymentMethodNameConfig.googlePay:
            return checkTokenizedBankCard(
                googlePay,
                paymentMethods,
                BankCardTokenProvider.googlepay,
                'google pay',
                'googlePay'
            );
        case PaymentMethodNameConfig.samsungPay:
            return checkTokenizedBankCard(
                samsungPay,
                paymentMethods,
                BankCardTokenProvider.samsungpay,
                'samsung pay',
                'samsungPay'
            );
        case PaymentMethodNameConfig.mobileCommerce:
            return checkMobileCommerce(mobileCommerce, paymentMethods);
        default:
            return {
                available: false,
                reason: UnavailableReason.capability,
                message: `Value '${initialPaymentMethod}' is not supported.`
            };
    }
};

export const checkInitialPaymentMethod = (initConfig: InitConfig, paymentMethods: PaymentMethod[]): CheckResult => {
    const { initialPaymentMethod, integrationType } = initConfig;
    if (initialPaymentMethod === null) {
        return { available: true };
    }
    switch (integrationType) {
        case IntegrationType.invoiceTemplate:
        case IntegrationType.invoice:
            return checkForInvoiceAndTemplate(initConfig, paymentMethods);
    }
};
