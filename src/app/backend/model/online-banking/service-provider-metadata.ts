export interface ServiceProviderMetadata {
    logo?: {
        src: string;
        backgroundColor?: string;
    };
    form: Array<{
        name: string;
        type: JSX.IntrinsicElements['input']['type'];
        required?: boolean;
        pattern?: string;
    }>;
}
