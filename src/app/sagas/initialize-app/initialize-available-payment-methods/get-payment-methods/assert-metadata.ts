import { METADATA_NAMESPACE, ServiceProviderMetadata } from 'checkout/backend';
import { isNil } from 'lodash-es';
import { assertServiceFormField } from './assert-service-form-field';
import { logPrefix } from 'checkout/log-messages';

export function assertMetadata(name: string, serviceProviderMetadata: ServiceProviderMetadata) {
    const metadata = serviceProviderMetadata && serviceProviderMetadata[METADATA_NAMESPACE];
    if (!isNil(metadata) && !isNil(metadata?.form)) {
        const errors = metadata.form.map((field) => assertServiceFormField(field)).filter((err) => !!err);
        if (errors.length) {
            console.error(`${logPrefix} ${name} form has errors: ${errors.join('; ')}`);
        }
    }
}
