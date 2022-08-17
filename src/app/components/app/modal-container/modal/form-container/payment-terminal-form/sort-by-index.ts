import { ServiceProviderMetadataField } from 'checkout/backend';

export const sortByIndex = (a: ServiceProviderMetadataField, b: ServiceProviderMetadataField) => a.index - b.index;
