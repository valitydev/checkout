import { InitContext } from './types';
import { InitConfig } from '../init';
import { isNil } from '../utils';

const toContactInfo = ({ phoneNumber, email }: InitConfig) => ({
    phoneNumber: isNil(phoneNumber) ? undefined : phoneNumber,
    email: isNil(email) ? undefined : email,
});

export const toInitContext = (initConfig: InitConfig): InitContext => ({
    skipUserInteraction: initConfig?.skipUserInteraction || false,
    terminalFormValues: initConfig.terminalFormValues,
    paymentMetadata: initConfig.metadata,
    isExternalIDIncluded: initConfig.isExternalIDIncluded,
    contactInfo: toContactInfo(initConfig),
    redirectUrl: initConfig.redirectUrl,
    metadata: initConfig.metadata,
    recurring: initConfig.recurring,
});
