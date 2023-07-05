import { ServiceProviderMetadataField } from 'checkout/backend';
import isNil from 'checkout/utils/is-nil';
import replaceSpaces from 'checkout/utils/replace-spaces';

const toResultValue = (field: ServiceProviderMetadataField, formValue) => {
    switch (field.type) {
        case 'tel':
            return replaceSpaces(formValue);
        default:
            return formValue;
    }
};

export function formatMetadataValue<T>(form: ServiceProviderMetadataField[], formMetadata: T): T {
    if (!form) {
        return formMetadata;
    }
    return form.reduce((acc, field) => {
        const formValue = formMetadata[field.name];
        return isNil(formValue)
            ? acc
            : {
                  ...acc,
                  [field.name]: toResultValue(field, formValue)
              };
    }, {} as T);
}
