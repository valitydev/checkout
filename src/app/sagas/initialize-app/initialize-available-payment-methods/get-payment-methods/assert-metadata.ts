import { metadataNamespace, ServiceProviderMetadata } from 'checkout/backend';
import { isNil } from 'lodash-es';
import { assertServiceFormField } from './assert-service-form-field';
import { logPrefix } from 'checkout/log-messages';

export function assertMetadata(name: string, metadata: ServiceProviderMetadata) {
    if (!isNil(metadata[metadataNamespace]?.form)) {
        const errors = metadata[metadataNamespace].form
            .map((field) => assertServiceFormField(field))
            .filter((err) => !!err);
        if (errors.length) {
            console.error(`${logPrefix} ${name} form has errors: ${errors.join('; ')}`);
        }
    }
}
