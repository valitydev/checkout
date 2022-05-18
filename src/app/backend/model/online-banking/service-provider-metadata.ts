export const METADATA_NAMESPACE = 'dev.vality.checkout';

export interface MetadataFieldLocalization {
    ja?: string;
    en?: string;
    ru?: string;
}

export interface ServiceProviderMetadataField {
    name: string;
    type: JSX.IntrinsicElements['input']['type'];
    required: boolean;
    pattern?: string;
    localization?: MetadataFieldLocalization;
    index?: number;
}

export interface ServiceProviderLogoMetadata {
    src: string;
    width: string;
    height: string;
}

export interface CheckoutServiceProviderMetadata {
    form?: ServiceProviderMetadataField[];
    logo?: ServiceProviderLogoMetadata;
    signUpLink?: string;
}

export interface ServiceProviderMetadata {
    [METADATA_NAMESPACE]: CheckoutServiceProviderMetadata;
}
