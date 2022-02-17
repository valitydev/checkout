import { ServiceProviderMetadataField } from 'checkout/backend';
import isNil from 'lodash-es/isNil';

const FIELD_TYPES = ['text', 'number'];

export function assertServiceFormField(field: ServiceProviderMetadataField) {
    const errors = [];
    if (typeof field.name !== 'string' || !field.name.length) {
        errors.push('name is required and should be a string');
    }
    if (!FIELD_TYPES.includes(field.type)) {
        errors.push(`type should be one of these types [${FIELD_TYPES.join(', ')}]`);
    }
    if (!isNil(field.required) && typeof field.required !== 'boolean') {
        errors.push('required should be a boolean');
    }
    if (!isNil(field.pattern) && (typeof field.pattern !== 'string' || !field.pattern.length)) {
        errors.push('pattern should be a string');
    }
    if (errors.length) {
        return `${field?.name} has errors: ${errors.join(', ')}`;
    }
}
