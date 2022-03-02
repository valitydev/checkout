import { METADATA_NAMESPACE, ServiceProviderMetadata } from 'checkout/backend';
import { isNil } from 'lodash-es';
import { assertServiceFormField } from './assert-service-form-field';
import { logPrefix } from 'checkout/log-messages';

export function assertMetadata(name: string, metadata: ServiceProviderMetadata) {
    if (!isNil(metadata[METADATA_NAMESPACE]?.form)) {
        const errors = metadata[METADATA_NAMESPACE].form
            .map((field) => assertServiceFormField(field))
            .filter((err) => !!err);
        if (errors.length) {
            console.error(`${logPrefix} ${name} form has errors: ${errors.join('; ')}`);
        }
    }
}
