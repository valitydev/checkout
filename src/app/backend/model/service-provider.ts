import { ServiceProviderMetadata } from 'checkout/backend';

export class ServiceProvider {
    id: string;
    brandName: string;
    category: string;
    metadata: ServiceProviderMetadata;
}
