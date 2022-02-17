import { resolveIntegrationType } from './resolve-integration-type';
import { IntegrationType } from 'checkout/config';

it('empty config should return null', () => {
    const result = resolveIntegrationType(null);
    expect(result).toEqual(null);
});

it('wrong config should return null', () => {
    const result = resolveIntegrationType({
        wrongField: 'some value'
    } as any);
    expect(result).toEqual(null);
});

it('should return invoice integration type', () => {
    const result = resolveIntegrationType({
        invoiceID: 'mock invoiceID',
        invoiceAccessToken: 'mock token',
        someField: 'someValue'
    } as any);
    const expected = {
        integrationType: IntegrationType.invoice,
        invoiceID: 'mock invoiceID',
        invoiceAccessToken: 'mock token'
    };
    expect(result).toEqual(expected);
});

it('should return invoiceTemplate integration type', () => {
    const result = resolveIntegrationType({
        invoiceTemplateID: 'mock invoiceTemplateID',
        invoiceTemplateAccessToken: 'mock token',
        someField: 'someValue'
    } as any);
    const expected = {
        integrationType: IntegrationType.invoiceTemplate,
        invoiceTemplateID: 'mock invoiceTemplateID',
        invoiceTemplateAccessToken: 'mock token'
    };
    expect(result).toEqual(expected);
});
