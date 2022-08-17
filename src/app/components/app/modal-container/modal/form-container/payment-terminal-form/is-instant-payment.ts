import isNil from 'lodash-es/isNil';

import { ServiceProviderContactInfo, ServiceProviderMetadataField } from 'checkout/backend';

const isContactInfoRequired = (
    contactInfo: ServiceProviderContactInfo,
    emailFieldVisible: boolean,
    phoneNumberFieldVisible: boolean
): boolean => {
    if (isNil(contactInfo)) {
        return false;
    }
    return emailFieldVisible || phoneNumberFieldVisible;
};

export const isInstantPayment = (
    form: ServiceProviderMetadataField[],
    contactInfo: ServiceProviderContactInfo,
    emailFieldVisible: boolean,
    phoneNumberFieldVisible: boolean
) => isNil(form) && !isContactInfoRequired(contactInfo, emailFieldVisible, phoneNumberFieldVisible);
