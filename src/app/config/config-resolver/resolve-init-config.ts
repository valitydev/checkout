import { resolveBoolean } from './resolve-boolean';
import { resolveInteger } from './resolve-integer';
import { InitConfig } from '../init-config';
import { resolveIntegrationType } from './resolve-integration-type';
import { UserConfig } from './user-config';
import { resolveString } from './resolve-string';
import { HoldExpirationType } from 'checkout/backend/model';
import { PaymentMethodName } from 'checkout/config/payment-method-name';
import { DEFAULT_THEME } from 'checkout/themes';
import { resolveObject } from './resolve-object';
import { detectLocale } from '../../../locale';
import { resolveRedirectUrl } from './resolve-redirect-url';
import { resolveEmail } from './resolve-email';
import { resolvePhoneNumber } from './resolve-phone-number';

const setDefault = <P, D>(userParam: P, defaultValue: D): P | D =>
    userParam === null || userParam === undefined ? defaultValue : userParam;

const checkUnknown = (resolvedParams: object, allParams: object): void => {
    const resolvedParamsKeys = Object.keys(resolvedParams);
    const unknownParams = Object.keys(allParams).filter(
        (param) => resolvedParamsKeys.findIndex((v) => v === param) === -1
    );
    if (unknownParams.length) {
        console.warn(`Unknown params: ${unknownParams.join(', ')}`);
    }
};

export const resolveInitConfig = (userConfig: UserConfig): InitConfig => {
    const resolvedIntegrationType = resolveIntegrationType(userConfig);
    if (!resolvedIntegrationType) {
        throw { code: 'error.unrecognized.integration.type' };
    }
    const {
        name,
        description,
        email,
        phoneNumber,
        amount,
        obscureCardCvv,
        requireCardHolder,
        redirectUrl,
        paymentFlowHold,
        holdExpiration,
        locale,
        initialPaymentMethod,
        recurring,
        theme,
        brandless,
        metadata,
        terminalFormValues,
        wallets,
        bankCard,
        applePay,
        googlePay,
        samsungPay,
        yandexPay,
        mobileCommerce,
        onlineBanking,
        netBanking,
        upi,
        terminalBankCard,
        terminalWallets,
        pix,
        skipUserInteraction,
        isExternalIDIncluded,
        ...restParams
    } = userConfig;
    checkUnknown(resolvedIntegrationType, restParams);
    return {
        ...resolvedIntegrationType,
        name: resolveString(name, 'name'),
        description: resolveString(description, 'description'),
        email: resolveEmail(resolveString(email, 'email')),
        phoneNumber: resolvePhoneNumber(resolveString(phoneNumber, 'phoneNumber')),
        amount: resolveInteger(amount, 'amount'),
        obscureCardCvv: resolveBoolean(obscureCardCvv, 'obscureCardCvv'),
        requireCardHolder: resolveBoolean(requireCardHolder, 'requireCardHolder'),
        redirectUrl: resolveRedirectUrl(resolveString(redirectUrl, 'redirectUrl')),
        paymentFlowHold: setDefault(resolveBoolean(paymentFlowHold, 'paymentFlowHold'), false),
        holdExpiration: setDefault(
            resolveString(holdExpiration, 'holdExpiration') as HoldExpirationType,
            HoldExpirationType.cancel
        ),
        locale: detectLocale(resolveString(locale, 'locale')),
        initialPaymentMethod: resolveString(initialPaymentMethod, 'initialPaymentMethod') as PaymentMethodName,
        recurring: setDefault(resolveBoolean(recurring, 'recurring'), false),
        theme: setDefault(resolveString(theme, 'theme'), DEFAULT_THEME.name),
        brandless: setDefault(resolveBoolean(brandless, 'brandless'), true),
        metadata: setDefault(resolveObject(metadata, 'metadata'), undefined),
        terminalFormValues: setDefault(resolveObject(terminalFormValues, 'terminalFormValues'), undefined),
        wallets: setDefault(resolveBoolean(wallets, 'wallets'), true),
        bankCard: setDefault(resolveBoolean(bankCard, 'bankCard'), true),
        applePay: setDefault(resolveBoolean(applePay, 'applePay'), true),
        googlePay: setDefault(resolveBoolean(googlePay, 'googlePay'), true),
        samsungPay: setDefault(resolveBoolean(samsungPay, 'samsungPay'), true),
        yandexPay: setDefault(resolveBoolean(yandexPay, 'yandexPay'), true),
        mobileCommerce: setDefault(resolveBoolean(mobileCommerce, 'mobileCommerce'), true),
        onlineBanking: setDefault(resolveBoolean(onlineBanking, 'onlineBanking'), true),
        netBanking: setDefault(resolveBoolean(netBanking, 'netBanking'), true),
        upi: setDefault(resolveBoolean(upi, 'upi'), true),
        terminalBankCard: setDefault(resolveBoolean(terminalBankCard, 'terminalBankCard'), true),
        terminalWallets: setDefault(resolveBoolean(terminalWallets, 'terminalWallets'), true),
        pix: setDefault(resolveBoolean(pix, 'pix'), true),
        skipUserInteraction: setDefault(resolveBoolean(skipUserInteraction, 'skipUserInteraction'), false),
        isExternalIDIncluded: setDefault(resolveBoolean(isExternalIDIncluded, 'isExternalIDIncluded'), false)
    };
};
