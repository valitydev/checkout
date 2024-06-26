import { InitContext } from './types';
import { InitConfig } from '../init';
import { isNil } from '../utils';

const toContactInfo = ({ phoneNumber, email }: InitConfig) => ({
    phoneNumber: isNil(phoneNumber) ? undefined : phoneNumber,
    email: isNil(email) ? undefined : email,
});

export const toInitContext = (initConfig: InitConfig): InitContext => ({
    skipUserInteraction: initConfig?.skipUserInteraction,
    isExternalIDIncluded: initConfig?.isExternalIDIncluded,
    terminalFormValues: initConfig.terminalFormValues,
    paymentMetadata: initConfig.metadata,
    contactInfo: toContactInfo(initConfig),
    redirectUrl: initConfig.redirectUrl,
    metadata: initConfig.metadata,
    recurring: initConfig.recurring,
});
