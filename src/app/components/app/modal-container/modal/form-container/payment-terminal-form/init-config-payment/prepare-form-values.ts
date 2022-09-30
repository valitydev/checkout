import isNil from 'lodash-es/isNil';

import { ServiceProviderMetadataField } from 'checkout/backend';
import { PaymentTerminalFormValues } from 'checkout/state';

export const prepareFormValues = (
    form: ServiceProviderMetadataField[],
    terminalFormValues: object
): Partial<PaymentTerminalFormValues> => ({
    metadata: form.reduce((acc, formField) => {
        const value = terminalFormValues[formField.name];
        if (isNil(value)) {
            return acc;
        }
        if (formField.pattern && !new RegExp(formField.pattern).test(value)) {
            return acc;
        }
        return {
            ...acc,
            [formField.name]: value
        };
    }, {})
});
