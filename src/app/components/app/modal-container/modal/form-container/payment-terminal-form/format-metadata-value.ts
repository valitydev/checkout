import { ServiceProviderMetadataField } from 'checkout/backend';
import { replaceSpaces } from 'checkout/utils';

export function formatMetadataValue<T>(form: ServiceProviderMetadataField[], formMetadata: T): T {
    if (!form) {
        return formMetadata;
    }
    return form.reduce((acc, curr) => {
        let value;
        switch (curr.type) {
            case 'tel':
                value = replaceSpaces(formMetadata[curr.name]);
                break;
            default:
                value = formMetadata[curr.name];
        }
        return {
            ...acc,
            [curr.name]: value
        };
    }, {} as T);
}
