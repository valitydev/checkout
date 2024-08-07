import { isNil } from 'checkout/utils';

import { backendModelToPaymentAmount } from './backendModelToPaymentAmount';
import { backendModelToPaymentMethods } from './backendModelToPaymentMethods';
import { BackendModel, BackendModelInvoice, BackendModelInvoiceTemplate, getBackendModel } from './getBackendModel';
import { toInitContext } from './toInitContext';
import { toInvoiceContext } from './toInvoiceContext';
import { InvoiceContext, InvoiceTemplateContext, PaymentModel } from './types';
import { InitParams } from '../init';

const applyInvoice = (
    { invoiceParams, type }: Partial<InvoiceContext>,
    { invoice: { dueDate, externalID, status, amountRandomized } }: BackendModelInvoice,
): InvoiceContext => ({
    type,
    invoiceParams,
    dueDate,
    externalID,
    status,
    isAmountRandomized: !isNil(amountRandomized),
});

const applyInvoiceTemplate = (
    { invoiceTemplateParams, type }: Partial<InvoiceTemplateContext>,
    { invoiceTemplate: { metadata, externalID } }: BackendModelInvoiceTemplate,
): InvoiceTemplateContext => ({
    type,
    invoiceTemplateParams,
    metadata,
    externalID,
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
        serviceProviders: backendModel.serviceProviders,
    };
    return result;
};
