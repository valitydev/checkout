import { InitParams } from 'checkout/initialize';

import { backendModelToPaymentAmount } from './backendModelToPaymentAmount';
import { backendModelToPaymentMethods } from './backendModelToPaymentMethods';
import { BackendModel, BackendModelInvoice, BackendModelInvoiceTemplate, getBackendModel } from './getBackendModel';
import { toInitContext } from './toInitContext';
import { toInvoiceContext } from './toInvoiceContext';
import { InvoiceContext, InvoiceTemplateContext, PaymentModel } from './types';

const applyInvoice = (
    { invoiceParams, type }: Partial<InvoiceContext>,
    { invoice: { dueDate, externalID } }: BackendModelInvoice,
): InvoiceContext => ({
    type,
    invoiceParams,
    dueDate,
    externalID,
});

const applyInvoiceTemplate = (
    { invoiceTemplateParams, type }: Partial<InvoiceTemplateContext>,
    { invoiceTemplate: { metadata } }: BackendModelInvoiceTemplate,
): InvoiceTemplateContext => ({
    type,
    invoiceTemplateParams,
    metadata,
});

const applyBackendModel = (
    context: Partial<InvoiceContext | InvoiceTemplateContext>,
    model: BackendModel,
): InvoiceContext | InvoiceTemplateContext => {
    switch (context.type) {
        case 'InvoiceContext':
            if (model.type !== 'BackendModelInvoice')
                throw new Error('Wrong model type. Expected: BackendModelInvoice');
            return applyInvoice(context, model);
        case 'InvoiceTemplateContext':
            if (model.type !== 'BackendModelInvoiceTemplate')
                throw new Error('Wrong model type. Expected: BackendModelInvoiceTemplate');
            return applyInvoiceTemplate(context, model);
    }
};

export const initPaymentModel = async ({ initConfig, appConfig, origin }: InitParams): Promise<PaymentModel> => {
    const partialContext = toInvoiceContext(initConfig);
    const initContext = toInitContext(initConfig);
    const apiEndpoint = appConfig.capiEndpoint;
    const backendModel = await getBackendModel(apiEndpoint, partialContext);
    const paymentAmount = backendModelToPaymentAmount(backendModel);
    const paymentMethods = backendModelToPaymentMethods(backendModel);
    const result: PaymentModel = {
        ...applyBackendModel(partialContext, backendModel),
        apiEndpoint,
        urlShortenerEndpoint: appConfig.urlShortenerEndpoint,
        localeCode: initConfig.locale,
        origin,
        initContext,
        paymentMethods,
        paymentAmount,
    };
    return result;
};
