export interface ServiceProviderMetadataField {
    name: string;
    type: JSX.IntrinsicElements['input']['type'];
    required?: boolean;
    pattern?: string;
}

export interface ServiceProviderMetadata {
    form?: ServiceProviderMetadataField[];
}
