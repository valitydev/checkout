import { getServiceProviders } from './getServiceProviders';
import { InvoiceContext, InvoiceParams, InvoiceTemplateContext, InvoiceTemplateParams } from './types';
import {
    Invoice,
    InvoiceTemplate,
    PaymentMethod,
    ServiceProvider,
    getInvoiceByID,
    getInvoicePaymentMethods,
    getInvoicePaymentMethodsByTemplateID,
    getInvoiceTemplateByID,
} from '../backend/payments';
import { withRetry } from '../utils';

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
    const getInvoiceTemplateByIDWithRetry = withRetry(getInvoiceTemplateByID);
    const getInvoicePaymentMethodsByTemplateIDWithRetry = withRetry(getInvoicePaymentMethodsByTemplateID);
    const [invoiceTemplate, paymentMethods] = await Promise.all([
        getInvoiceTemplateByIDWithRetry(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID),
        getInvoicePaymentMethodsByTemplateIDWithRetry(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID),
    ]);
    const serviceProviders = await getServiceProviders(paymentMethods, apiEndpoint, invoiceTemplateAccessToken);
    return { type: 'BackendModelInvoiceTemplate', paymentMethods, invoiceTemplate, serviceProviders };
};

const getInvoiceModel = async (
    apiEndpoint: string,
    { invoiceID, invoiceAccessToken }: InvoiceParams,
): Promise<BackendModelInvoice> => {
    const getInvoiceByIDWithRetry = withRetry(getInvoiceByID);
    const getInvoicePaymentMethodsWithRetry = withRetry(getInvoicePaymentMethods);
    const [invoice, paymentMethods] = await Promise.all([
        getInvoiceByIDWithRetry(apiEndpoint, invoiceAccessToken, invoiceID),
        getInvoicePaymentMethodsWithRetry(apiEndpoint, invoiceAccessToken, invoiceID),
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
