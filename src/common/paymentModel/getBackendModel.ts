import {
    Invoice,
    InvoiceTemplate,
    PaymentMethod,
    ServiceProvider,
    getInvoiceByID,
    getInvoicePaymentMethods,
    getInvoicePaymentMethodsByTemplateID,
    getInvoiceTemplateByID,
} from 'checkout/backend';

import { getServiceProviders } from './getServiceProviders';
import { InvoiceContext, InvoiceTemplateContext } from './types';

type CommonBackendModel = {
    paymentMethods: PaymentMethod[];
    serviceProviders: ServiceProvider[];
};

export type BackendModelInvoice = {
    type: 'BackendModelInvoice';
    invoice: Invoice;
} & CommonBackendModel;

export type BackendModelInvoiceTemplate = {
    type: 'BackendModelInvoiceTemplate';
    invoiceTemplate: InvoiceTemplate;
} & CommonBackendModel;

export type BackendModel = BackendModelInvoice | BackendModelInvoiceTemplate;

const getInvoiceTemplateModel = async (
    apiEndpoint: string,
    { invoiceTemplateID, invoiceTemplateAccessToken }: InvoiceTemplateContext,
): Promise<BackendModelInvoiceTemplate> => {
    try {
        const [invoiceTemplate, paymentMethods] = await Promise.all([
            getInvoiceTemplateByID(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID),
            getInvoicePaymentMethodsByTemplateID(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID),
        ]);
        const serviceProviders = await getServiceProviders(paymentMethods, apiEndpoint, invoiceTemplateAccessToken);

        return { type: 'BackendModelInvoiceTemplate', paymentMethods, invoiceTemplate, serviceProviders };
    } catch (error) {
        console.error('Error fetching invoice template model:', error);
        throw error;
    }
};

const getInvoiceModel = async (
    apiEndpoint: string,
    { invoiceID, invoiceAccessToken }: InvoiceContext,
): Promise<BackendModelInvoice> => {
    try {
        const [invoice, paymentMethods] = await Promise.all([
            getInvoiceByID(apiEndpoint, invoiceAccessToken, invoiceID),
            getInvoicePaymentMethods(apiEndpoint, invoiceAccessToken, invoiceID),
        ]);
        const serviceProviders = await getServiceProviders(paymentMethods, apiEndpoint, invoiceAccessToken);
        return { type: 'BackendModelInvoice', paymentMethods, invoice, serviceProviders };
    } catch (error) {
        console.error('Error fetching invoice model:', error);
        throw error;
    }
};

export const getBackendModel = async (
    apiEndpoint: string,
    invoiceContext: InvoiceContext | InvoiceTemplateContext,
): Promise<BackendModel> => {
    switch (invoiceContext.type) {
        case 'InvoiceTemplateContext':
            return getInvoiceTemplateModel(apiEndpoint, invoiceContext);
        case 'InvoiceContext':
            return getInvoiceModel(apiEndpoint, invoiceContext);
    }
};
