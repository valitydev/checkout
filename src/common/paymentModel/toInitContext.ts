import { InitConfig } from 'checkout/config';

import { InitContext } from './types';
import { isNil } from '../utils';

const toContactInfo = ({ phoneNumber, email }: InitConfig) => {
    if (isNil(phoneNumber) && isNil(email)) {
        return undefined;
    }
    return {
        phoneNumber,
        email,
    };
};

export const toInitContext = (initConfig: InitConfig): InitContext => ({
    terminalFormValues: initConfig.terminalFormValues,
    paymentMetadata: initConfig.metadata,
    isExternalIDIncluded: initConfig.isExternalIDIncluded,
    contactInfo: toContactInfo(initConfig),
});
