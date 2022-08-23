export const METADATA_NAMESPACE = 'dev.vality.checkout';

export interface MetadataTextLocalization {
    ja?: string;
    en?: string;
    ru?: string;
    pt?: string;
}

export interface ServiceProviderMetadataField {
    type: JSX.IntrinsicElements['input']['type'];
    name: string;
    required: boolean;
    pattern?: string;
    localization?: MetadataTextLocalization;
    index?: number;
}

export interface ServiceProviderIconMetadata {
    src: string;
    width: string;
    height: string;
}

export interface ServiceProviderTitleMetadata {
    icon: 'wallets' | 'online-banking' | 'bank-card';
    localization?: MetadataTextLocalization;
}

export interface ServiceProviderContactInfo {
    email: boolean;
    phoneNumber: boolean;
}

export interface UserInteractionMetadata {
    type: 'frame' | 'self';
}

export interface CheckoutServiceProviderMetadata {
    form?: ServiceProviderMetadataField[];
    logo?: ServiceProviderIconMetadata;
    title?: ServiceProviderTitleMetadata;
    signUpLink?: string;
    contactInfo?: ServiceProviderContactInfo;
    userInteraction?: UserInteractionMetadata;
}

export interface ServiceProviderMetadata {
    [METADATA_NAMESPACE]: CheckoutServiceProviderMetadata;
}
