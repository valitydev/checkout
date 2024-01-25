import { InitParams } from 'checkout/initialize';

import { toInitContext } from './toInitContext';

describe('toInitContext', () => {
    it('should correctly transform InitParams to InitContext for InvoiceContext', () => {
        const initParams = {
            appConfig: {
                capiEndpoint: 'https://api.example.com',
                // ... other appConfig properties
            },
            initConfig: {
                integrationType: 'invoice',
                invoiceID: '123',
                invoiceAccessToken: 'token123',
                // ... other initConfig properties
            },
        } as InitParams;

        const expected = {
            invoiceContext: {
                type: 'InvoiceContext',
                invoiceID: '123',
                invoiceAccessToken: 'token123',
            },
            apiEndpoint: 'https://api.example.com',
        };

        const result = toInitContext(initParams);
        expect(result).toEqual(expected);
    });

    it('should correctly transform InitParams to InitContext for InvoiceTemplateContext', () => {
        const initParams = {
            appConfig: {
                capiEndpoint: 'https://api.example.com',
                // ... other appConfig properties if needed
            },
            initConfig: {
                integrationType: 'invoiceTemplate',
                invoiceTemplateID: 'template123',
                invoiceTemplateAccessToken: 'tokenTemplate123',
                // ... other initConfig properties specific to InvoiceTemplateContext
            },
        } as InitParams;

        const expected = {
            invoiceContext: {
                type: 'InvoiceTemplateContext',
                invoiceTemplateID: 'template123',
                invoiceTemplateAccessToken: 'tokenTemplate123',
            },
            apiEndpoint: 'https://api.example.com',
        };

        const result = toInitContext(initParams);
        expect(result).toEqual(expected);
    });
});
