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
import { InvoiceContext, InvoiceParams, InvoiceTemplateContext, InvoiceTemplateParams } from './types';

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
    { invoiceTemplateID, invoiceTemplateAccessToken }: InvoiceTemplateParams,
): Promise<BackendModelInvoiceTemplate> => {
    const [invoiceTemplate, paymentMethods] = await Promise.all([
        getInvoiceTemplateByID(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID),
        getInvoicePaymentMethodsByTemplateID(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID),
    ]);
    const serviceProviders = await getServiceProviders(paymentMethods, apiEndpoint, invoiceTemplateAccessToken);
    return { type: 'BackendModelInvoiceTemplate', paymentMethods, invoiceTemplate, serviceProviders };
};

const getInvoiceModel = async (
    apiEndpoint: string,
    { invoiceID, invoiceAccessToken }: InvoiceParams,
): Promise<BackendModelInvoice> => {
    const [invoice, paymentMethods] = await Promise.all([
        getInvoiceByID(apiEndpoint, invoiceAccessToken, invoiceID),
        getInvoicePaymentMethods(apiEndpoint, invoiceAccessToken, invoiceID),
    ]);
    const serviceProviders = await getServiceProviders(paymentMethods, apiEndpoint, invoiceAccessToken);
    return { type: 'BackendModelInvoice', paymentMethods, invoice, serviceProviders };
};

export const getBackendModel = async (
    apiEndpoint: string,
    context: Partial<InvoiceTemplateContext | InvoiceContext>,
): Promise<BackendModel> => {
    switch (context.type) {
        case 'InvoiceTemplateContext':
            return getInvoiceTemplateModel(apiEndpoint, context.invoiceTemplateParams);
        case 'InvoiceContext':
            return getInvoiceModel(apiEndpoint, context.invoiceParams);
    }
};
