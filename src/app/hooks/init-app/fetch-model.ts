import {
    getInvoiceByID,
    getInvoicePaymentMethods,
    getInvoiceTemplateByID,
    getInvoicePaymentMethodsByTemplateID,
} from 'checkout/backend';
import { InitConfig } from 'checkout/config';

import { getServiceProviders } from './get-service-providers';
import { Model } from './types';

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

const isInvoiceParams = (params: InitConfig): params is InvoiceParams => params.integrationType === 'invoice';
const isInvoiceTemplateParams = (params: InitConfig): params is InvoiceTemplateParams =>
    params.integrationType === 'invoiceTemplate';

const resolveInvoiceTemplate = async (
    endpoint: string,
    { invoiceTemplateID, invoiceTemplateAccessToken }: InvoiceTemplateParams,
): Promise<Model> => {
    const [invoiceTemplate, paymentMethods] = await Promise.all([
        getInvoiceTemplateByID(endpoint, invoiceTemplateAccessToken, invoiceTemplateID),
        getInvoicePaymentMethodsByTemplateID(endpoint, invoiceTemplateAccessToken, invoiceTemplateID),
    ]);
    const serviceProviders = await getServiceProviders(paymentMethods, endpoint, invoiceTemplateAccessToken);
    return { paymentMethods, invoiceTemplate, serviceProviders };
};

const resolveInvoice = async (endpoint: string, { invoiceID, invoiceAccessToken }: InvoiceParams): Promise<Model> => {
    const [invoice, paymentMethods] = await Promise.all([
        getInvoiceByID(endpoint, invoiceAccessToken, invoiceID),
        getInvoicePaymentMethods(endpoint, invoiceAccessToken, invoiceID),
    ]);
    const serviceProviders = await getServiceProviders(paymentMethods, endpoint, invoiceAccessToken);
    return { paymentMethods, invoice, serviceProviders, invoiceAccessToken };
};

export const fetchModel = async (endpoint: string, initConfig: InitConfig): Promise<Model> => {
    if (isInvoiceParams(initConfig)) {
        return resolveInvoice(endpoint, initConfig);
    }
    if (isInvoiceTemplateParams(initConfig)) {
        return resolveInvoiceTemplate(endpoint, initConfig);
    }
    throw new Error('Incorrect init model params');
};
