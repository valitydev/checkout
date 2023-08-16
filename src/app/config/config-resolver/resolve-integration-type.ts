import intersection from 'checkout/utils/intersection';

import { InitConfig } from '../init-config';

const typesDef: {
    type: 'invoiceTemplate' | 'invoice';
    requiredFields: string[];
}[] = [
    {
        type: 'invoiceTemplate',
        requiredFields: ['invoiceTemplateID', 'invoiceTemplateAccessToken'],
    },
    {
        type: 'invoice',
        requiredFields: ['invoiceID', 'invoiceAccessToken'],
    },
];

export const resolveIntegrationType = (userConfig: InitConfig): InitConfig => {
    if (!userConfig) {
        return null;
    }
    const configFields = Object.keys(userConfig);
    const found = typesDef.find((typeDef) => intersection(typeDef.requiredFields, configFields).length === 2);
    if (!found) {
        return null;
    }
    return found.requiredFields.reduce(
        (acc, current) => ({
            ...acc,
            [current]: (userConfig as { [param: string]: string })[current],
        }),
        { integrationType: found.type },
    );
};
