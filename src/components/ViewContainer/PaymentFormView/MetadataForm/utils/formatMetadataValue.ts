import { ServiceProviderMetadataField } from 'checkout/backend/payments';
import { isNil, replaceSpaces } from 'checkout/utils';

const toResultValue = (field: ServiceProviderMetadataField, formValue: string) => {
    switch (field.type) {
        case 'tel':
            return replaceSpaces(formValue);
        default:
            return formValue;
    }
};

export function formatMetadataValue<T extends Record<string, any>>(
    form: ServiceProviderMetadataField[],
    formMetadata: T,
): T {
    if (!form) {
        return formMetadata;
    }

    return form.reduce(
        (acc, field) => {
            const formValue = formMetadata[field.name as keyof T];
            return isNil(formValue)
                ? acc
                : {
                      ...acc,
                      [field.name]: toResultValue(field, formValue as string),
                  };
        },
        { ...formMetadata },
    );
}
