import { all, call, put, select } from 'redux-saga/effects';
import { initializeModel } from './initialize-model';
import { TypeKeys } from 'checkout/actions';
import { IntegrationType, InvoiceInitConfig, InvoiceTemplateInitConfig } from 'checkout/config';
import {
    resolveIntegrationType,
    resolveInvoice,
    resolveInvoiceTemplate
} from 'checkout/sagas/initialize-app/initialize-model';
import {
    getInvoiceByID,
    getInvoiceEvents,
    getInvoicePaymentMethods,
    getInvoicePaymentMethodsByTemplateID,
    getInvoiceTemplateByID
} from 'checkout/backend';

const endpoint = 'http://test.endpoint';

const initConfigInvoiceTemplate = {
    integrationType: IntegrationType.invoiceTemplate,
    invoiceTemplateID: 'invoiceTemplateIDTest',
    invoiceTemplateAccessToken: 'testTokenTemplate'
} as InvoiceTemplateInitConfig;

const initConfigInvoice = {
    integrationType: IntegrationType.invoice,
    invoiceID: 'invoiceIDTest',
    invoiceAccessToken: 'testTokenInvoice'
} as InvoiceInitConfig;

describe('initializeModel', () => {
    const iterator = initializeModel(endpoint, initConfigInvoiceTemplate);

    it('should call resolveIntegrationType', () => {
        const actual = iterator.next().value;
        const expected = call(resolveIntegrationType, endpoint, initConfigInvoiceTemplate);
        expect(actual).toEqual(expected);
    });

    it('should put model', () => {
        const model = {};
        const actual = iterator.next(model).value;
        const expected = put({ type: TypeKeys.INITIALIZE_MODEL_COMPLETED, payload: model });
        expect(actual).toEqual(expected);
    });

    it('should select model', () => {
        const actual = iterator.next().value;
        const expected = select();
        expect(actual.toString()).toEqual(expected.toString());
    });
});

describe('resolveIntegrationType', () => {
    it('should call resolveInvoiceTemplate', () => {
        const iterator = resolveIntegrationType(endpoint, initConfigInvoiceTemplate);
        const actual = iterator.next().value;
        const expected = call(resolveInvoiceTemplate, endpoint, initConfigInvoiceTemplate);
        expect(actual).toEqual(expected);
    });

    it('should call resolveInvoice', () => {
        const iterator = resolveIntegrationType(endpoint, initConfigInvoice);
        const actual = iterator.next().value;
        const expected = call(resolveInvoice, endpoint, initConfigInvoice);
        expect(actual).toEqual(expected);
    });
});

describe('resolveInvoiceTemplate', () => {
    const iterator = resolveInvoiceTemplate(endpoint, initConfigInvoiceTemplate);

    it('should fetch invoice template and invoice payment methods', () => {
        const actual = iterator.next().value;
        const token = initConfigInvoiceTemplate.invoiceTemplateAccessToken;
        const id = initConfigInvoiceTemplate.invoiceTemplateID;
        const expected = all([
            call(getInvoiceTemplateByID, endpoint, token, id),
            call(getInvoicePaymentMethodsByTemplateID, endpoint, token, id)
        ]);
        expect(actual).toEqual(expected);
    });

    it('should return model chunk', () => {
        const invoiceTemplate = 'template mock';
        const paymentMethods = 'methods mock';
        const actual = iterator.next([invoiceTemplate, paymentMethods]);
        const expected = { invoiceTemplate, paymentMethods };
        expect(actual.value).toEqual(expected);
        expect(actual.done).toBe(true);
    });
});

describe('resolveInvoice', () => {
    const iterator = resolveInvoice(endpoint, initConfigInvoice);

    it('should fetch invoice, invoice events, invoice payment methods', () => {
        const actual = iterator.next().value;
        const token = initConfigInvoice.invoiceAccessToken;
        const id = initConfigInvoice.invoiceID;
        const expected = all([
            call(getInvoiceByID, endpoint, token, id),
            call(getInvoiceEvents, endpoint, token, id),
            call(getInvoicePaymentMethods, endpoint, token, id)
        ]);
        expect(actual).toEqual(expected);
    });

    it('should return model chunk', () => {
        const invoiceEvents = 'events mock';
        const paymentMethods = 'methods mock';
        const invoice = 'mock invoice';
        const actual = iterator.next([invoice, invoiceEvents, paymentMethods]);
        const expected = {
            events: invoiceEvents,
            paymentMethods,
            invoiceAccessToken: initConfigInvoice.invoiceAccessToken,
            invoice
        };
        expect(actual.value).toEqual(expected);
        expect(actual.done).toBe(true);
    });
});
