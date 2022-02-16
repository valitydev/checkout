import { ServiceProviderMetadata } from 'checkout/backend';
import { isNil } from 'lodash-es';
import { assertServiceFormField } from './assert-service-form-field';

export function assertMetadata(name: string, metadata: ServiceProviderMetadata) {
    if (!isNil(metadata?.form)) {
        const errors = metadata.form.map((field) => assertServiceFormField(field)).filter((err) => !!err);
        if (errors) {
            console.error(`${name} form has errors: ${errors.join('; ')}`);
        }
    }
}
