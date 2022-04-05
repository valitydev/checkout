export const METADATA_NAMESPACE = 'dev.vality.checkout';

export interface ServiceProviderMetadataField {
    name: string;
    type: JSX.IntrinsicElements['input']['type'];
    required: boolean;
    pattern?: string;
}

export interface ServiceProviderMetadata {
    [METADATA_NAMESPACE]: {
        form?: ServiceProviderMetadataField[];
    };
}
