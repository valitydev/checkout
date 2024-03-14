import { ServiceProviderMetadataField } from '../../../../common/backend/payments';

export const sortByIndex = (a: ServiceProviderMetadataField, b: ServiceProviderMetadataField) => a?.index - b?.index;
