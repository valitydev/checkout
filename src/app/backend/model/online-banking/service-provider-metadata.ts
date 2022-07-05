export const METADATA_NAMESPACE = 'dev.vality.checkout';

export interface MetadataTextLocalization {
    ja?: string;
    en?: string;
    ru?: string;
    pt?: string;
}

export interface ServiceProviderMetadataField {
    name: string;
    type: JSX.IntrinsicElements['input']['type'];
    required: boolean;
    pattern?: string;
    localization?: MetadataTextLocalization;
    index?: number;
}

export interface ServiceProviderLogoMetadata {
    src: string;
    width: string;
    height: string;
}

export interface ServiceProviderTitleMetadata {
    icon: 'wallets' | 'online-banking';
    localization?: MetadataTextLocalization;
}

export interface ServiceProviderContactInfo {
    email: boolean;
    phoneNumber: boolean;
}

export interface CheckoutServiceProviderMetadata {
    form?: ServiceProviderMetadataField[];
    logo?: ServiceProviderLogoMetadata;
    title?: ServiceProviderTitleMetadata;
    signUpLink?: string;
    contactInfo?: ServiceProviderContactInfo;
}

export interface ServiceProviderMetadata {
    [METADATA_NAMESPACE]: CheckoutServiceProviderMetadata;
}
