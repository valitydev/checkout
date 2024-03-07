import { HoldExpirationType } from 'checkout/backend/model';

import { resolveBoolean } from './resolve-boolean';
import { resolveEmail } from './resolve-email';
import { resolveInteger } from './resolve-integer';
import { resolveIntegrationType } from './resolve-integration-type';
import { resolveObject } from './resolve-object';
import { resolvePhoneNumber } from './resolve-phone-number';
import { resolveRedirectUrl } from './resolve-redirect-url';
import { resolveString } from './resolve-string';
import { detectLocale } from '../../../locale';
import { InitConfig } from '../init-config';

const setDefault = <P, D>(userParam: P, defaultValue: D): P | D =>
    userParam === null || userParam === undefined ? defaultValue : userParam;

const checkUnknown = (resolvedParams: object, allParams: object): void => {
    const resolvedParamsKeys = Object.keys(resolvedParams);
    const unknownParams = Object.keys(allParams).filter(
        (param) => resolvedParamsKeys.findIndex((v) => v === param) === -1,
    );
    if (unknownParams.length) {
        console.warn(`Unknown params: ${unknownParams.join(', ')}`);
    }
};

export const resolveInitConfig = (userConfig: Partial<InitConfig>): InitConfig => {
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
        recurring,
        brandless,
        metadata,
        terminalFormValues,
        wallets,
        bankCard,
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
        name: resolveString(name),
        description: resolveString(description),
        email: resolveEmail(resolveString(email)),
        phoneNumber: resolvePhoneNumber(resolveString(phoneNumber)),
        amount: resolveInteger(amount),
        obscureCardCvv: resolveBoolean(obscureCardCvv),
        requireCardHolder: resolveBoolean(requireCardHolder),
        redirectUrl: resolveRedirectUrl(resolveString(redirectUrl)),
        paymentFlowHold: setDefault(resolveBoolean(paymentFlowHold), false),
        holdExpiration: setDefault(resolveString(holdExpiration) as HoldExpirationType, HoldExpirationType.cancel),
        locale: detectLocale(resolveString(locale)),
        recurring: setDefault(resolveBoolean(recurring), false),
        brandless: setDefault(resolveBoolean(brandless), true),
        metadata: setDefault(resolveObject(metadata), undefined),
        terminalFormValues: setDefault(resolveObject(terminalFormValues), undefined),
        wallets: setDefault(resolveBoolean(wallets), true),
        bankCard: setDefault(resolveBoolean(bankCard), true),
        onlineBanking: setDefault(resolveBoolean(onlineBanking), true),
        netBanking: setDefault(resolveBoolean(netBanking), true),
        upi: setDefault(resolveBoolean(upi), true),
        terminalBankCard: setDefault(resolveBoolean(terminalBankCard), true),
        terminalWallets: setDefault(resolveBoolean(terminalWallets), true),
        pix: setDefault(resolveBoolean(pix), true),
        skipUserInteraction: setDefault(resolveBoolean(skipUserInteraction), false),
        isExternalIDIncluded: setDefault(resolveBoolean(isExternalIDIncluded), false),
    };
};
