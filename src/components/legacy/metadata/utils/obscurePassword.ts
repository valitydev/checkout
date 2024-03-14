import * as md5 from 'md5';

import { ServiceProviderMetadataField } from '../../../../common/backend/payments';

export const obscurePassword = <T>(formMetadata: ServiceProviderMetadataField[], formValues: T): T => {
    const found = formMetadata.find((field) => field.type === 'password');
    return found
        ? {
              ...formValues,
              [found.name]: md5(formValues[found.name]),
          }
        : formValues;
};
