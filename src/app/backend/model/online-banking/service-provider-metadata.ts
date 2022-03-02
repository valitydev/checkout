export const metadataNamespace = 'dev.vality.checkout';

export interface ServiceProviderMetadataField {
    name: string;
    type: JSX.IntrinsicElements['input']['type'];
    required?: boolean;
    pattern?: string;
}

export interface ServiceProviderMetadata {
    metadataNamespace: {
        form?: ServiceProviderMetadataField[];
    };
}
