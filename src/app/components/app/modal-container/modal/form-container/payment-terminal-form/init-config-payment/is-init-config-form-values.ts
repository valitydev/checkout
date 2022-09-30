import isNil from 'lodash-es/isNil';

import { ServiceProviderMetadataField } from 'checkout/backend';

export const isInitConfigFormValues = (form: ServiceProviderMetadataField[], terminalFormValues: object): boolean =>
    !isNil(form) && !isNil(terminalFormValues);
