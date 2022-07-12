import isNil from 'lodash-es/isNil';

import { InitConfig } from 'checkout/config';
import { PayableFormValues } from 'checkout/state';
import { replaceSpaces } from 'checkout/utils';

const getPhoneNumber = (phoneNumber: string | null): string | undefined => {
    if (isNil(phoneNumber)) {
        return undefined;
    }
    return replaceSpaces(phoneNumber);
};

const getEmail = (email: string | null): string | undefined => {
    if (isNil(email)) {
        return undefined;
    }
    return email;
};

export const getContactInfo = (initConfig: InitConfig, { email, phoneNumber }: PayableFormValues) => ({
    email: initConfig.email || getEmail(email),
    phoneNumber: initConfig.phoneNumber || getPhoneNumber(phoneNumber)
});
