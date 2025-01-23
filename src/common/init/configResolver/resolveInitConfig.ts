import { resolveBoolean } from './resolveBoolean';
import { resolveEmail } from './resolveEmail';
import { resolveIntegrationType } from './resolveIntegrationType';
import { resolveObject } from './resolveObject';
import { resolvePhoneNumber } from './resolvePhoneNumber';
import { resolveRedirectUrl } from './resolveRedirectUrl';
import { resolveString } from './resolveString';
import { detectLocale } from '../../utils';
import { InitConfig } from '../types';

const setDefault = <P, D>(userParam: P, defaultValue: D): P | D =>
    userParam === null || userParam === undefined ? defaultValue : userParam;

export const resolveInitConfig = (userConfig: Partial<InitConfig>): InitConfig => {
    const resolvedIntegrationType = resolveIntegrationType(userConfig);
    if (!resolvedIntegrationType) {
        throw new Error('Unrecognized integration type');
    }
    const {
        name,
        description,
        obscureCardCvv,
        requireCardHolder,
        redirectUrl,
        cancelUrl,
        locale,
        recurring,
        metadata,
        terminalFormValues,
        skipUserInteraction,
        isExternalIDIncluded,
        theme,
        paymentFlow,
        deepLink,
        email,
        phoneNumber,
        dateOfBirth,
        documentId,
    } = userConfig;
    return {
        ...resolvedIntegrationType,
        name: resolveString(name),
        description: resolveString(description),
        obscureCardCvv: resolveBoolean(obscureCardCvv),
        requireCardHolder: resolveBoolean(requireCardHolder),
        redirectUrl: resolveRedirectUrl(resolveString(redirectUrl)),
        cancelUrl: resolveRedirectUrl(resolveString(cancelUrl)),
        locale: detectLocale(resolveString(locale)),
        recurring: setDefault(resolveBoolean(recurring), false),
        metadata: setDefault(resolveObject(metadata), undefined),
        terminalFormValues: setDefault(resolveObject(terminalFormValues), undefined),
        skipUserInteraction: setDefault(resolveBoolean(skipUserInteraction), false),
        isExternalIDIncluded: setDefault(resolveBoolean(isExternalIDIncluded), true),
        theme: resolveString(theme),
        paymentFlow: resolveObject(paymentFlow),
        deepLink: resolveString(deepLink),
        email: resolveEmail(resolveString(email)),
        phoneNumber: resolvePhoneNumber(resolveString(phoneNumber)),
        dateOfBirth,
        documentId,
    };
};
