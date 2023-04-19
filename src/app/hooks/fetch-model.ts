import {
    Invoice,
    InvoiceTemplate,
    PaymentMethod,
    ServiceProvider,
    getInvoiceByID,
    getInvoiceEvents,
    getInvoicePaymentMethods,
    Event,
    getInvoiceTemplateByID,
    getInvoicePaymentMethodsByTemplateID
} from 'checkout/backend';

import { getServiceProviders } from '../sagas/initialize-app/get-service-providers';

export type Model = {
    invoiceTemplate?: InvoiceTemplate;
    events?: Event[];
    paymentMethods?: PaymentMethod[];
    invoiceAccessToken?: string;
    invoice?: Invoice;
    serviceProviders?: ServiceProvider[];
};

type InvoiceTemplateParams = {
    integrationType: 'invoiceTemplate';
    invoiceTemplateID: string;
    invoiceTemplateAccessToken: string;
};
type InvoiceParams = {
    integrationType: 'invoice';
    invoiceID: string;
    invoiceAccessToken: string;
};
export type InitModelParams = InvoiceParams | InvoiceTemplateParams;

const isInvoiceParams = (params: InitModelParams): params is InvoiceParams => params.integrationType === 'invoice';
const isInvoiceTemplateParams = (params: InitModelParams): params is InvoiceTemplateParams =>
    params.integrationType === 'invoiceTemplate';

const resolveInvoiceTemplate = async (
    endpoint: string,
    { invoiceTemplateID, invoiceTemplateAccessToken }: InvoiceTemplateParams
): Promise<Model> => {
    const invoiceTemplate = await getInvoiceTemplateByID(endpoint, invoiceTemplateAccessToken, invoiceTemplateID);
    const paymentMethods = await getInvoicePaymentMethodsByTemplateID(
        endpoint,
        invoiceTemplateAccessToken,
        invoiceTemplateID
    );
    const serviceProviders = await getServiceProviders(paymentMethods, endpoint, invoiceTemplateAccessToken);
    return { paymentMethods, invoiceTemplate, serviceProviders };
};

const resolveInvoice = async (endpoint: string, { invoiceID, invoiceAccessToken }: InvoiceParams): Promise<Model> => {
    const invoice = await getInvoiceByID(endpoint, invoiceAccessToken, invoiceID);
    const events = await getInvoiceEvents(endpoint, invoiceAccessToken, invoiceID);
    const paymentMethods = await getInvoicePaymentMethods(endpoint, invoiceAccessToken, invoiceID);
    const serviceProviders = await getServiceProviders(paymentMethods, endpoint, invoiceAccessToken);
    return { paymentMethods, invoice, events, serviceProviders, invoiceAccessToken };
};

export const fetchModel = async (endpoint: string, params: InitModelParams): Promise<Model> => {
    if (isInvoiceParams(params)) {
        return resolveInvoice(endpoint, params);
    }
    if (isInvoiceTemplateParams(params)) {
        return resolveInvoiceTemplate(endpoint, params);
    }
    throw new Error('Incorrect init model params');
};
