import { ServiceProviderMetadataField } from 'checkout/backend/payments';

export const sortByIndex = (a: ServiceProviderMetadataField, b: ServiceProviderMetadataField) => a?.index - b?.index;
